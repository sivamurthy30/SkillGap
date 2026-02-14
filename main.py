import pandas as pd
import numpy as np
from bandit.linucb import LinUCB
from preprocessing.feature_engineering import create_context, create_enhanced_learner_profile
from preprocessing.resume_parser import ResumeParser
from preprocessing.github_analyzer import GitHubAnalyzer
from evaluation.metrics import precision, recall, f1_score
from database.db import get_db
from database.models import load_csv_to_database, get_learners_from_db
from dashboard.visualization import plot_rewards, plot_accuracy
import os

# Initialize database and load data
print("=" * 60)
print("INITIALIZING SKILL RECOMMENDATION SYSTEM")
print("WITH RESUME & GITHUB ANALYSIS")
print("=" * 60)

db = get_db()

# Load CSV data into database (first time setup)
try:
    load_csv_to_database()
except Exception as e:
    print(f"Data already loaded: {e}")

# Get data from database
learners = get_learners_from_db()
roles = pd.read_csv("data/roles_skills.csv")
all_skills = roles.skill.unique().tolist()

print(f"\n📊 Loaded {len(learners)} learners from database")
print(f"📚 Total skills in system: {len(all_skills)}")

# Initialize parsers
resume_parser = ResumeParser()
github_analyzer = GitHubAnalyzer()  # Add token if needed

# ==================== PARSE RESUMES & GITHUB (IF AVAILABLE) ====================

print("\n" + "=" * 60)
print("ANALYZING RESUMES & GITHUB PROFILES")
print("=" * 60)

# Example: Parse resumes for learners (if files exist)
resume_dir = "data/uploads"
github_config_file = "data/github_usernames.csv"  # Optional: learner_id,github_username

enhanced_learners = []

for idx, learner_row in learners.iterrows():
    learner = learner_row.to_dict()
    learner_id = learner['id']
    
    resume_data = None
    github_data = None
    
    # Try to parse resume if file exists
    resume_path = os.path.join(resume_dir, f"resume_{learner_id}.pdf")
    if os.path.exists(resume_path):
        try:
            print(f"📄 Parsing resume for learner {learner_id}...")
            resume_data = resume_parser.parse_resume(resume_path)
            
            # Calculate learning speed from resume
            resume_speed = resume_parser.calculate_learning_speed(resume_data)
            resume_data['learning_speed'] = resume_speed
            
            # Store in database
            db.insert_resume_data(learner_id, resume_data, resume_path)
            
            print(f"   ✓ Found {len(resume_data['skills'])} skills")
            print(f"   ✓ Experience: {resume_data['experience_years']} years")
            print(f"   ✓ Learning speed: {resume_speed}")
        except Exception as e:
            print(f"   ✗ Error parsing resume: {e}")
    
    # Try to analyze GitHub if username mapping exists
    if os.path.exists(github_config_file):
        github_df = pd.read_csv(github_config_file)
        github_row = github_df[github_df['learner_id'] == learner_id]
        
        if not github_row.empty:
            github_username = github_row.iloc[0]['github_username']
            try:
                print(f"🐙 Analyzing GitHub profile: {github_username}...")
                github_data = github_analyzer.analyze_profile(github_username)
                
                # Calculate learning speed from GitHub
                github_speed = github_analyzer.calculate_learning_speed(github_data)
                github_data['learning_speed'] = github_speed
                
                # Store in database
                db.insert_github_profile(learner_id, github_data)
                
                print(f"   ✓ Found {len(github_data['skills'])} skills")
                print(f"   ✓ Languages: {list(github_data['languages'].keys())[:3]}")
                print(f"   ✓ Activity score: {github_data['activity_score']}")
            except Exception as e:
                print(f"   ✗ Error analyzing GitHub: {e}")
    
    # Create enhanced profile
    enhanced = create_enhanced_learner_profile(learner, resume_data, github_data)
    enhanced_learners.append(enhanced)

print(f"\n✓ Processed {len(enhanced_learners)} learner profiles")

# Initialize LinUCB bandit with enhanced features
# Features: 3 base + 4 resume + 3 github = 10 features
bandit = LinUCB(
    arms=all_skills,
    n_features=10,  # Enhanced feature set
    alpha=1.0
)

# Tracking
rewards_log = []
accuracy_log = []
epoch_rewards = []

def get_skill_gap(learner):
    """Get skills needed by learner"""
    required = roles[
        roles.role == learner['target_role']
    ].skill.tolist()
    
    known = learner['known_skills'].split(",")
    gap = list(set(required) - set(known))
    return gap

def calculate_reward(skill, learner, resume_data=None, github_data=None):
    """
    Calculate reward for recommending a skill
    Enhanced with resume and GitHub context
    """
    # Get skill metadata from database
    skill_data = db.get_skill(skill)
    
    if not skill_data:
        return 0.3
    
    difficulty = skill_data['difficulty']
    learning_speed = learner['learning_speed']
    
    # Base reward: skill-learner match
    base_reward = 1.0 - abs(difficulty - (1.0 - learning_speed))
    
    # Bonus: Skill in resume
    if resume_data and skill in resume_data.get('skills', []):
        base_reward += 0.2
    
    # Bonus: Related skills in GitHub
    if github_data:
        github_skills = set([s.lower() for s in github_data.get('skills', [])])
        if skill.lower() in github_skills:
            base_reward += 0.15
    
    # Add noise to simulate real-world variability
    noise = np.random.normal(0, 0.1)
    reward = np.clip(base_reward + noise, 0, 1)
    
    return reward

