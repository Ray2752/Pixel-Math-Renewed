# Pixel Math

Educational math app with pixel-art UI built in Python.

## Instalación
```bash
pip install -r requirements.txt
python main.py
```

## Web Migration (Sprint 1 Scaffold)

### Backend (FastAPI)
```bash
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

### Quick check
- API health: http://127.0.0.1:8000/health
- Frontend app: http://127.0.0.1:5173