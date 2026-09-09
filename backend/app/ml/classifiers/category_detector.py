from typing import Dict, List

class CategoryDetector:
    DOMAINS = {
        "Full-Stack / Web Development": ["react", "node.js", "javascript", "html5", "css3", "express", "fastapi", "django", "next.js", "vue.js", "angular", "tailwind"],
        "Data Science & AI / ML": ["machine learning", "deep learning", "nlp", "python", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "opencv", "r", "sql", "bert", "llm"],
        "DevOps & Cloud Engineering": ["aws", "docker", "kubernetes", "azure", "gcp", "ci/cd", "linux", "git", "bash", "terraform"],
        "Core Software Engineering": ["c++", "java", "c#", "data structures", "algorithms", "system design", "object oriented", "sql"],
        "Mobile App Development": ["flutter", "react native", "kotlin", "swift", "android", "ios"]
    }

    @classmethod
    def detect_category(cls, text: str, extracted_skills: List[str]) -> Dict[str, any]:
        text_lower = text.lower()
        all_terms = [s.lower() for s in extracted_skills] + text_lower.split()
        
        domain_scores = {}
        for domain, keywords in cls.DOMAINS.items():
            score = 0
            for kw in keywords:
                if kw in text_lower:
                    score += 2
                if kw in all_terms:
                    score += 1
            domain_scores[domain] = score

        # Sort domains by highest match score
        sorted_domains = sorted(domain_scores.items(), key=lambda x: x[1], reverse=True)
        primary_domain = sorted_domains[0][0] if sorted_domains and sorted_domains[0][1] > 0 else "General Software Engineering"
        
        confidence = min(100, int((sorted_domains[0][1] / 15.0) * 100)) if sorted_domains and sorted_domains[0][1] > 0 else 50
        
        return {
            "primary_category": primary_domain,
            "confidence_score": confidence,
            "category_scores": domain_scores
        }
