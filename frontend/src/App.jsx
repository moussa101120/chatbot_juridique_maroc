import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { ChatWindow } from "./components/chat/ChatWindow";
import { useChat } from "./hooks/useChat";
import { useDocuments } from "./hooks/useDocuments";
import { Menu, X } from "lucide-react";

function App() {
  const chat = useChat();
  const docs = useDocuments();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-900 relative">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div
        className={`fixed lg:relative z-30 lg:z-auto h-full transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <Sidebar
          documents={docs.documents}
          uploading={docs.uploading}
          uploadProgress={docs.uploadProgress}
          uploadMessage={docs.uploadMessage}
          onUpload={docs.upload}
          onNewConversation={() => chat.newConversation(chat.currentMessages)}
          onOpenSession={chat.openSession}
          onDeleteSession={chat.deleteSession}
          sessions={chat.sessions}
          activeSession={chat.activeSession}
          currentMessages={chat.currentMessages}
        />
      </div>

      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="fixed top-4 left-4 z-40 lg:hidden w-9 h-9 rounded-lg bg-surface-800 flex items-center justify-center text-white shadow-lg"
      >
        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      <main className="flex-1 min-w-0 min-h-0 overflow-hidden flex flex-col">
        <ChatWindow
          messages={chat.messages}
          loading={chat.loading}
          onSend={chat.ask}
          onExport={chat.exportPDF}
          isViewingSession={!!chat.activeSession}
          sessionName={chat.activeSession?.name}
          onBackToCurrent={chat.backToCurrent}
        />
      </main>
    </div>
  );
}

export default App;
