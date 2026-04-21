import { useState, useCallback, useRef } from "react";
import { sendMessage, resetChat, exportConversation } from "../services/api";

const generateSessionName = (messages) => {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "Conversation sans titre";
  const text = firstUser.content.trim();
  return text.length > 45 ? text.slice(0, 45) + "…" : text;
};

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref pour éviter la double sauvegarde en React StrictMode
  const isSavingRef = useRef(false);

  const addMessage = (role, content, sources = []) => {
    const msg = { id: Date.now() + Math.random(), role, content, sources, timestamp: new Date() };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const ask = useCallback(
    async (question) => {
      if (!question.trim() || loading) return;
      setActiveSession(null);
      setError(null);
      addMessage("user", question);
      setLoading(true);
      try {
        const history = messages.map((m) => ({ role: m.role, content: m.content }));
        const { answer, sources } = await sendMessage(question, history);
        addMessage("assistant", answer, sources);
      } catch (err) {
        const msg = err.response?.data?.detail || "Erreur de connexion au serveur.";
        setError(msg);
        addMessage("assistant", `⚠️ ${msg}`, []);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading],
  );

  const newConversation = useCallback(async (currentMessages) => {
    // currentMessages est passé en argument pour éviter les problèmes de closure
    if (isSavingRef.current) return;
    isSavingRef.current = true;

    if (currentMessages && currentMessages.length > 0) {
      const session = {
        id: `session-${Date.now()}-${Math.random()}`,
        name: generateSessionName(currentMessages),
        messages: currentMessages,
        createdAt: new Date(),
      };
      setSessions((prev) => {
        // Sécurité : ne pas dupliquer si même contenu
        const alreadyExists = prev.some(
          (s) => s.name === session.name && s.messages.length === session.messages.length,
        );
        if (alreadyExists) return prev;
        return [session, ...prev];
      });
    }

    await resetChat();
    setMessages([]);
    setActiveSession(null);
    setError(null);
    isSavingRef.current = false;
  }, []);

  const deleteSession = useCallback((sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setActiveSession((prev) => (prev?.id === sessionId ? null : prev));
  }, []);

  const openSession = useCallback((session) => {
    setActiveSession(session);
  }, []);

  const backToCurrent = useCallback(() => {
    setActiveSession(null);
  }, []);

  const exportPDF = useCallback(async () => {
    const source = activeSession ? activeSession.messages : messages;
    const exportMessages = source.map((m) => ({ role: m.role, content: m.content }));
    await exportConversation("Consultation Juridique", exportMessages);
  }, [messages, activeSession]);

  const displayedMessages = activeSession ? activeSession.messages : messages;

  return {
    messages: displayedMessages,
    currentMessages: messages,
    sessions,
    activeSession,
    loading,
    error,
    ask,
    newConversation,
    deleteSession,
    openSession,
    backToCurrent,
    exportPDF,
  };
};
