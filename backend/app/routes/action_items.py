from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, models
from ..database import get_db
from typing import List, Optional

router = APIRouter(prefix="/action_items", tags=["action_items"])

@router.get("/", response_model=List[schemas.ActionItem])
def get_action_items(assigned_to: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.ActionItem)
    if assigned_to is not None:
        query = query.filter(models.ActionItem.assigned_to == assigned_to)
    return query.offset(skip).limit(limit).all()

@router.get("/{action_item_id}", response_model=schemas.ActionItem)
def get_action_item(action_item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.ActionItem).filter(models.ActionItem.id == action_item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")
    return item 