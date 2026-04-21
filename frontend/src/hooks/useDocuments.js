import { useState, useEffect, useCallback } from "react";
import { uploadPDF, listDocuments } from "../services/api";

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } catch {
      setDocuments([]);
    }
  }, []);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const upload = useCallback(async (file) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadMessage(null);
    try {
      const result = await uploadPDF(file, setUploadProgress);
      setUploadMessage({ type: "success", text: result.message });
      await fetchDocuments();
    } catch (err) {
      const msg = err.response?.data?.detail || "Erreur lors de l'upload.";
      setUploadMessage({ type: "error", text: msg });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [fetchDocuments]);

  return { documents, uploading, uploadProgress, uploadMessage, upload, fetchDocuments };
};
