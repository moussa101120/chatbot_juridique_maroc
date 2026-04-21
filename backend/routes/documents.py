import os
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from pydantic import BaseModel
from typing import List
from rag.ingestion import build_or_update_index

router = APIRouter(prefix="/documents", tags=["Documents"])

UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "./data/uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
EXPORT_DIR = Path("./data/exports")
EXPORT_DIR.mkdir(parents=True, exist_ok=True)

# ── Upload PDF ──────────────────────────────────────────────────────────────

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Seuls les fichiers PDF sont acceptés.")

    dest = UPLOAD_DIR / file.filename
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)

    chunks_count = build_or_update_index(str(dest))
    return {
        "filename": file.filename,
        "chunks_indexed": chunks_count,
        "message": f"✅ {file.filename} indexé avec succès ({chunks_count} chunks).",
    }

@router.get("/list")
async def list_documents():
    files = [f.name for f in UPLOAD_DIR.glob("*.pdf")]
    return {"documents": files}

# ── Export conversation as PDF ───────────────────────────────────────────────

class ExportMessage(BaseModel):
    role: str
    content: str

class ExportRequest(BaseModel):
    title: str = "Consultation Juridique"
    messages: List[ExportMessage]

@router.post("/export")
async def export_conversation(request: ExportRequest):
    output_path = EXPORT_DIR / "consultation.pdf"
    doc = SimpleDocTemplate(str(output_path), pagesize=A4,
                            leftMargin=2*cm, rightMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("Title", parent=styles["Title"],
                                  fontSize=18, textColor=colors.HexColor("#1e40af"),
                                  spaceAfter=6)
    sub_style   = ParagraphStyle("Sub", parent=styles["Normal"],
                                  fontSize=10, textColor=colors.grey, spaceAfter=16)
    q_style     = ParagraphStyle("Q", parent=styles["Normal"],
                                  fontSize=11, textColor=colors.HexColor("#1e40af"),
                                  fontName="Helvetica-Bold", spaceBefore=12, spaceAfter=4)
    a_style     = ParagraphStyle("A", parent=styles["Normal"],
                                  fontSize=11, leading=16, spaceAfter=8)

    story = [
        Paragraph(request.title, title_style),
        Paragraph("Généré par Chatbot Juridique Maroc", sub_style),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e2e8f0")),
        Spacer(1, 0.4*cm),
    ]

    for msg in request.messages:
        if msg.role == "user":
            story.append(Paragraph(f"❓ {msg.content}", q_style))
        else:
            story.append(Paragraph(msg.content.replace("\n", "<br/>"), a_style))
        story.append(Spacer(1, 0.2*cm))

    doc.build(story)
    return FileResponse(str(output_path), media_type="application/pdf",
                        filename="consultation_juridique.pdf")
