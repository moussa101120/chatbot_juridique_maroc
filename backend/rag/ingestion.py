import os
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from dotenv import load_dotenv

load_dotenv()

FAISS_INDEX_PATH = os.getenv("FAISS_INDEX_PATH", "./data/faiss_index")
EMBEDDING_MODEL  = os.getenv("EMBEDDING_MODEL", "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

def get_embeddings():
    return HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )

def load_and_split_pdf(pdf_path: str) -> list:
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100,
        separators=["\n\n", "\n", ".", " "],
    )
    chunks = splitter.split_documents(documents)
    for chunk in chunks:
        chunk.metadata["source_file"] = Path(pdf_path).name
    return chunks

def build_or_update_index(pdf_path: str):
    chunks = load_and_split_pdf(pdf_path)
    embeddings = get_embeddings()
    index_path = Path(FAISS_INDEX_PATH)

    if index_path.exists():
        vectorstore = FAISS.load_local(
            str(index_path), embeddings, allow_dangerous_deserialization=True
        )
        vectorstore.add_documents(chunks)
    else:
        vectorstore = FAISS.from_documents(chunks, embeddings)

    index_path.mkdir(parents=True, exist_ok=True)
    vectorstore.save_local(str(index_path))
    return len(chunks)

def load_vectorstore():
    embeddings = get_embeddings()
    index_path = Path(FAISS_INDEX_PATH)
    if not index_path.exists():
        return None
    return FAISS.load_local(
        str(index_path), embeddings, allow_dangerous_deserialization=True
    )