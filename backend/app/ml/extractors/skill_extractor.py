import json
import re
import os
from typing import Dict, List, Set

class SkillExtractor:
    def __init__(self, skills_db_path: str = None):
        if not skills_db_path:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            skills_db_path = os.path.join(base_dir, "data", "skills_db.json")
            
        with open(skills_db_path, "r", encoding="utf-8") as f:
            self.skills_db = json.load(f)

    def extract_skills(self, text: str) -> Dict[str, List[str]]:
        text_lower = text.lower()
        extracted = {}

        for category, skills in self.skills_db.items():
            matched_skills: Set[str] = set()
            for skill in skills:
                # Regex word boundary check for precise skill matching
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, text_lower):
                    matched_skills.add(skill)
            extracted[category] = list(matched_skills)

        # Calculate all flattened skills
        all_skills = [skill for cat in extracted.values() for skill in cat]
        extracted["all_skills"] = list(set(all_skills))
        
        return extracted
