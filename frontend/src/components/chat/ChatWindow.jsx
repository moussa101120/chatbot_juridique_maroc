import { useEffect, useRef } from "react";
import { MessageBubble, TypingIndicator } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { Download, Scale, ArrowLeft, Eye } from "lucide-react";

const WelcomeScreen = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-16">
    <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mb-5 shadow-lg shadow-brand-600/30">
      <Scale size={28} className="text-white" />
    </div>
    <h2 className="font-display text-2xl font-bold text-surface-900 mb-2">Bienvenue sur Qanoun.ai</h2>
    <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
      Votre assistant juridique intelligent basé sur le droit marocain. Posez vos questions, obtenez des réponses
      sourcées.
    </p>
    <div className="grid grid-cols-2 gap-3 mt-8 max-w-sm w-full">
      {["Droit du travail", "Droit de la famille", "Droit pénal", "Droit commercial"].map((t) => (
        <div
          key={t}
          className="bg-white border border-slate-100 rounded-xl p-3 text-xs text-slate-600 font-medium shadow-sm"
        >
          {t}
        </div>
      ))}
    </div>
  </div>
);

export const ChatWindow = ({
  messages,
  loading,
  onSend,
  onExport,
  isViewingSession = false,
  sessionName = "",
  onBackToCurrent,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-surface-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div>
          {isViewingSession ? (
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-brand-600" />
              <h2 className="font-semibold text-surface-900 text-sm truncate max-w-xs" title={sessionName}>
                {sessionName}
              </h2>
            </div>
          ) : (
            <h2 className="font-semibold text-surface-900 text-sm">Consultation juridique</h2>
          )}
          <p className="text-xs text-slate-400">
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isViewingSession && (
            <button
              onClick={onBackToCurrent}
              className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700
                hover:bg-brand-50 rounded-lg px-3 py-2 transition-colors border border-brand-200"
            >
              <ArrowLeft size={13} />
              Conversation actuelle
            </button>
          )}
          {messages.length > 0 && (
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-700
                hover:bg-brand-50 rounded-lg px-3 py-2 transition-colors border border-slate-200 hover:border-brand-200"
            >
              <Download size={13} />
              Exporter PDF
            </button>
          )}
        </div>
      </header>

      {/* Bannière session en lecture */}
      {isViewingSession && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center gap-2 shrink-0">
          <Eye size={12} className="text-amber-600" />
          <p className="text-xs text-amber-700">
            Vous consultez une conversation passée —
            <button onClick={onBackToCurrent} className="underline ml-1 font-medium hover:text-amber-900">
              retour à la conversation en cours
            </button>
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 max-w-3xl w-full mx-auto">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input — désactivé en mode lecture */}
      {!isViewingSession && <ChatInput onSend={onSend} loading={loading} hasMessages={messages.length > 0} />}
      {isViewingSession && (
        <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 text-center">
          <p className="text-xs text-slate-400">
            Conversation archivée ·{" "}
            <button onClick={onBackToCurrent} className="text-brand-600 hover:underline font-medium">
              Reprendre la conversation en cours
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
