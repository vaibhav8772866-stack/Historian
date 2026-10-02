import os
import time
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models
from app.core.config import settings
from app.schemas.analysis import UploadResponse, APIErrorResponse
from app.services.pdf_parser import PDFParserService
from app.services.data_cleaner import DataCleanerService

router = APIRouter(tags=["Data Upload"])

@router.post(
    "/data/upload",
    response_model=UploadResponse,
    responses={
        400: {"model": APIErrorResponse},
        422: {"model": APIErrorResponse},
        500: {"model": APIErrorResponse}
    }
)
async def upload_pdf_data(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Accepts historical student record PDF files, extracts structured records,
    validates data ranges, stores student profiles and historical records in DB.
    """
    # 1. Validate File Extension
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "INVALID_FILE_TYPE",
                "message": "Only PDF files (.pdf) are supported."
            }
        )

    # 2. Read File Bytes & Validate Size
    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "FILE_TOO_LARGE",
                "message": f"File size exceeds the maximum limit of {settings.MAX_FILE_SIZE // (1024*1024)}MB."
            }
        )

    # 3. Save Uploaded PDF File to Storage
    timestamp_suffix = int(time.time())
    base_name = os.path.splitext(file.filename)[0]
    saved_filename = f"{base_name}_{timestamp_suffix}.pdf"
    saved_filepath = os.path.join(settings.UPLOAD_DIR, saved_filename)
    with open(saved_filepath, "wb") as f:
        f.write(contents)

    # 4. Parse PDF text & Extract DataFrame
    try:
        raw_df = PDFParserService.parse_pdf(contents)
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "PDF_PARSING_ERROR",
                "message": str(val_err)
            }
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "code": "PDF_PROCESSING_FAILED",
                "message": f"Failed to extract structured data from PDF: {str(err)}"
            }
        )

    # 5. Clean & Validate Extracted Records
    cleaned_df, warnings, errors, quality_score = DataCleanerService.clean_and_validate(raw_df)

    if errors:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "code": "DATA_VALIDATION_ERROR",
                "message": "; ".join(errors)
            }
        )

    # 6. Store / Update Students and Historical Records in Database
    records_saved = 0
    for idx, row in cleaned_df.iterrows():
        sid = str(row["student_id"])
        sname = str(row["name"])
        cname = str(row.get("class_name", "Class A"))
        sem = str(row.get("semester", "Semester 1"))

        # Get or create Student
        student = db.query(models.Student).filter(models.Student.student_id == sid).first()
        if not student:
            student = models.Student(
                student_id=sid,
                name=sname,
                class_name=cname,
                semester=sem
            )
            db.add(student)
            db.commit()
            db.refresh(student)
        else:
            # Update existing student metadata
            student.name = sname
            student.class_name = cname
            student.semester = sem
            db.commit()

        # Add Historical Record
        record = models.HistoricalRecord(
            student_id=sid,
            attendance=float(row["attendance"]),
            previous_marks=float(row["previous_marks"]),
            assignment_score=float(row["assignment_score"]),
            study_hours=float(row["study_hours"]),
            exam_score=float(row["exam_score"])
        )
        db.add(record)
        records_saved += 1

    db.commit()

    return UploadResponse(
        success=True,
        filename=file.filename,
        dataset_name=file.filename,
        records_extracted=records_saved,
        quality_score=quality_score,
        warnings=warnings,
        message=f"Successfully extracted and saved {records_saved} student records."
    )
