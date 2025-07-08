from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from .. import ai, schemas, crud, models
from ..database import get_db
from typing import List, Optional
import pandas as pd

router = APIRouter(prefix="/insights", tags=["insights"])

@router.post("/generate")
def generate_insight(text: str, db: Session = Depends(get_db)):
    # Placeholder for AI-generated insight
    return {"insight": ai.get_insight(text)}

# Helper to recursively collect all descendant node IDs
def get_descendant_node_ids(node, collected=None):
    if collected is None:
        collected = set()
    collected.add(node.id)
    for child in node.children:
        get_descendant_node_ids(child, collected)
    return collected

@router.get("/")
def get_insights(node_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    from ..ai import AI_PROVIDER
    if node_id:
        node = db.query(models.Node).filter(models.Node.id == node_id).first()
        if not node:
            return [{"insight": f"Node {node_id} not found."}]
        # Get all descendant node IDs
        node_ids = get_descendant_node_ids(node)
    else:
        # All nodes
        node_ids = [n.id for n in db.query(models.Node).all()]

    # Aggregate data for all relevant nodes
    risks = db.query(models.Risk).filter(models.Risk.node_id.in_(node_ids)).all()
    incidents = db.query(models.Incident).filter(models.Incident.node_id.in_(node_ids)).all()
    actions = db.query(models.ActionItem).join(models.Risk).filter(models.Risk.node_id.in_(node_ids)).all()

    # Convert to DataFrames
    risks_df = pd.DataFrame([{
        "id": r.id, "title": r.title, "description": r.description, "risk_type": r.risk_type, "status": r.status, "created_at": r.created_at
    } for r in risks])
    incidents_df = pd.DataFrame([{
        "id": i.id, "name": i.name, "description": i.description, "root_cause": i.root_cause, "loss_amount": i.loss_amount, "is_financial": i.is_financial, "created_at": i.created_at
    } for i in incidents])
    actions_df = pd.DataFrame([{
        "id": a.id, "description": a.description, "status": a.status, "due_date": a.due_date
    } for a in actions])

    if AI_PROVIDER == "hf_transformers":
        risk_insight = ai.get_insight("Summarize the risk landscape for this scope.", table=risks_df, task="summarization") if not risks_df.empty else "No risks."
        incident_insight = ai.get_insight("Summarize the incident landscape for this scope.", table=incidents_df, task="summarization") if not incidents_df.empty else "No incidents."
        action_insight = ai.get_insight("Summarize the action items for this scope.", table=actions_df, task="summarization") if not actions_df.empty else "No actions."
        return [{
            "scope": "all" if not node_id else f"node {node_id} and descendants",
            "risk_insight": risk_insight,
            "incident_insight": incident_insight,
            "action_insight": action_insight
        }]
    # Fallback: original summary prompt for other providers
    if node_id:
        node = db.query(models.Node).filter(models.Node.id == node_id).first()
        node_name = node.name if node else f"Node {node_id}"
    else:
        node_name = "All Nodes"
    prompt = f"Provide a concise AI insight for the following scope: {node_name}\n"
    prompt += f"Risks: {len(risks)}\n"
    prompt += f"Incidents: {len(incidents)}\n"
    prompt += f"Actions: {len(actions)}\n"
    if risks:
        prompt += f"Top Risk: {risks[0].title} - {risks[0].description}\n"
    if incidents:
        prompt += f"Recent Incident: {incidents[0].name} - {incidents[0].description}\n"
    if actions:
        prompt += f"Sample Action: {actions[0].description}\n"
    prompt += "Summarize the risk and incident landscape and suggest a next step."
    ai_response = ai.get_insight(prompt)
    return [{"scope": node_name, "insight": ai_response}]
