from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import ai
from ..database import get_db

router = APIRouter(prefix="/insights", tags=["insights"])

@router.post("/generate")
def generate_insight(text: str, db: Session = Depends(get_db)):
    # Placeholder for AI-generated insight
    return {"insight": ai.get_insight(text)}
