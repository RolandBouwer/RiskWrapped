# Risk Wrapped Backend

A flexible, AI-powered FastAPI backend for Risk Wrapped, supporting hierarchical orgs, risk aggregation, and insights.

## Stack
- FastAPI (Python 3.9+)
- SQLAlchemy (ORM)
- Pydantic v2 (schemas)
- PostgreSQL (database)
- JWT authentication
- Flexible AI provider support (OpenAI, Google AI Studio, DeepSeek, Azure OpenAI)

## Features
- Models: User, Node (org structure), Risk, ActionItem
- Hierarchical org access (L1–L10)
- CRUD for users, nodes, risks, action items
- AI insights endpoint (switch provider via env)
- Health check endpoint
- CORS enabled for frontend
- Seeding script for org, users, risks, actions

## Setup
1. Create `.env` with DB and AI provider settings (see `.env.example`)
2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Run the app:
   ```bash
   uvicorn app.main:app --reload
   ```
4. API docs at [http://localhost:8000/docs](http://localhost:8000/docs)

## Database
- Auto-creates DB if not present
- Seeding: run `python app/seed.py` to populate with org/users/risks

## AI Providers
- Set env vars to switch between OpenAI, Google, DeepSeek, Azure
- See `app/ai.py` for details

## Contributing
- Use feature branches and PRs
- Document major changes in `../CHANGELOG.md`

---
See the frontend README for UI details. 