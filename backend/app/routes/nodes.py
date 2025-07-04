from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, models
from ..database import get_db
from typing import List

router = APIRouter(prefix="/nodes", tags=["nodes"])

@router.post("/", response_model=schemas.Node)
def create_node(node: schemas.NodeCreate, db: Session = Depends(get_db)):
    return crud.create_node(db=db, node=node)

@router.get("/{node_id}", response_model=schemas.Node)
def get_node(node_id: int, db: Session = Depends(get_db)):
    db_node = crud.get_node(db, node_id=node_id)
    if db_node is None:
        raise HTTPException(status_code=404, detail="Node not found")
    return db_node

@router.get("/", response_model=List[schemas.Node])
def get_nodes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_nodes(db, skip=skip, limit=limit)
