from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Node CRUD

def create_node(db: Session, node: schemas.NodeCreate) -> models.Node:
    db_node = models.Node(**node.dict())
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    return db_node

def get_node(db: Session, node_id: int) -> Optional[models.Node]:
    return db.query(models.Node).filter(models.Node.id == node_id).first()

def get_nodes(db: Session, skip: int = 0, limit: int = 100) -> List[models.Node]:
    return db.query(models.Node).offset(skip).limit(limit).all()

# User CRUD

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        node_id=user.node_id,
        level=user.level,
        is_active=user.is_active
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()

# Risk CRUD

def create_risk(db: Session, risk: schemas.RiskCreate) -> models.Risk:
    db_risk = models.Risk(**risk.dict())
    db.add(db_risk)
    db.commit()
    db.refresh(db_risk)
    return db_risk

def get_risk(db: Session, risk_id: int) -> Optional[models.Risk]:
    return db.query(models.Risk).filter(models.Risk.id == risk_id).first()

def get_risks(db: Session, skip: int = 0, limit: int = 100) -> List[models.Risk]:
    return db.query(models.Risk).offset(skip).limit(limit).all()

# ActionItem CRUD

def create_action_item(db: Session, action_item: schemas.ActionItemCreate) -> models.ActionItem:
    db_action_item = models.ActionItem(**action_item.dict())
    db.add(db_action_item)
    db.commit()
    db.refresh(db_action_item)
    return db_action_item

def get_action_item(db: Session, action_item_id: int) -> Optional[models.ActionItem]:
    return db.query(models.ActionItem).filter(models.ActionItem.id == action_item_id).first()

def get_action_items(db: Session, skip: int = 0, limit: int = 100) -> List[models.ActionItem]:
    return db.query(models.ActionItem).offset(skip).limit(limit).all()
