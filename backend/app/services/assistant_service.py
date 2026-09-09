import re
from typing import Dict, Any, List, Optional

class AssistantService:
    """
    AI Assistant Service for Resume Guidance, ATS Optimization,
    Structure recommendations, and Contextual Analysis Q&A.
    """

    KNOWLEDGE_BASE = {
        "structure": """
📌 **Ideal Resume Structure (Standard Order for Freshers & Professionals)**:

1. **Header**: Name, Target Role, Phone Number, Professional Email, LinkedIn URL, GitHub URL, Portfolio link.
2. **Professional Summary / Objective**: 2-3 lines highlighting your key domain skills, core competencies, and career objectives.
3. **Technical Skills**: Grouped neatly into categories (e.g., Languages, Frameworks, Tools/Databases, Cloud/DevOps, Soft Skills).
4. **Key Projects**: 2-3 impactful projects. For each project include: Title, Tech Stack used, 2-3 bullet points detailing problem solved & outcome.
5. **Education**: Degree, Branch, College Name, Graduation Year, CGPA/Percentage.
6. **Work Experience / Internships** (if applicable): Role, Company, Duration, bullet points with action verbs & metrics.
7. **Certifications & Achievements**: Relevant certifications with issuing organization & year, competitive programming ratings, or hackathon wins.
""",
        "ats": """
🎯 **Key ATS Optimization Rules**:

1. **Clean Formatting**: Avoid multi-column layouts, graphics, icons, or complex tables. Stick to standard 1-column layout.
2. **Standard Section Titles**: Use recognized headers like "Work Experience", "Education", "Projects", "Skills" (don't use unconventional terms like "My Journey").
3. **File Format**: Always save and upload as a PDF generated from text (not a scanned image PDF).
4. **Keyword Matching**: Include exact keywords mentioned in job descriptions (e.g. "React.js", "REST APIs", "Python", "Docker").
5. **Standard Fonts**: Use clean, standard fonts such as Arial, Calibri, Helvetica, or Inter (10pt - 12pt font size).
""",
        "bullet_points": """
✍️ **The STAR Formula for Resume Bullet Points**:

Formula: **[Action Verb] + [Task/Tool Used] + [Result / Quantified Metric]**

- ❌ *Weak*: "Worked on a web application using React."
- ✅ *Strong*: "Engineered a responsive web dashboard using React and TailwindCSS, reducing load times by 40% for 5,000+ active users."
- ❌ *Weak*: "Fixed bugs in python script."
- ✅ *Strong*: "Optimized backend database queries in Python & PostgreSQL, improving API response speed by 35%."

💡 **Top Action Verbs**: Engineered, Architected, Developed, Spearheaded, Optimized, Automated, Deployed, Accelerated.
""",
        "sections": """
📑 **Mandatory vs Optional Resume Sections**:

✅ **Mandatory Sections**:
- Contact Header (Email, Phone, LinkedIn, GitHub)
- Technical Skills
- Projects (Crucial for freshers)
- Education

💡 **Optional / Value-Add Sections**:
- Professional Experience / Internships
- Certifications & Licenses
- Honors & Awards / Hackathons
- Extracurricular Leadership
""",
        "projects": """
🛠️ **How to Write the Projects Section Effectively**:

Each project entry should have:
1. **Title & Tech Stack**: e.g., *AI Resume Analyzer (Python, FastAPI, React, Scikit-Learn)*
2. **Bullet 1 (What & Why)**: Built an automated NLP system to parse PDF resumes and extract skills.
3. **Bullet 2 (Technical Execution)**: Integrated PyMuPDF for text extraction and TF-IDF vectors for domain classification.
4. **Bullet 3 (Impact & Result)**: Achieved 92% category accuracy and reduced resume screening time by 60%.
"""
    }

    @classmethod
    def generate_response(cls, message: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        user_msg = message.lower().strip()
        
        # Check if user is asking about their analyzed resume specifically
        if context and any(k in user_msg for k in ["my resume", "my score", "my skills", "my category", "analysis", "result", "improve my"]):
            return cls._handle_contextual_query(user_msg, context)

        # Standard AI Knowledge Matching
        if any(k in user_msg for k in ["structure", "format", "order", "layout", "template", "organize"]):
            return {
                "response": cls.KNOWLEDGE_BASE["structure"],
                "suggested_followups": [
                    "How to write bullet points using STAR method?",
                    "What are top ATS optimization rules?",
                    "How to format the Projects section?"
                ]
            }

        elif any(k in user_msg for k in ["ats", "score", "pass ats", "ats score", "scanner", "keywords"]):
            return {
                "response": cls.KNOWLEDGE_BASE["ats"],
                "suggested_followups": [
                    "How to write strong bullet points?",
                    "What is the ideal resume structure?",
                    "What sections are mandatory?"
                ]
            }

        elif any(k in user_msg for k in ["bullet", "star", "action verb", "write project", "description"]):
            return {
                "response": cls.KNOWLEDGE_BASE["bullet_points"],
                "suggested_followups": [
                    "How to write the Projects section?",
                    "What is ideal resume structure?",
                    "How to optimize for ATS?"
                ]
            }

        elif any(k in user_msg for k in ["section", "mandatory", "what to include", "objective"]):
            return {
                "response": cls.KNOWLEDGE_BASE["sections"],
                "suggested_followups": [
                    "What is ideal resume structure?",
                    "How to write Projects section?",
                    "ATS optimization rules?"
                ]
            }

        elif any(k in user_msg for k in ["project", "projects", "portfolio", "explain project"]):
            return {
                "response": cls.KNOWLEDGE_BASE["projects"],
                "suggested_followups": [
                    "How to write bullet points using STAR method?",
                    "Top Action Verbs for resumes?",
                    "What is ideal resume structure?"
                ]
            }

        # Greetings or General Questions
        elif any(k in user_msg for k in ["hi", "hello", "hey", "help", "who are you", "what can you do"]):
            return {
                "response": "Hello! 👋 I am your **AI Resume Assistant**. I can help you with:\n\n"
                            "• **Resume Structure & Guidelines** (Best section ordering for placement readiness)\n"
                            "• **ATS Optimization Rules** (How to pass automated ATS filters)\n"
                            "• **Bullet Point & STAR Method** (Writing high-impact project & experience descriptions)\n"
                            "• **Personalized Resume Feedback** (Questions on your uploaded resume score & gaps)\n\n"
                            "What would you like to know today?",
                "suggested_followups": [
                    "What is the ideal resume structure?",
                    "How to write strong ATS bullet points?",
                    "What sections are mandatory on a resume?",
                    "How to write the Projects section?"
                ]
            }

        # Default fallback response with general guidance
        return {
            "response": f"Here is key guidance regarding your question:\n\n"
                        f"**Resume Best Practices Summary**:\n"
                        f"1. **Keep it 1 page**: For freshers and < 3 years experience, 1 page is mandatory.\n"
                        f"2. **Quantify achievements**: Use percentages, numbers, and speed metrics in project bullet points.\n"
                        f"3. **Clear categorization**: Separate Technical Skills into Languages, Frameworks, and Tools.\n"
                        f"4. **ATS Friendly**: Avoid scanned PDF images, icons, or complex tables.\n\n"
                        f"Feel free to ask more specific questions about resume structure, ATS rules, or your parsed resume analysis!",
            "suggested_followups": [
                "What is ideal resume structure?",
                "How to write bullet points using STAR method?",
                "What are top ATS optimization rules?"
            ]
        }

    @classmethod
    def _handle_contextual_query(cls, user_msg: str, context: Dict[str, Any]) -> Dict[str, Any]:
        ats = context.get("ats_report", {})
        score = ats.get("ats_score", 0)
        skills = context.get("skills", {}).get("all_skills", [])
        category = context.get("category", {}).get("primary_category", "Software Engineering")
        suggestions = ats.get("suggestions", [])
        
        reply = f"📊 **Based on your analyzed resume ({context.get('filename', 'uploaded resume')})**:\n\n"
        reply += f"• **Overall ATS Score**: `{score}/100`\n"
        reply += f"• **Detected Domain**: `{category}`\n"
        reply += f"• **Total Extracted Skills**: {len(skills)} skills detected ({', '.join(skills[:6]) if skills else 'None'})\n\n"

        if "score" in user_msg or "improve" in user_msg:
            reply += "💡 **Top Recommendations to Increase Your Score**:\n"
            if suggestions:
                for idx, sug in enumerate(suggestions, 1):
                    reply += f"{idx}. {sug}\n"
            else:
                reply += "1. Add measurable metrics to your project bullet points.\n"
                reply += "2. Ensure standard section headers (Experience, Education, Skills, Projects).\n"
                reply += "3. Include relevant cloud and framework skills.\n"
        elif "skill" in user_msg:
            reply += "🛠️ **Extracted Skills Breakdown**:\n"
            reply += f"Extracted: {', '.join(skills) if skills else 'No skills detected yet.'}\n\n"
            reply += "📌 *Tip*: Group your skills into clear subheadings: Programming Languages, Frameworks, Databases, and Tools."
        else:
            reply += "📌 **General Feedback for Your Resume**:\n"
            reply += f"Your resume currently matches the **{category}** domain. Ensure your project descriptions demonstrate hands-on experience with action verbs and quantifiable results."

        return {
            "response": reply,
            "suggested_followups": [
                "How to write bullet points using STAR method?",
                "What is ideal resume structure?",
                "Top ATS optimization rules?"
            ]
        }
