from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, models
from ..database import get_db
from typing import List

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.post("/", response_model=schemas.Incident)
def create_incident(incident: schemas.IncidentCreate, db: Session = Depends(get_db)):
    return crud.create_incident(db=db, incident=incident)

@router.get("/{incident_id}", response_model=schemas.Incident)
def get_incident(incident_id: int, db: Session = Depends(get_db)):
    db_incident = crud.get_incident(db, incident_id=incident_id)
    if db_incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return db_incident

@router.get("/", response_model=List[schemas.Incident])
def get_incidents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_incidents(db, skip=skip, limit=limit) 