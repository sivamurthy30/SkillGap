import pandas as pd
import sqlite3

DB_PATH = "learners.db"


def load_csv_to_database():
    """Load learner CSV data into SQLite database"""

    conn = sqlite3.connect(DB_PATH)

    learners = pd.read_csv("data/learner_profiles.csv")
    github = pd.read_csv("data/github_usernames.csv")

    learners.to_sql("learners", conn, if_exists="replace", index=False)
    github.to_sql("github", conn, if_exists="replace", index=False)

    conn.close()

    print("✅ CSV data loaded into database")


def get_learners_from_db():
    """Fetch learners from database"""

    conn = sqlite3.connect(DB_PATH)

    query = """
    SELECT *
    FROM learners
    """

    df = pd.read_sql(query, conn)
    conn.close()

    return df
