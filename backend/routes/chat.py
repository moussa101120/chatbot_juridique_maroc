from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from rag.chain import ask, reset_chain

router = APIRouter(prefix="/chat", tags=["Chat"])

class Message(BaseModel):
    role: str  # "user" | "assistant"
    content: str

class ChatRequest(BaseModel):
    question: str
    history: Optional[List[Message]] = []

class SourceDoc(BaseModel):
    source_file: str
    page: int
    excerpt: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceDoc]

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # Convert Pydantic Message objects to plain dicts
    history = [{"role": m.role, "content": m.content} for m in request.history]

    result = ask(question=request.question, chat_history=history)

    if result["answer"] == "Aucun document juridique n'a encore été chargé.":
        raise HTTPException(
            status_code=503,
            detail="Aucun document indexé. Veuillez d'abord uploader des PDFs juridiques.",
        )

    sources = []
    seen = set()
    for doc in result.get("source_documents", []):
        key = (doc.metadata.get("source_file", ""), doc.metadata.get("page", 0))
        if key not in seen:
            seen.add(key)
            sources.append(SourceDoc(
                source_file=doc.metadata.get("source_file", "Inconnu"),
                page=doc.metadata.get("page", 0) + 1,
                excerpt=doc.page_content[:200] + "...",
            ))

    return ChatResponse(answer=result["answer"], sources=sources)

@router.post("/reset")
async def reset_conversation():
    reset_chain()
    return {"message": "Conversation réinitialisée"}