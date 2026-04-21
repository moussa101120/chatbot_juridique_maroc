import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

const SUGGESTIONS = [
  "Quels sont mes droits en cas de licenciement abusif ?",
  "Comment contester un PV de contravention ?",
  "Quelle est la procédure pour un divorce par consentement mutuel ?",
  "Quels délais pour une action en justice civile ?",
];

export const ChatInput = ({ onSend, loading, hasMessages }) => {
  const [input, setInput] = useState("");

  const submit = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  return (
    <div className="px-4 pb-5 pt-3 bg-surface-50 border-t border-slate-200">
      {/* Suggestions — shown only when no messages yet */}
      {!hasMessages && (
        <div className="flex flex-wrap gap-2 mb-3 justify-center">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => { setInput(s); }}
              className="text-xs bg-white border border-slate-200 hover:border-brand-600 hover:text-brand-700
                text-slate-600 rounded-full px-3 py-1.5 transition-colors shadow-sm">
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="max-w-3xl mx-auto flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          rows={1}
          placeholder="Posez votre question juridique…"
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm
            focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent
            shadow-sm placeholder-slate-400 min-h-[48px] max-h-32 leading-relaxed"
          style={{ height: "48px", overflowY: input.split("\n").length > 2 ? "auto" : "hidden" }}
        />
        <button
          onClick={submit}
          disabled={loading || !input.trim()}
          className="w-12 h-12 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40
            disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-sm shrink-0">
          {loading
            ? <Loader2 size={18} className="text-white animate-spin" />
            : <Send size={18} className="text-white" />}
        </button>
      </div>
      <p className="text-center text-xs text-slate-400 mt-2">
        Basé sur les lois marocaines indexées · Consultez un avocat pour les cas complexes
      </p>
    </div>
  );
};
