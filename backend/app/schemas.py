from pydantic import BaseModel, EmailStr
from typing import Optional
import datetime


class NodeBase(BaseModel):
    name: str
    parent_id: Optional[int] = None
    level: int


class NodeCreate(NodeBase):
    pass


class Node(NodeBase):
    id: int

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    username: str
    email: EmailStr
    node_id: int
    level: int
    is_active: Optional[bool] = True


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        from_attributes = True


class RiskBase(BaseModel):
    title: str
    description: Optional[str] = None
    node_id: int
    risk_type: Optional[str] = None
    status: Optional[str] = None


class RiskCreate(RiskBase):
    pass


class Risk(RiskBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True


class ActionItemBase(BaseModel):
    description: str
    risk_id: int
    assigned_to: int
    status: Optional[str] = None
    due_date: Optional[datetime.datetime] = None


class ActionItemCreate(ActionItemBase):
    pass


class ActionItem(ActionItemBase):
    id: int

    class Config:
        from_attributes = True
