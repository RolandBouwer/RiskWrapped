from sqlalchemy import (
    Column, Integer, String, ForeignKey, DateTime, Boolean, Text
)
from sqlalchemy.orm import relationship
from .database import Base
import datetime


class Node(Base):
    __tablename__ = "nodes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    parent_id = Column(Integer, ForeignKey("nodes.id"), nullable=True)
    level = Column(Integer, nullable=False)

    parent = relationship("Node", remote_side=[id], backref="children")
    users = relationship("User", back_populates="node")
    risks = relationship("Risk", back_populates="node")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(
        String, unique=True, index=True, nullable=False
    )
    hashed_password = Column(
        String, nullable=False
    )
    node_id = Column(
        Integer, ForeignKey("nodes.id")
    )
    level = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)

    node = relationship("Node", back_populates="users")
    action_items = relationship("ActionItem", back_populates="assigned_to_user")


class Risk(Base):
    __tablename__ = "risks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    node_id = Column(Integer, ForeignKey("nodes.id"))
    risk_type = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    node = relationship("Node", back_populates="risks")
    action_items = relationship("ActionItem", back_populates="risk")


class ActionItem(Base):
    __tablename__ = "action_items"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    risk_id = Column(Integer, ForeignKey("risks.id"))
    assigned_to = Column(Integer, ForeignKey("users.id"))
    status = Column(String)
    due_date = Column(DateTime)

    risk = relationship("Risk", back_populates="action_items")
    assigned_to_user = relationship("User", back_populates="action_items")


class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    root_cause = Column(Text)
    loss_amount = Column(Integer, nullable=True)  # Use Integer or Float as needed
    is_financial = Column(Boolean, default=False)
    node_id = Column(Integer, ForeignKey("nodes.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    node = relationship("Node", backref="incidents")
