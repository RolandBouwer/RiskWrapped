from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, models
from ..database import get_db
from typing import List

router = APIRouter(prefix="/risks", tags=["risks"])

@router.post("/", response_model=schemas.Risk)
def create_risk(risk: schemas.RiskCreate, db: Session = Depends(get_db)):
    return crud.create_risk(db=db, risk=risk)

@router.get("/{risk_id}", response_model=schemas.Risk)
def get_risk(risk_id: int, db: Session = Depends(get_db)):
    db_risk = crud.get_risk(db, risk_id=risk_id)
    if db_risk is None:
        raise HTTPException(status_code=404, detail="Risk not found")
    return db_risk

@router.get("/", response_model=List[schemas.Risk])
def get_risks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_risks(db, skip=skip, limit=limit)
