import re
import pandas as pd
from typing import List, Dict, Any, Tuple
from pypdf import PdfReader
from io import BytesIO

COLUMN_MAP = {
    "student_id": ["student_id", "studentid", "student id", "id", "roll_no", "rollno", "roll no", "sid"],
    "name": ["name", "student_name", "student name", "full_name", "full name", "student"],
    "attendance": ["attendance", "attendance_pct", "attendance pct", "attendance_rate", "att"],
    "previous_marks": ["previous_marks", "prev_marks", "previous marks", "prev marks", "previous_score", "prev_score", "past_marks"],
    "assignment_score": ["assignment_score", "assignment score", "assignment_marks", "assignments", "assignment"],
    "study_hours": ["study_hours", "study hours", "hours_studied", "study_time", "study_hrs", "hours"],
    "exam_score": ["exam_score", "exam score", "final_exam", "exam_marks", "final_score", "marks", "score"]
}

REQUIRED_COLUMNS = ["student_id", "name", "attendance", "previous_marks", "assignment_score", "study_hours", "exam_score"]

def normalize_header(header: str) -> str:
    """Normalizes header string for canonical column matching."""
    cleaned = header.strip().lower().replace("-", "_").replace(" ", "_")
    for canonical, aliases in COLUMN_MAP.items():
        for alias in aliases:
            if cleaned == alias or cleaned == alias.replace(" ", "_"):
                return canonical
    return cleaned

class PDFParserService:
    @staticmethod
    def parse_pdf(file_bytes: bytes) -> pd.DataFrame:
        """
        Parses text/table data from PDF file bytes and returns a standardized pandas DataFrame.
        """
        try:
            reader = PdfReader(BytesIO(file_bytes))
        except Exception as e:
            raise ValueError(f"Corrupt or unreadable PDF file: {str(e)}")

        if not reader.pages:
            raise ValueError("The uploaded PDF document is empty.")

        extracted_text_lines = []
        for page_idx, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                lines = [line.strip() for line in text.split("\n") if line.strip()]
                extracted_text_lines.extend(lines)

        if not extracted_text_lines:
            raise ValueError("No text content could be extracted from the PDF. Ensure it is a text-based PDF.")

        # Try parsing structured lines / CSV / Tabular format
        parsed_rows, headers = PDFParserService._extract_rows_and_headers(extracted_text_lines)

        if not headers or not parsed_rows:
            raise ValueError("Could not detect structured headers and student records in PDF content.")

        # Map headers to canonical column names
        canonical_headers = [normalize_header(h) for h in headers]

        # Check for missing required columns
        missing = [req for req in REQUIRED_COLUMNS if req not in canonical_headers]
        if missing:
            raise ValueError(f"PDF is missing required column headers: {', '.join(missing)}")

        # Construct DataFrame
        data_dicts = []
        for row in parsed_rows:
            if len(row) == len(canonical_headers):
                record = {canonical_headers[i]: row[i] for i in range(len(canonical_headers))}
                data_dicts.append(record)

        if not data_dicts:
            raise ValueError("No valid data rows matched the header structure.")

        df = pd.DataFrame(data_dicts)
        return df

    @staticmethod
    def _extract_rows_and_headers(lines: List[str]) -> Tuple[List[List[str]], List[str]]:
        """
        Detects header row and parses data rows separated by comma, pipe, tab, or multiple spaces.
        """
        header_row_idx = -1
        headers = []

        # Find line containing header keywords
        for idx, line in enumerate(lines):
            normalized_line = line.lower()
            if ("student_id" in normalized_line or "attendance" in normalized_line or "previous_marks" in normalized_line or "id" in normalized_line):
                header_row_idx = idx
                # Split line by delimiter (, | \t or 2+ spaces)
                headers = [h.strip() for h in re.split(r',|\||\t|\s{2,}', line) if h.strip()]
                break

        if header_row_idx == -1 or not headers:
            # Fallback: assume line 0 is header
            headers = [h.strip() for h in re.split(r',|\||\t|\s{2,}', lines[0]) if h.strip()]
            header_row_idx = 0

        rows = []
        for line in lines[header_row_idx + 1:]:
            # Ignore decorative header lines or page numbers
            if "page" in line.lower() or line.startswith("---") or line.startswith("==="):
                continue
            
            parts = [p.strip() for p in re.split(r',|\||\t|\s{2,}', line) if p.strip()]
            if len(parts) >= len(headers) - 1:  # Allow slight variation in splitting
                # Handle cases where whitespace splitting over-splits or under-splits
                if len(parts) > len(headers):
                    parts = parts[:len(headers)]
                rows.append(parts)

        return rows, headers