# ==================== TRAINING LOOP ====================

print("\n" + "=" * 60)
print("STARTING TRAINING WITH ENHANCED FEATURES")
print("=" * 60)

NUM_EPOCHS = 50

for epoch in range(NUM_EPOCHS):
    epoch_reward_sum = 0
    epoch_f1_sum = 0
    epoch_recommendations = 0
    
    for learner in enhanced_learners:
        gap = get_skill_gap(learner)
        
        if not gap:
            continue
        
        # Get enhanced data
        learner_id = learner['id']
        resume_data = db.get_resume_data(learner_id)
        github_data = db.get_github_profile(learner_id)
        
        # Create enhanced contexts for all candidate skills
        contexts = {
            skill: create_context(skill, learner, resume_data, github_data)
            for skill in gap
        }
        
        # Get recommendation from bandit
        recommended_skill = bandit.recommend(contexts)
        
        # Calculate reward with enhanced context
        reward = calculate_reward(recommended_skill, learner, resume_data, github_data)
        
        # Update bandit
        bandit.update(
            recommended_skill,
            reward,
            contexts[recommended_skill]
        )
        
        # Log to database
        db.log_recommendation(
            learner_id=learner['id'],
            skill=recommended_skill,
            reward=reward,
            context=contexts[recommended_skill].flatten()
        )
        
        # Update progress tracking
        status = "completed" if reward > 0.7 else "in_progress"
        db.update_progress(
            learner_id=learner['id'],
            skill_name=recommended_skill,
            status=status,
            score=reward * 100
        )
        
        # Metrics
        p = precision([recommended_skill], gap)
        r = recall([recommended_skill], gap)
        f1 = f1_score(p, r)
        
        rewards_log.append(reward)
        accuracy_log.append(f1)
        
        epoch_reward_sum += reward
        epoch_f1_sum += f1
        epoch_recommendations += 1
    
    # Log epoch metrics to database
    if epoch_recommendations > 0:
        avg_epoch_reward = epoch_reward_sum / epoch_recommendations
        avg_epoch_f1 = epoch_f1_sum / epoch_recommendations
        
        db.log_metrics(
            epoch=epoch + 1,
            avg_reward=avg_epoch_reward,
            avg_f1=avg_epoch_f1,
            total_recs=epoch_recommendations
        )
        
        epoch_rewards.append(avg_epoch_reward)
        
        if (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1}/{NUM_EPOCHS} | Avg Reward: {avg_epoch_reward:.3f} | Avg F1: {avg_epoch_f1:.3f}")

print("\n" + "=" * 60)
print("TRAINING COMPLETED")
print("=" * 60)

# ==================== FINAL RESULTS ====================

print("\n📈 PERFORMANCE SUMMARY:")
print(f"   Total Recommendations: {len(rewards_log)}")
print(f"   Average Reward: {sum(rewards_log)/len(rewards_log):.3f}")
print(f"   Average F1 Score: {sum(accuracy_log)/len(accuracy_log):.3f}")
print(f"   Best Epoch Reward: {max(epoch_rewards):.3f}")
print(f"   Final Epoch Reward: {epoch_rewards[-1]:.3f}")

# ==================== DATA SOURCE ANALYSIS ====================

print("\n" + "=" * 60)
print("DATA SOURCE IMPACT ANALYSIS")
print("=" * 60)

resume_count = sum(1 for l in enhanced_learners if 'resume' in l.get('data_sources', []))
github_count = sum(1 for l in enhanced_learners if 'github' in l.get('data_sources', []))

print(f"\n📊 Data Availability:")
print(f"   Learners with Resume: {resume_count}/{len(enhanced_learners)}")
print(f"   Learners with GitHub: {github_count}/{len(enhanced_learners)}")
print(f"   Both Sources: {sum(1 for l in enhanced_learners if len(l.get('data_sources', [])) == 2)}")

# ==================== DATABASE ANALYTICS ====================

print("\n" + "=" * 60)
print("DATABASE ANALYTICS")
print("=" * 60)

# Most recommended skills
rec_stats = db.get_recommendation_stats()
print("\n🎯 Top 5 Recommended Skills:")
for i, stat in enumerate(rec_stats[:5], 1):
    print(f"   {i}. {stat['skill_recommended']}: {stat['recommendation_count']} times (avg reward: {stat['avg_reward']:.3f})")

# ==================== VISUALIZATIONS ====================

print("\n📊 Generating visualizations...")
plot_rewards(rewards_log)
plot_accuracy(accuracy_log)

print("\n✅ All data saved to database: learners.db")
print("=" * 60)