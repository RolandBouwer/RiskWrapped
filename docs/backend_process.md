# Backend Process Documentation

## 1. Environment Setup

- Create a Python virtual environment:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```
- Install dependencies:
  ```bash
  pip install -r backend/requirements.txt
  ```
- Add a `.env` file in the project root with your database and AI provider credentials.

## 2. Database Connection Logic

- The backend uses SQLAlchemy for ORM and connects to PostgreSQL.
- Connection details are loaded from either a single `DATABASE_CONNECTION_STRING` (in the format: `Host=...;Port=...;Database=...;Username=...;Password=...;`) or from individual environment variables (`POSTGRES_USER`, `POSTGRES_PASSWORD`, etc.).
- The connection string is parsed and URL-encoded for SQLAlchemy compatibility.
- On FastAPI startup, all tables are created automatically if they do not exist.

## 3. Updating Code to Align with Database Changes

- If the database schema changes (e.g., new fields, tables), update `backend/app/models.py` accordingly.
- Update Pydantic schemas in `backend/app/schemas.py` to match the models.
- If new CRUD operations are needed, add them to `backend/app/crud.py`.
- Run the app to auto-create new tables/fields (for simple changes). For production, use Alembic for migrations.

## 4. Running the Backend

- Start the FastAPI app:
  ```bash
  uvicorn backend.app.main:app --reload
  ```
- The API will be available at `http://localhost:8000` by default.

## 5. Additional Notes

- The backend supports switching between AI providers (OpenAI, Google AI Studio, DeepSeek, Azure OpenAI) via environment variables.
- All documentation should be placed in the `docs/` folder. 