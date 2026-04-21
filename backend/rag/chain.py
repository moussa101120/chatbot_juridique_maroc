import os
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.messages import HumanMessage, AIMessage
from dotenv import load_dotenv
from .ingestion import load_vectorstore

load_dotenv()

SYSTEM_PROMPT = """Tu es un assistant juridique expert en droit marocain. 
Tu aides les citoyens marocains à comprendre leurs droits et les procédures légales.
Tu réponds en français de manière claire, accessible et pédagogique.

Règles importantes :
- Base-toi UNIQUEMENT sur les documents fournis dans le contexte.
- Si l'information n'est pas dans les documents, dis-le clairement.
- Cite toujours la source (nom du fichier et article si possible).
- N'invente jamais de lois ou d'articles.
- Conseille toujours de consulter un avocat pour les cas complexes.

Contexte juridique :
{context}

Question : {question}

Réponse structurée et sourcée :"""


def format_docs(docs):
    return "\n\n".join(
        f"[Source: {doc.metadata.get('source_file', 'inconnu')}]\n{doc.page_content}"
        for doc in docs
    )


def format_history(chat_history: list) -> str:
    """Convert list of {role, content} dicts to a readable string."""
    if not chat_history:
        return ""
    lines = []
    for msg in chat_history:
        role = "Utilisateur" if msg.get("role") == "user" else "Assistant"
        lines.append(f"{role}: {msg.get('content', '')}")
    return "\n".join(lines)


def build_chain():
    vectorstore = load_vectorstore()
    if vectorstore is None:
        return None

    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 5},
    )

    llm = ChatGroq(
        model=os.getenv("LLM_MODEL", "llama3-70b-8192"),
        temperature=0.1,
        max_tokens=1500,
    )

    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template=SYSTEM_PROMPT,
    )

    # LCEL chain: retrieve → format → prompt → llm → parse
    chain = (
        {
            "context": retriever | RunnableLambda(format_docs),
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain


# Singleton
_chain = None


def get_chain():
    global _chain
    if _chain is None:
        _chain = build_chain()
    return _chain


def reset_chain():
    global _chain
    _chain = None
    _chain = build_chain()


def ask(question: str, chat_history: list = None) -> dict:
    """
    Main entry point. 
    chat_history: list of {"role": "user"|"assistant", "content": "..."}
    Returns {"answer": str, "source_documents": list}
    """
    vectorstore = load_vectorstore()
    if vectorstore is None:
        return {"answer": "Aucun document juridique n'a encore été chargé.", "source_documents": []}

    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 5},
    )

    # Build question with history context if provided
    history_str = format_history(chat_history or [])
    full_question = question
    if history_str:
        full_question = f"Historique de la conversation :\n{history_str}\n\nQuestion actuelle : {question}"

    # Retrieve source docs for return
    source_docs = retriever.invoke(question)
    context = format_docs(source_docs)

    llm = ChatGroq(
        model=os.getenv("LLM_MODEL", "llama3-70b-8192"),
        temperature=0.1,
        max_tokens=1500,
    )

    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template=SYSTEM_PROMPT,
    )

    chain = prompt | llm | StrOutputParser()
    answer = chain.invoke({"context": context, "question": full_question})

    return {
        "answer": answer,
        "source_documents": source_docs,
    }