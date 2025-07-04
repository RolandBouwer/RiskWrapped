# API Routes Documentation

## Health
- `GET /health` — Public health check for DB and AI connectivity

## Authentication
- `POST /token` — Obtain JWT access token (use username and password)

## Users (Protected)
- `POST /users/` — Create a new user
- `GET /users/{user_id}` — Get user by ID
- `GET /users/` — List all users

## Nodes (Protected)
- `POST /nodes/` — Create a new node
- `GET /nodes/{node_id}` — Get node by ID
- `GET /nodes/` — List all nodes

## Risks (Protected)
- `POST /risks/` — Create a new risk
- `GET /risks/{risk_id}` — Get risk by ID
- `GET /risks/` — List all risks

## Insights (Protected)
- `POST /insights/generate` — Generate an AI-powered insight from text

---

### Example: Health Check
```http
GET /health
```
Response:
```json
{
  "db": true,
  "ai": true
}
```

### Example: Authentication
```http
POST /token
Content-Type: application/x-www-form-urlencoded
username=admin&password=P@ssw0rd
```
Response:
```json
{
  "access_token": "...",
  "token_type": "bearer"
}
```

Use the returned token as a Bearer token in the Authorization header for all protected endpoints.

### Example: Get Users (Protected)
```http
GET /users/
Authorization: Bearer <access_token>
```

### Example: Create User
```http
POST /users/
Content-Type: application/json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "secret",
  "node_id": 1,
  "level": 1
}
```

### Example: Generate Insight
```http
POST /insights/generate
Content-Type: application/json
{
  "text": "Summarize risk data for node 1"
}
``` 