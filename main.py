from fastapi import FastAPI, Depends, HTTPException, status, Request, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from backend.app.database import engine, Base, get_db
from backend.app import crud, models, schemas, ai
import os
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Risk Insights - HTMX")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user_from_cookie(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
    except JWTError:
        return None
    user = db.query(models.User).filter(models.User.username == username).first()
    return user

def require_auth(request: Request, db: Session = Depends(get_db)):
    user = get_current_user_from_cookie(request, db)
    if not user:
        raise HTTPException(status_code=302, headers={"Location": "/login"})
    return user

# Helper to recursively collect all descendant node IDs
def get_descendant_node_ids(node, collected=None):
    if collected is None:
        collected = set()
    collected.add(node.id)
    for child in node.children:
        get_descendant_node_ids(child, collected)
    return collected

# Routes
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return RedirectResponse(url="/dashboard")

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
async def login(request: Request, username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = authenticate_user(db, username, password)
    if not user:
        return templates.TemplateResponse("login.html", {
            "request": request, 
            "error": "Invalid username or password"
        })
    
    access_token = create_access_token(data={"sub": user.username})
    response = RedirectResponse(url="/dashboard", status_code=302)
    response.set_cookie(key="access_token", value=access_token, httponly=True)
    return response

@app.post("/logout")
async def logout():
    response = RedirectResponse(url="/login", status_code=302)
    response.delete_cookie(key="access_token")
    return response

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request, user: models.User = Depends(require_auth), db: Session = Depends(get_db)):
    # Get user's node and all descendant nodes
    user_node = db.query(models.Node).filter(models.Node.id == user.node_id).first()
    if user_node:
        node_ids = get_descendant_node_ids(user_node)
    else:
        node_ids = []
    
    # Get aggregated data
    risks = db.query(models.Risk).filter(models.Risk.node_id.in_(node_ids)).all() if node_ids else []
    incidents = db.query(models.Incident).filter(models.Incident.node_id.in_(node_ids)).all() if node_ids else []
    actions = db.query(models.ActionItem).join(models.Risk).filter(models.Risk.node_id.in_(node_ids)).all() if node_ids else []
    
    # Calculate financial loss
    financial_loss = sum(i.loss_amount for i in incidents if i.is_financial and i.loss_amount)
    
    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "user": user,
        "user_node": user_node,
        "risks_count": len(risks),
        "incidents_count": len(incidents),
        "actions_count": len(actions),
        "financial_loss": financial_loss,
        "risks": risks[:5],  # Show top 5
        "incidents": incidents[:5]  # Show top 5
    })

@app.get("/node-tree", response_class=HTMLResponse)
async def node_tree(request: Request, user: models.User = Depends(require_auth), db: Session = Depends(get_db)):
    # Get all nodes for tree visualization
    nodes = db.query(models.Node).all()
    
    # Build tree structure
    def build_tree(parent_id=None):
        children = [n for n in nodes if n.parent_id == parent_id]
        tree = []
        for child in children:
            tree.append({
                "id": child.id,
                "name": child.name,
                "level": child.level,
                "children": build_tree(child.id)
            })
        return tree
    
    tree = build_tree()
    
    return templates.TemplateResponse("node_tree.html", {
        "request": request,
        "user": user,
        "tree": tree
    })

@app.get("/insights/{node_id}")
async def get_insights_htmx(node_id: int, request: Request, user: models.User = Depends(require_auth), db: Session = Depends(get_db)):
    node = db.query(models.Node).filter(models.Node.id == node_id).first()
    if not node:
        return HTMLResponse("<div class='error'>Node not found</div>")
    
    # Get all descendant node IDs
    node_ids = get_descendant_node_ids(node)
    
    # Aggregate data for all relevant nodes
    risks = db.query(models.Risk).filter(models.Risk.node_id.in_(node_ids)).all()
    incidents = db.query(models.Incident).filter(models.Incident.node_id.in_(node_ids)).all()
    actions = db.query(models.ActionItem).join(models.Risk).filter(models.Risk.node_id.in_(node_ids)).all()
    
    # Generate AI insight
    prompt = f"Provide a concise AI insight for the following scope: {node.name}\n"
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
    
    try:
        ai_insight = ai.get_insight(prompt)
    except Exception:
        ai_insight = "AI insights temporarily unavailable."
    
    return templates.TemplateResponse("insights_partial.html", {
        "request": request,
        "node": node,
        "risks_count": len(risks),
        "incidents_count": len(incidents),
        "actions_count": len(actions),
        "ai_insight": ai_insight,
        "risks": risks[:3],
        "incidents": incidents[:3]
    })

@app.get("/risks", response_class=HTMLResponse)
async def risks_page(request: Request, user: models.User = Depends(require_auth), db: Session = Depends(get_db)):
    # Get user's accessible risks
    user_node = db.query(models.Node).filter(models.Node.id == user.node_id).first()
    if user_node:
        node_ids = get_descendant_node_ids(user_node)
        risks = db.query(models.Risk).filter(models.Risk.node_id.in_(node_ids)).all()
    else:
        risks = []
    
    return templates.TemplateResponse("risks.html", {
        "request": request,
        "user": user,
        "risks": risks
    })

@app.get("/incidents", response_class=HTMLResponse)
async def incidents_page(request: Request, user: models.User = Depends(require_auth), db: Session = Depends(get_db)):
    # Get user's accessible incidents
    user_node = db.query(models.Node).filter(models.Node.id == user.node_id).first()
    if user_node:
        node_ids = get_descendant_node_ids(user_node)
        incidents = db.query(models.Incident).filter(models.Incident.node_id.in_(node_ids)).all()
    else:
        incidents = []
    
    return templates.TemplateResponse("incidents.html", {
        "request": request,
        "user": user,
        "incidents": incidents
    })

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)