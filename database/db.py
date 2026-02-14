import sqlite3
from datetime import datetime
import json

class Database:
    def __init__(self, db_path="learners.db"):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row  # Return dict-like rows
        self.create_tables()
    
    def create_tables(self):
        """Create all necessary tables"""
        
        # Learners table
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS learners(
                id INTEGER PRIMARY KEY,
                target_role TEXT NOT NULL,
                known_skills TEXT NOT NULL,
                learning_speed REAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Skills table
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS skills(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                difficulty REAL NOT NULL,
                learning_time INTEGER NOT NULL,
                category TEXT
            )
        """)
        
        # Recommendations table (log all recommendations)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS recommendations(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                learner_id INTEGER NOT NULL,
                skill_recommended TEXT NOT NULL,
                reward REAL,
                context TEXT,
                recommended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (learner_id) REFERENCES learners(id)
            )
        """)
        
        # Learner progress table
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS learner_progress(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                learner_id INTEGER NOT NULL,
                skill_name TEXT NOT NULL,
                status TEXT CHECK(status IN ('recommended', 'in_progress', 'completed', 'skipped')),
                started_at TIMESTAMP,
                completed_at TIMESTAMP,
                time_spent INTEGER,
                score REAL,
                FOREIGN KEY (learner_id) REFERENCES learners(id)
            )
        """)
        
        # Model performance tracking
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS model_metrics(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                epoch INTEGER NOT NULL,
                avg_reward REAL,
                avg_f1_score REAL,
                total_recommendations INTEGER,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Resume data table
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS resume_data(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                learner_id INTEGER NOT NULL UNIQUE,
                skills TEXT,
                experience_years REAL,
                education TEXT,
                projects TEXT,
                raw_text TEXT,
                file_path TEXT,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (learner_id) REFERENCES learners(id)
            )
        """)
        
        # GitHub profile data table
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS github_profiles(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                learner_id INTEGER NOT NULL UNIQUE,
                username TEXT NOT NULL,
                skills TEXT,
                languages TEXT,
                top_repos TEXT,
                activity_score REAL,
                contribution_years REAL,
                metadata TEXT,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (learner_id) REFERENCES learners(id)
            )
        """)
        
        self.conn.commit()
    
    # ==================== LEARNER OPERATIONS ====================
    
    def insert_learner(self, learner_id, target_role, known_skills, learning_speed):
        """Insert a new learner"""
        try:
            self.conn.execute(
                "INSERT INTO learners (id, target_role, known_skills, learning_speed) VALUES (?,?,?,?)",
                (learner_id, target_role, known_skills, learning_speed)
            )
            self.conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False  # Learner already exists
    
    def get_learner(self, learner_id):
        """Get learner by ID"""
        cursor = self.conn.execute(
            "SELECT * FROM learners WHERE id = ?", 
            (learner_id,)
        )
        row = cursor.fetchone()
        return dict(row) if row else None
    
    def get_all_learners(self):
        """Get all learners"""
        cursor = self.conn.execute("SELECT * FROM learners")
        return [dict(row) for row in cursor.fetchall()]
    
    def update_learner_skills(self, learner_id, new_skills):
        """Update learner's known skills"""
        self.conn.execute(
            "UPDATE learners SET known_skills = ? WHERE id = ?",
            (new_skills, learner_id)
        )
        self.conn.commit()
    
    # ==================== SKILL OPERATIONS ====================
    
    def insert_skill(self, name, difficulty, learning_time, category=None):
        """Insert a skill"""
        try:
            self.conn.execute(
                "INSERT INTO skills (name, difficulty, learning_time, category) VALUES (?,?,?,?)",
                (name, difficulty, learning_time, category)
            )
            self.conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False
    
    def get_skill(self, name):
        """Get skill by name"""
        cursor = self.conn.execute(
            "SELECT * FROM skills WHERE name = ?",
            (name,)
        )
        row = cursor.fetchone()
        return dict(row) if row else None
    
    def get_all_skills(self):
        """Get all skills"""
        cursor = self.conn.execute("SELECT * FROM skills")
        return [dict(row) for row in cursor.fetchall()]
    
    # ==================== RECOMMENDATION LOGGING ====================
    
    def log_recommendation(self, learner_id, skill, reward, context):
        """Log a recommendation made by the bandit"""
        context_json = json.dumps(context.tolist()) if hasattr(context, 'tolist') else json.dumps(context)
        
        self.conn.execute(
            "INSERT INTO recommendations (learner_id, skill_recommended, reward, context) VALUES (?,?,?,?)",
            (learner_id, skill, reward, context_json)
        )
        self.conn.commit()
    
    def get_learner_recommendations(self, learner_id, limit=10):
        """Get recent recommendations for a learner"""
        cursor = self.conn.execute(
            """SELECT * FROM recommendations 
               WHERE learner_id = ? 
               ORDER BY recommended_at DESC 
               LIMIT ?""",
            (learner_id, limit)
        )
        return [dict(row) for row in cursor.fetchall()]
    
    def get_recommendation_stats(self):
        """Get overall recommendation statistics"""
        cursor = self.conn.execute("""
            SELECT 
                COUNT(*) as total_recommendations,
                AVG(reward) as avg_reward,
                skill_recommended,
                COUNT(*) as recommendation_count
            FROM recommendations
            GROUP BY skill_recommended
            ORDER BY recommendation_count DESC
        """)
        return [dict(row) for row in cursor.fetchall()]
    
    # ==================== PROGRESS TRACKING ====================
    
    def update_progress(self, learner_id, skill_name, status, time_spent=None, score=None):
        """Update or insert learner progress"""
        
        # Check if progress entry exists
        cursor = self.conn.execute(
            "SELECT id FROM learner_progress WHERE learner_id = ? AND skill_name = ?",
            (learner_id, skill_name)
        )
        existing = cursor.fetchone()
        
        if existing:
            # Update existing
            updates = ["status = ?"]
            params = [status]
            
            if status == "in_progress" and not existing:
                updates.append("started_at = CURRENT_TIMESTAMP")
            
            if status == "completed":
                updates.append("completed_at = CURRENT_TIMESTAMP")
                if time_spent:
                    updates.append("time_spent = ?")
                    params.append(time_spent)
                if score:
                    updates.append("score = ?")
                    params.append(score)
            
            params.append(existing['id'])
            
            self.conn.execute(
                f"UPDATE learner_progress SET {', '.join(updates)} WHERE id = ?",
                params
            )
        else:
            # Insert new
            self.conn.execute(
                """INSERT INTO learner_progress 
                   (learner_id, skill_name, status, started_at) 
                   VALUES (?, ?, ?, CURRENT_TIMESTAMP)""",
                (learner_id, skill_name, status)
            )
        
        self.conn.commit()
    
    def get_learner_progress(self, learner_id):
        """Get all progress for a learner"""
        cursor = self.conn.execute(
            "SELECT * FROM learner_progress WHERE learner_id = ?",
            (learner_id,)
        )
        return [dict(row) for row in cursor.fetchall()]
    
    # ==================== MODEL METRICS ====================
    
    def log_metrics(self, epoch, avg_reward, avg_f1, total_recs):
        """Log model performance metrics"""
        self.conn.execute(
            "INSERT INTO model_metrics (epoch, avg_reward, avg_f1_score, total_recommendations) VALUES (?,?,?,?)",
            (epoch, avg_reward, avg_f1, total_recs)
        )
        self.conn.commit()
    
    def get_metrics_history(self, limit=50):
        """Get model performance over time"""
        cursor = self.conn.execute(
            "SELECT * FROM model_metrics ORDER BY epoch DESC LIMIT ?",
            (limit,)
        )
        return [dict(row) for row in cursor.fetchall()]
    
    # ==================== ANALYTICS ====================
    
    def get_skill_completion_rate(self):
        """Get completion rate for each skill"""
        cursor = self.conn.execute("""
            SELECT 
                skill_name,
                COUNT(*) as total_attempts,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                AVG(CASE WHEN status = 'completed' THEN score END) as avg_score
            FROM learner_progress
            GROUP BY skill_name
        """)
        return [dict(row) for row in cursor.fetchall()]
    
    def get_learner_stats(self, learner_id):
        """Get comprehensive stats for a learner"""
        cursor = self.conn.execute("""
            SELECT 
                COUNT(*) as total_skills_attempted,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
                AVG(CASE WHEN status = 'completed' THEN score END) as avg_score,
                SUM(time_spent) as total_time_spent
            FROM learner_progress
            WHERE learner_id = ?
        """, (learner_id,))
        return dict(cursor.fetchone())
    
    def close(self):
        """Close database connection"""
        self.conn.close()
    
    # ==================== RESUME DATA OPERATIONS ====================
    
    def insert_resume_data(self, learner_id: int, resume_data: dict, file_path: str = None):
        """Store parsed resume data"""
        self.conn.execute(
            """INSERT OR REPLACE INTO resume_data 
               (learner_id, skills, experience_years, education, projects, raw_text, file_path)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                learner_id,
                json.dumps(resume_data.get('skills', [])),
                resume_data.get('experience_years', 0),
                json.dumps(resume_data.get('education', [])),
                json.dumps(resume_data.get('projects', [])),
                resume_data.get('raw_text', ''),
                file_path
            )
        )
        self.conn.commit()
    
    def get_resume_data(self, learner_id: int):
        """Get resume data for a learner"""
        cursor = self.conn.execute(
            "SELECT * FROM resume_data WHERE learner_id = ?",
            (learner_id,)
        )
        row = cursor.fetchone()
        
        if not row:
            return None
        
        data = dict(row)
        # Parse JSON fields
        data['skills'] = json.loads(data['skills']) if data['skills'] else []
        data['education'] = json.loads(data['education']) if data['education'] else []
        data['projects'] = json.loads(data['projects']) if data['projects'] else []
        
        return data
    
    # ==================== GITHUB DATA OPERATIONS ====================
    
    def insert_github_profile(self, learner_id: int, github_data: dict):
        """Store GitHub profile analysis"""
        self.conn.execute(
            """INSERT OR REPLACE INTO github_profiles
               (learner_id, username, skills, languages, top_repos, 
                activity_score, contribution_years, metadata)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                learner_id,
                github_data.get('username', ''),
                json.dumps(github_data.get('skills', [])),
                json.dumps(github_data.get('languages', {})),
                json.dumps(github_data.get('top_repos', [])),
                github_data.get('activity_score', 0),
                github_data.get('contribution_years', 0),
                json.dumps(github_data.get('metadata', {}))
            )
        )
        self.conn.commit()
    
    def get_github_profile(self, learner_id: int):
        """Get GitHub profile for a learner"""
        cursor = self.conn.execute(
            "SELECT * FROM github_profiles WHERE learner_id = ?",
            (learner_id,)
        )
        row = cursor.fetchone()
        
        if not row:
            return None
        
        data = dict(row)
        # Parse JSON fields
        data['skills'] = json.loads(data['skills']) if data['skills'] else []
        data['languages'] = json.loads(data['languages']) if data['languages'] else {}
        data['top_repos'] = json.loads(data['top_repos']) if data['top_repos'] else []
        data['metadata'] = json.loads(data['metadata']) if data['metadata'] else {}
        
        return data
    
    def get_learner_full_profile(self, learner_id: int):
        """Get complete learner profile including resume and GitHub"""
        learner = self.get_learner(learner_id)
        if not learner:
            return None
        
        resume = self.get_resume_data(learner_id)
        github = self.get_github_profile(learner_id)
        
        return {
            'learner': learner,
            'resume': resume,
            'github': github
        }


# Singleton instance
_db_instance = None

def get_db():
    """Get database singleton instance"""
    global _db_instance
    if _db_instance is None:
        _db_instance = Database()
    return _db_instance