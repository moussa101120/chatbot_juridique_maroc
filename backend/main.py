from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.chat import router as chat_router
from routes.documents import router as documents_router

load_dotenv()

app = FastAPI(
    title="Chatbot Juridique Maroc API",
    description="API RAG pour l'assistance juridique basée sur le droit marocain",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(documents_router)

@app.get("/")
async def root():
    return {
        "name": "Chatbot Juridique Maroc",
        "version": "1.0.0",
        "status": "running",
    }

@app.get("/health")
async def health():
    return {"status": "ok"}
