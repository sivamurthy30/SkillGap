"""
Database module - automatically selects best available database
"""

import os

# Try PostgreSQL first (production-ready)
try:
    from .postgres_db import get_db as get_postgres_db
    POSTGRES_AVAILABLE = True
except ImportError:
    POSTGRES_AVAILABLE = False

# Fallback to SQLite (development)
try:
    from .sqlite_db import get_db as get_sqlite_db
    SQLITE_AVAILABLE = True
except ImportError:
    SQLITE_AVAILABLE = False


def get_db():
    """
    Get database instance - automatically selects best available
    Priority: PostgreSQL > SQLite
    """
    
    # Try PostgreSQL first
    if POSTGRES_AVAILABLE:
        try:
            db = get_postgres_db()
            print("✅ Using PostgreSQL database")
            return db
        except Exception as e:
            print(f"⚠️  PostgreSQL connection failed: {e}")
            print("⚠️  Falling back to SQLite...")
    
    # Fallback to SQLite
    if SQLITE_AVAILABLE:
        try:
            db = get_sqlite_db()
            print("✅ Using SQLite database (development mode)")
            print("💡 For production, install PostgreSQL: brew install postgresql@15")
            return db
        except Exception as e:
            print(f"❌ SQLite connection failed: {e}")
            raise
    
    # No database available
    raise Exception("No database available. Install psycopg2-binary for PostgreSQL or use SQLite.")


__all__ = ['get_db']
