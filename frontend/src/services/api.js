import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 60000,
});

export const sendMessage = async (question, history) => {
  const { data } = await api.post("/chat/", { question, history });
  return data; // { answer, sources }
};

export const resetChat = async () => {
  await api.post("/chat/reset");
};

export const uploadPDF = async (file, onProgress) => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post("/documents/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  });
  return data;
};

export const listDocuments = async () => {
  const { data } = await api.get("/documents/list");
  return data.documents;
};

export const exportConversation = async (title, messages) => {
  const response = await api.post("/documents/export", { title, messages }, { responseType: "blob" });
  const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "consultation_juridique.pdf";
  a.click();
  URL.revokeObjectURL(url);
};

export default api;
