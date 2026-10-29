# Resume Analyzer

FastAPI backend + React (Vite) frontend. Currently scaffolding with a Gemini smoke-test endpoint.

## Setup

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then set GEMINI_API_KEY
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

Backend: http://localhost:8000 (`GET /api/ping-gemini`), frontend: http://localhost:5173.
