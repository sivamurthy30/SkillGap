"""
Backend API for Adaptive Skill Recommendation System
UPDATED VERSION:
✔ Fix ModuleNotFoundError (database import)
✔ Runs from project root
✔ Uses enhanced context features
✔ Port changed to 5001
"""

import os
import sys
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

# =========================================================
# ✅ FIX: Add project root to Python path
# =========================================================
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
sys.path.append(PROJECT_ROOT)

# Now imports will work
from database.db import get_db
from preprocessing.feature_engineering import create_context
from preprocessing.resume_parser import ResumeParser
from preprocessing.github_analyzer import GitHubAnalyzer
from bandit.linucb import LinUCB

# =========================================================
# Flask App Config
# =========================================================
app = Flask(__name__)

app.config["UPLOAD_FOLDER"] = os.path.join(PROJECT_ROOT, "data/uploads")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# =========================================================
# Initialize Database
# =========================================================
db = get_db()

# Load roles dataset
roles = pd.read_csv(os.path.join(PROJECT_ROOT, "data/roles_skills.csv"))

# Initialize Bandit
all_skills = roles.skill.unique().tolist()
bandit = LinUCB(arms=all_skills, n_features=10, alpha=1.0)

# Parsers
resume_parser = ResumeParser()
github_analyzer = GitHubAnalyzer()

ALLOWED_EXTENSIONS = {"pdf", "docx", "txt"}

# =========================================================
# Utility
# =========================================================
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# =========================================================
# Health Check
# =========================================================
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "total_learners": len(db.get_all_learners()),
        "total_skills": len(db.get_all_skills())
    })


# =========================================================
# Create Learner
# =========================================================
@app.route("/learner", methods=["POST"])
def create_learner():
    data = request.json

    success = db.insert_learner(
        learner_id=data["id"],
        target_role=data["target_role"],
        known_skills=data["known_skills"],
        learning_speed=data["learning_speed"]
    )

    if success:
        return jsonify({"message": "Learner created"}), 201
    return jsonify({"error": "Learner exists"}), 400


# =========================================================
# Get All Learners
# =========================================================
@app.route("/learners", methods=["GET"])
def get_learners():
    return jsonify(db.get_all_learners())


# =========================================================
# Resume Upload
# =========================================================
@app.route("/resume/upload", methods=["POST"])
def upload_resume():

    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400

    file = request.files["file"]
    learner_id = request.form.get("learner_id", type=int)

    if not learner_id:
        return jsonify({"error": "learner_id required"}), 400

    if file.filename == "":
        return jsonify({"error": "No filename"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    filename = secure_filename(f"resume_{learner_id}_{file.filename}")
    path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(path)

    try:
        resume_data = resume_parser.parse_resume(path)
        speed = resume_parser.calculate_learning_speed(resume_data)
        resume_data["learning_speed"] = speed

        db.insert_resume_data(learner_id, resume_data, path)

        return jsonify({
            "message": "Resume parsed",
            "skills_found": len(resume_data["skills"]),
            "learning_speed": speed
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================================================
# GitHub Analyze
# =========================================================
@app.route("/github/analyze", methods=["POST"])
def analyze_github():

    data = request.json
    learner_id = data.get("learner_id")
    username = data.get("github_username")

    if not learner_id or not username:
        return jsonify({"error": "Missing fields"}), 400

    try:
        github_data = github_analyzer.analyze_profile(username)
        speed = github_analyzer.calculate_learning_speed(github_data)
        github_data["learning_speed"] = speed

        db.insert_github_profile(learner_id, github_data)

        return jsonify({
            "message": "GitHub analyzed",
            "skills_found": len(github_data["skills"]),
            "activity_score": github_data["activity_score"]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================================================
# Recommend Skill
# =========================================================
@app.route("/recommend", methods=["POST"])
def recommend():

    learner_id = request.json.get("learner_id")

    learner = db.get_learner(learner_id)
    if not learner:
        return jsonify({"error": "Learner not found"}), 404

    resume_data = db.get_resume_data(learner_id)
    github_data = db.get_github_profile(learner_id)

    required = roles[roles.role == learner["target_role"]].skill.tolist()
    known = learner["known_skills"].split(",")

    gap = list(set(required) - set(known))

    if not gap:
        return jsonify({"message": "No gaps"}), 200

    contexts = {
        skill: create_context(skill, learner, resume_data, github_data)
        for skill in gap
    }

    skill = bandit.recommend(contexts)

    return jsonify({
        "learner_id": learner_id,
        "recommended_skill": skill,
        "skill_gap": gap
    })


# =========================================================
# Batch Recommend
# =========================================================
@app.route("/recommend/batch", methods=["POST"])
def recommend_batch():

    learner_id = request.json.get("learner_id")
    top_n = request.json.get("top_n", 3)

    learner = db.get_learner(learner_id)

    required = roles[roles.role == learner["target_role"]].skill.tolist()
    known = learner["known_skills"].split(",")
    gap = list(set(required) - set(known))

    contexts = {s: create_context(s, learner) for s in gap}

    scores = {}
    for arm, x in contexts.items():
        A_inv = np.linalg.inv(bandit.A[arm])
        theta = A_inv @ bandit.b[arm]
        p = theta.T @ x + bandit.alpha * np.sqrt(x.T @ A_inv @ x)
        scores[arm] = p[0][0]

    top = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]

    return jsonify({"recommendations": top})


# =========================================================
# Run Server
# =========================================================
if __name__ == "__main__":

    print("🚀 Skill Recommendation API Running...")
    print("👉 http://localhost:5001/health")

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5001   # ✅ Changed port
    )
