# Qanoun.ai — Chatbot Juridique Maroc

> Assistant juridique intelligent basé sur une architecture **RAG (Retrieval-Augmented Generation)**, dédié au droit marocain. Fournit des réponses précises et **sourcées** à partir de documents PDF de lois marocaines.

---

## Fonctionnalités

- **Chatbot RAG** : Réponses sourcées basées uniquement sur les documents indexés
- **Upload dynamique** de PDFs (lois, codes, normes)
- **Sources citées** avec nom du fichier et numéro de page
- **Export PDF** de la conversation (ReportLab)
- **LLM** : Llama 3 70B via Groq API (gratuit et rapide)
- **Interface responsive** (PC, tablette, mobile)
- **Historique** de conversation multi-tours

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (React)                  │
│  Sidebar (Upload/Docs) │ ChatWindow │ MessageBubble  │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP (axios)
┌──────────────────▼──────────────────────────────────┐
│                   BACKEND (FastAPI)                  │
│   /chat  ──►  LangChain ConversationalRAGChain       │
│   /documents/upload  ──►  PDF Ingestion + FAISS      │
│   /documents/export  ──►  ReportLab PDF Generator    │
└──────────────────┬──────────────────────────────────┘
                   │
     ┌─────────────┴──────────────┐
     │                            │
┌────▼─────┐              ┌──────▼──────┐
│  FAISS   │              │  Groq API   │
│ (Vectors)│              │ (Llama 3)   │
└──────────┘              └─────────────┘
```

---

## Lancer le projet

### Prérequis

- Python 3.10+
- Node.js 18+
- Clé API Groq (gratuite sur [console.groq.com](https://console.groq.com))

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configurer les variables d'environnement
cp ../.env.example ../.env
# Éditer .env et renseigner GROQ_API_KEY

uvicorn main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

L'application est disponible sur **http://localhost:5173**

---

## Structure du projet

```
chatbot-juridique-maroc/
├── backend/
│   ├── main.py                  # FastAPI app + CORS
│   ├── rag/
│   │   ├── ingestion.py         # Chargement PDFs + FAISS index
│   │   └── chain.py             # Chaîne RAG LangChain + Groq
│   ├── routes/
│   │   ├── chat.py              # POST /chat, POST /chat/reset
│   │   └── documents.py         # POST /upload, GET /list, POST /export
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── layout/Sidebar.jsx
│       │   └── chat/
│       │       ├── ChatWindow.jsx
│       │       ├── ChatInput.jsx
│       │       └── MessageBubble.jsx
│       ├── hooks/
│       │   ├── useChat.js
│       │   └── useDocuments.js
│       └── services/api.js
├── data/                        # PDFs et index FAISS (gitignorés)
├── .env
└── README.md
```

---

## Stack Technique

| Couche     | Technologie                              |
| ---------- | ---------------------------------------- |
| Frontend   | React 18, Vite, TailwindCSS, Axios       |
| Backend    | FastAPI, Python 3.10+                    |
| RAG        | LangChain, FAISS, HuggingFace Embeddings |
| LLM        | Llama 3 70B (Groq API)                   |
| Embeddings | `paraphrase-multilingual-MiniLM-L12-v2`  |
| PDF        | PyPDF, ReportLab                         |

---

## Utilisation

1. **Uploader** un PDF de loi marocaine via la sidebar
2. **Poser** votre question dans le chat
3. **Obtenir** une réponse sourcée avec références de pages
4. **Exporter** la conversation en PDF

---
