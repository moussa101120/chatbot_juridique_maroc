import ReactMarkdown from "react-markdown";
import { FileText, User, Scale } from "lucide-react";

const formatTime = (date) =>
  new Date(date).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" });

export const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 animate-fade-up ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white
        ${isUser ? "bg-brand-600" : "bg-surface-800"}`}>
        {isUser ? <User size={14} /> : <Scale size={14} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] space-y-2 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${isUser
            ? "bg-brand-600 text-white rounded-tr-sm"
            : "bg-white text-surface-900 rounded-tl-sm shadow-sm border border-slate-100"}`}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Sources */}
        {!isUser && message.sources?.length > 0 && (
          <div className="space-y-1 w-full">
            <p className="text-xs text-slate-400 font-medium px-1">Sources :</p>
            {message.sources.map((src, i) => (
              <div key={i} className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                <FileText size={12} className="text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-brand-700">{src.source_file} — p.{src.page}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{src.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <span className="text-xs text-slate-400 px-1">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
};

export const TypingIndicator = () => (
  <div className="flex gap-3 animate-fade-up">
    <div className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center">
      <Scale size={14} className="text-white" />
    </div>
    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-100">
      <div className="dot-typing flex items-center h-4">
        <span /><span /><span />
      </div>
    </div>
  </div>
);
