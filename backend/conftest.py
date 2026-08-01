"""Pytest configuration - makes 'app' importable in tests."""
import sys
import os

# Add backend directory to Python path so 'app' can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
