#!/usr/bin/env python3
"""
Seed script for Risk Insights HTMX application
Run this to populate the database with sample data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.app.seed_data import seed

if __name__ == "__main__":
    print("Seeding database with sample data...")
    seed()
    print("Database seeding completed!")