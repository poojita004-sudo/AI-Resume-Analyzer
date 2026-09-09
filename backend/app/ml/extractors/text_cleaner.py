import re

class TextCleaner:
    @staticmethod
    def clean_text(text: str) -> str:
        if not text:
            return ""
        # Replace multiple whitespace characters with single space
        text = re.sub(r'\s+', ' ', text)
        # Remove non-printable characters
        text = re.sub(r'[^\x00-\x7F]+', ' ', text)
        return text.strip()

    @staticmethod
    def extract_contact_info(text: str) -> dict:
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        phone_pattern = r'\(?\+?\d{1,4}\)?[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}'
        linkedin_pattern = r'linkedin\.com/in/[a-zA-Z0-9_-]+'
        github_pattern = r'github\.com/[a-zA-Z0-9_-]+'

        emails = re.findall(email_pattern, text)
        phones = re.findall(phone_pattern, text)
        linkedin = re.findall(linkedin_pattern, text, re.IGNORECASE)
        github = re.findall(github_pattern, text, re.IGNORECASE)

        return {
            "email": emails[0] if emails else None,
            "phone": phones[0] if phones else None,
            "linkedin": f"https://{linkedin[0]}" if linkedin else None,
            "github": f"https://{github[0]}" if github else None
        }

    @staticmethod
    def extract_sections(text: str) -> dict:
        sections = {
            "education": "",
            "experience": "",
            "projects": "",
            "skills": "",
            "certifications": "",
            "summary": ""
        }
        
        # Section header patterns
        patterns = {
            "education": r'(?:education|academic background|qualification)',
            "experience": r'(?:experience|work experience|employment|history)',
            "projects": r'(?:projects|personal projects|key projects)',
            "skills": r'(?:skills|technical skills|technologies|competencies)',
            "certifications": r'(?:certifications|certificates|licenses)',
            "summary": r'(?:summary|profile|about me|objective)'
        }
        
        # Convert text to lowercase lines for matching
        lines = text.split('\n')
        current_section = "summary"
        
        for line in lines:
            line_clean = line.strip().lower()
            matched = False
            for sec, pat in patterns.items():
                if re.search(r'^\s*' + pat + r'\s*$', line_clean) or re.search(r'^\s*' + pat + r'\b', line_clean):
                    current_section = sec
                    matched = True
                    break
            if not matched and current_section:
                sections[current_section] += " " + line
                
        return {k: v.strip() for k, v in sections.items()}
