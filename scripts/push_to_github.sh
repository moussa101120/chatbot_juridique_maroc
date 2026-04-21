#!/bin/bash
# ============================================================
#  push_to_github.sh — Initialise et pousse le projet sur GitHub
#  Usage : bash push_to_github.sh <github_username> <repo_name>
# ============================================================

set -e

USERNAME=${1:-"moussa101120"}
REPO=${2:-"chatbot_juridique_maroc"}

echo ""
echo "🚀 Push GitHub : $USERNAME/$REPO"
echo "============================================"

# 1. Git init
git init
git add .
git commit -m "feat: initial commit — Chatbot Juridique Maroc RAG

- Backend FastAPI avec architecture RAG (LangChain + FAISS + Groq)
- Frontend React + TailwindCSS responsive
- Upload dynamique de PDFs et indexation vectorielle
- Export conversation en PDF (ReportLab)
- Chatbot multi-tours avec sources citées"

# 2. Créer le repo via GitHub CLI (si gh est installé)
if command -v gh &> /dev/null; then
  echo "✅ GitHub CLI détecté — création du repo..."
  gh repo create "$REPO" --public --source=. --remote=origin --push
  echo ""
  echo "✅ Projet disponible sur : https://github.com/$USERNAME/$REPO"
else
  echo ""
  echo "⚠️  GitHub CLI non installé. Étapes manuelles :"
  echo ""
  echo "  1. Créer le repo sur https://github.com/new"
  echo "     Nom : $REPO | Public | Sans README"
  echo ""
  echo "  2. Puis exécuter :"
  echo "     git remote add origin https://github.com/$USERNAME/$REPO.git"
  echo "     git branch -M main"
  echo "     git push -u origin main"
fi
