from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_service import PDFService
from app.ml.extractors.text_cleaner import TextCleaner
from app.ml.extractors.skill_extractor import SkillExtractor
from app.ml.classifiers.category_detector import CategoryDetector
from app.services.ats_service import ATSService

router = APIRouter()
skill_extractor = SkillExtractor()

@router.post("/analyze", summary="Upload PDF Resume & Perform Full Analysis")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        content = await file.read()
        raw_text, page_count = PDFService.extract_text_from_pdf_bytes(content)
        cleaned_text = TextCleaner.clean_text(raw_text)

        contact_info = TextCleaner.extract_contact_info(cleaned_text)
        sections = TextCleaner.extract_sections(raw_text)
        
        # Skill extraction
        extracted_skills = skill_extractor.extract_skills(cleaned_text)
        all_skills = extracted_skills.get("all_skills", [])

        # Category classification
        category_data = CategoryDetector.detect_category(cleaned_text, all_skills)

        # ATS scoring
        ats_data = ATSService.calculate_ats_score(cleaned_text, contact_info, sections, all_skills)

        return {
            "filename": file.filename,
            "page_count": page_count,
            "contact_info": contact_info,
            "skills": extracted_skills,
            "category": category_data,
            "ats_report": ats_data,
            "raw_text_preview": cleaned_text[:300] + "..." if len(cleaned_text) > 300 else cleaned_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing resume: {str(e)}")
