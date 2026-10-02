import os
from pypdf import PdfWriter, PageObject
import io

def generate_sample_pdf(output_path: str):
    """
    Generates a valid text-based PDF containing structured student historical records.
    """
    pdf_content = """
========================================================================================
HISTORIAN ENTERPRISE MEMORY SYSTEM - STUDENT HISTORICAL RECORDS DATASET 2026
========================================================================================
student_id | name | attendance | previous_marks | assignment_score | study_hours | exam_score
----------------------------------------------------------------------------------------
STU001 | Aarav Sharma | 92.5 | 88.0 | 90.5 | 6.5 | 94.0
STU002 | Ananya Patel | 85.0 | 78.5 | 82.0 | 5.0 | 81.0
STU003 | Rahul Verma | 58.0 | 45.0 | 50.0 | 1.5 | 42.0
STU004 | Priya Singh | 95.0 | 92.0 | 96.0 | 7.0 | 97.0
STU005 | Vikram Das | 68.0 | 62.0 | 65.0 | 2.5 | 60.0
STU006 | Sneha Iyer | 88.0 | 84.0 | 85.0 | 5.5 | 86.0
STU007 | Rohan Gupta | 42.0 | 38.0 | 40.0 | 1.0 | 35.0
STU008 | Kavya Joshi | 91.0 | 89.0 | 92.0 | 6.0 | 90.0
STU009 | Aditya Nair | 76.0 | 70.0 | 74.0 | 4.0 | 72.0
STU010 | Meera Kapoor | 52.0 | 48.0 | 55.0 | 2.0 | 49.0
STU011 | Siddharth Rao | 98.0 | 95.0 | 97.0 | 8.0 | 98.0
STU012 | Ishita Reddy | 81.0 | 75.0 | 79.0 | 4.5 | 78.0
STU013 | Arjun Kumar | 60.0 | 54.0 | 58.0 | 2.0 | 52.0
STU014 | Diya Mehta | 94.0 | 91.0 | 93.0 | 6.8 | 95.0
STU015 | Varun Saxena | 45.0 | 40.0 | 42.0 | 1.2 | 38.0
STU016 | Tanvi Bhatt | 87.0 | 82.0 | 86.0 | 5.2 | 85.0
STU017 | Karan Malhotra | 74.0 | 69.0 | 71.0 | 3.5 | 70.0
STU018 | Riya Choudhury | 90.0 | 86.0 | 88.0 | 6.0 | 89.0
STU019 | Kunal Shah | 55.0 | 50.0 | 52.0 | 1.8 | 48.0
STU020 | Neha Aggarwal | 96.0 | 94.0 | 95.0 | 7.5 | 96.0
========================================================================================
    """.strip()

    # Create a minimal text PDF file format manually if needed, or use f-string stream
    # Minimal PDF syntax with text stream:
    pdf_bytes = f"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>
endobj
5 0 obj
<< /Length {len(pdf_content) + 100} >>
stream
BT
/F1 10 Tf
50 750 Td
12 TL
""".encode('utf-8')

    # Format lines into PDF text instructions
    text_instructions = []
    for line in pdf_content.split('\n'):
        # Escape parenthesis
        clean_line = line.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        text_instructions.append(f"({clean_line}) '")
    
    stream_content = "\n".join(text_instructions) + "\nET\nendstream\nendobj\n"
    
    xref_offset = len(pdf_bytes) + len(stream_content.encode('utf-8'))
    
    pdf_tail = f"""xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000214 00000 n 
0000000301 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
{xref_offset}
%%EOF
"""

    full_pdf = pdf_bytes + stream_content.encode('utf-8') + pdf_tail.encode('utf-8')

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(full_pdf)

    print(f"Sample PDF successfully generated at: {output_path}")

if __name__ == "__main__":
    generate_sample_pdf("uploads/sample_students.pdf")
