import re
from typing import Dict, List, Any

class ATSService:
    ACTION_VERBS = [
        "developed", "built", "implemented", "engineered", "designed", "architected",
        "optimized", "spearheaded", "managed", "deployed", "created", "reduced",
        "increased", "enhanced", "automated", "integrated", "led", "calculated"
    ]

    @classmethod
    def calculate_ats_score(cls, text: str, contact_info: dict, sections: dict, skills: list) -> Dict[str, Any]:
        text_lower = text.lower()
        word_count = len(text.split())
        suggestions = []
        
        # 1. Contact Details Score (15 points)
        contact_score = 0
        if contact_info.get("email"): contact_score += 5
        else: suggestions.append("Add a professional email address to the header.")
            
        if contact_info.get("phone"): contact_score += 4
        else: suggestions.append("Include your phone number for recruiter contact.")
            
        if contact_info.get("linkedin"): contact_score += 3
        else: suggestions.append("Add your LinkedIn profile URL.")
            
        if contact_info.get("github"): contact_score += 3
        else: suggestions.append("Include a link to your GitHub or online portfolio.")

        # 2. Section Structure Score (25 points)
        section_score = 0
        essential_sections = ["education", "experience", "projects", "skills", "summary"]
        for sec in essential_sections:
            if sections.get(sec) and len(sections[sec].strip()) > 10:
                section_score += 5
            else:
                suggestions.append(f"Add a dedicated '{sec.capitalize()}' section to pass ATS parsers.")

        # 3. Skill Count & Diversity Score (25 points)
        skill_count = len(skills)
        if skill_count >= 12:
            skill_score = 25
        elif skill_count >= 8:
            skill_score = 20
        elif skill_count >= 5:
            skill_score = 15
        else:
            skill_score = 10
            suggestions.append("Add more technical skills (at least 10+ core technologies/tools).")

        # 4. Action Verbs & Quantifiable Results Score (20 points)
        action_verb_count = sum(1 for verb in cls.ACTION_VERBS if verb in text_lower)
        has_metrics = bool(re.search(r'\d+%', text) or re.search(r'\$\d+', text) or re.search(r'\d+\s*(x|times|users|k|m)', text_lower))
        
        verb_score = min(12, action_verb_count * 3)
        metrics_score = 8 if has_metrics else 0
        action_score = verb_score + metrics_score
        
        if action_verb_count < 3:
            suggestions.append("Use strong action verbs like 'Engineered', 'Optimized', 'Spearheaded' in bullet points.")
        if not has_metrics:
            suggestions.append("Quantify your achievements with numbers or percentages (e.g. 'Improved speed by 30%').")

        # 5. Length & Formatting Score (15 points)
        if 250 <= word_count <= 800:
            length_score = 15
        elif 150 <= word_count < 250 or 800 < word_count <= 1200:
            length_score = 10
            suggestions.append("Adjust resume length (ideal length is between 300 to 700 words).")
        else:
            length_score = 5
            suggestions.append("Resume content is either too short or too long for optimal ATS scanning.")

        total_ats_score = contact_score + section_score + skill_score + action_score + length_score

        return {
            "ats_score": total_ats_score,
            "word_count": word_count,
            "breakdown": {
                "contact_info": {"score": contact_score, "max": 15},
                "section_structure": {"score": section_score, "max": 25},
                "skill_diversity": {"score": skill_score, "max": 25},
                "action_verbs_metrics": {"score": action_score, "max": 20},
                "formatting_length": {"score": length_score, "max": 15}
            },
            "suggestions": suggestions
        }
