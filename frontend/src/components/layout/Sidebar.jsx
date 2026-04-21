import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  Scale,
  MessageSquare,
  Plus,
  Clock,
  X,
} from "lucide-react";

export const Sidebar = ({
  documents,
  uploading,
  uploadProgress,
  uploadMessage,
  onUpload,
  onNewConversation,
  onOpenSession,
  onDeleteSession,
  sessions = [],
  activeSession = null,
  currentMessages = [],
}) => {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (file && file.type === "application/pdf") onUpload(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <aside className="w-72 bg-surface-900 flex flex-col h-full text-white shrink-0">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
            <Scale size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight">Qanoun.ai</h1>
            <p className="text-xs text-slate-400">Assistant Juridique Maroc</p>
          </div>
        </div>
      </div>

      {/* Bouton Nouvelle conversation */}
      <div className="px-4 pt-4 pb-3">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 text-xs font-medium
            bg-brand-600 hover:bg-brand-700 text-white rounded-xl py-2.5 transition-colors shadow-sm"
        >
          <Plus size={14} />
          Nouvelle conversation
        </button>
      </div>

      {/* Upload zone */}
      <div className="px-4 py-4 border-b border-white/10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Base documentaire</p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200
            ${dragging ? "border-brand-600 bg-brand-600/10" : "border-white/20 hover:border-white/40 hover:bg-white/5"}`}
        >
          {uploading ? (
            <div className="space-y-2">
              <Loader2 size={20} className="mx-auto text-brand-600 animate-spin" />
              <p className="text-xs text-slate-400">Indexation… {uploadProgress}%</p>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-brand-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <Upload size={20} className="mx-auto text-slate-400 mb-2" />
              <p className="text-xs text-slate-300 font-medium">Déposer un PDF</p>
              <p className="text-xs text-slate-500 mt-0.5">ou cliquer pour choisir</p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {uploadMessage && (
          <div
            className={`mt-2 flex items-start gap-2 text-xs rounded-lg p-2.5
            ${uploadMessage.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
          >
            {uploadMessage.type === "success" ? (
              <CheckCircle size={13} className="mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
            )}
            <span>{uploadMessage.text}</span>
          </div>
        )}
      </div>

      {/* Documents indexés */}
      {documents.length > 0 && (
        <div className="px-4 py-4 border-b border-white/10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Documents indexés ({documents.length})
          </p>
          <ul className="space-y-1.5 max-h-28 overflow-y-auto">
            {documents.map((doc, i) => (
              <li key={i} className="flex items-center gap-2.5 bg-white/5 rounded-lg px-3 py-2">
                <FileText size={13} className="text-brand-600 shrink-0" />
                <span className="text-xs text-slate-300 truncate flex-1" title={doc}>
                  {doc}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Historique des sessions */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Clock size={11} />
          Historique ({sessions.length})
        </p>

        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare size={24} className="mx-auto text-slate-600 mb-2" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Vos conversations passées
              <br />
              apparaîtront ici.
            </p>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {sessions.map((session) => {
              const isActive = activeSession?.id === session.id;
              return (
                <li key={session.id} className="group/item relative">
                  <button
                    onClick={() => onOpenSession(session)}
                    className={`w-full text-left rounded-xl px-3 py-3 pr-8 transition-all
                      ${
                        isActive
                          ? "bg-brand-600/20 border border-brand-600/40"
                          : "bg-white/5 hover:bg-white/10 border border-transparent"
                      }`}
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare
                        size={12}
                        className={`mt-0.5 shrink-0 ${isActive ? "text-brand-400" : "text-slate-500"}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-medium leading-snug truncate ${isActive ? "text-white" : "text-slate-300"}`}
                        >
                          {session.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {session.messages.length} msg · {formatDate(session.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                  {/* Bouton supprimer — visible au hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    title="Supprimer cette conversation"
                    className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center
                      rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/10
                      opacity-0 group-hover/item:opacity-100 transition-all"
                  >
                    <X size={11} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
};
