import hashlib
import os

def hash_password(password: str) -> str:
    """Hashes a password using SHA-256 with a salt for secure storage."""
    salt = "historian_salt_2026"
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain text password against a stored SHA-256 hash."""
    return hash_password(plain_password) == hashed_password
