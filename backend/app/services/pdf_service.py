import pymupdf as fitz
from typing import Tuple

class PDFService:
    @staticmethod
    def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> Tuple[str, int]:
        """Extracts text and page count from raw PDF bytes."""
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            page_count = len(doc)
            full_text = ""
            for page in doc:
                full_text += page.get_text("text") + "\n"
            return full_text.strip(), page_count
        except Exception as e:
            raise ValueError(f"Failed to parse PDF file: {str(e)}")
