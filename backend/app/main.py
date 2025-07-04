from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from .database import engine, Base, get_db
from .routes import users, nodes, risks, insights
from .routes import insights as insights_router
from .routes import users as users_router
from .routes import nodes as nodes_router
from .routes import risks as risks_router
from .routes import incidents
from . import crud, models, schemas, ai
import os
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(users.router)
app.include_router(nodes.router)
app.include_router(risks.router)
app.include_router(insights.router)
app.include_router(incidents.router)

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

# Dependency for protected endpoints
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

app.include_router(users.router, dependencies=[Depends(get_current_user)])
app.include_router(nodes.router, dependencies=[Depends(get_current_user)])
app.include_router(risks.router, dependencies=[Depends(get_current_user)])
app.include_router(insights.router, dependencies=[Depends(get_current_user)])


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


@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/health")
def health_check():
    # Check DB
    try:
        db = next(get_db())
        db.execute("SELECT 1")
        db_ok = True
    except Exception:
        db_ok = False
    # Check AI
    try:
        ai_ok = ai.get_insight("health check") is not None
    except Exception:
        ai_ok = False
    return {"db": db_ok, "ai": ai_ok}


@app.get("/")
def read_root():
    return {"message": "RiskWrapped API is running"}


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
