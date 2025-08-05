#!/usr/bin/env python3
"""
PDF text extraction script using pdfplumber
"""
import sys
import json
import pdfplumber
import io
import base64

def extract_text_from_pdf(pdf_data):
    """
    Extract text from PDF data using pdfplumber
    
    Args:
        pdf_data: Base64 encoded PDF data
        
    Returns:
        dict: Contains extracted text and metadata
    """
    try:
        # Decode base64 PDF data
        pdf_bytes = base64.b64decode(pdf_data)
        
        # Create a file-like object from bytes
        pdf_file = io.BytesIO(pdf_bytes)
        
        # Extract text using pdfplumber
        extracted_text = ""
        page_count = 0
        
        with pdfplumber.open(pdf_file) as pdf:
            page_count = len(pdf.pages)
            
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    extracted_text += page_text + "\n"
        
        # Clean and validate the extracted text
        extracted_text = extracted_text.strip()
        
        if not extracted_text:
            return {
                "success": False,
                "error": "No text content found in PDF",
                "text": "",
                "pages": page_count
            }
        
        # Check if the content looks like a resume
        resume_keywords = [
            "experience", "education", "skills", "work", "employment", 
            "university", "college", "email", "phone", "name", "summary", 
            "objective", "career", "professional", "project", "achievement",
            "certification", "qualification", "degree", "bachelor", "master",
            "company", "job", "role", "position", "responsibility"
        ]
        
        text_lower = extracted_text.lower()
        keyword_matches = sum(1 for keyword in resume_keywords if keyword in text_lower)
        word_count = len(extracted_text.split())
        
        return {
            "success": True,
            "text": extracted_text,
            "pages": page_count,
            "word_count": word_count,
            "keyword_matches": keyword_matches,
            "is_resume_like": keyword_matches >= 3 or word_count >= 100
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "text": "",
            "pages": 0
        }

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) != 2:
        print(json.dumps({
            "success": False,
            "error": "Usage: python pdf_extractor.py <base64_pdf_data>"
        }))
        sys.exit(1)
    
    pdf_data = sys.argv[1]
    result = extract_text_from_pdf(pdf_data)
    
    # Output JSON result
    print(json.dumps(result))

if __name__ == "__main__":
    main()