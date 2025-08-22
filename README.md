# Risk Insights - FastAPI + HTMX

A modern, server-side rendered risk management application built with FastAPI and HTMX. Features organizational hierarchy navigation, AI-powered insights, and real-time risk analytics.

## Features

- **Server-Side Rendering**: Fast, SEO-friendly pages with minimal JavaScript
- **HTMX Integration**: Dynamic content updates without full page reloads
- **Organizational Hierarchy**: Navigate through complex org structures with ease
- **AI-Powered Insights**: Get intelligent risk analysis and recommendations
- **Real-Time Analytics**: Live dashboard with risk metrics and trends
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: HTMX + Tailwind CSS
- **Database**: PostgreSQL with SQLAlchemy ORM
- **AI**: Flexible provider support (OpenAI, Google AI, DeepSeek, Azure)
- **Authentication**: JWT with secure HTTP-only cookies

## Quick Start

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set Up Environment**
   ```bash
   cp .env.sample .env
   # Edit .env with your database and AI provider settings
   ```

3. **Seed Database**
   ```bash
   python seed.py
   ```

4. **Run Application**
   ```bash
   uvicorn main:app --reload
   ```

5. **Access Application**
   - Open http://localhost:8000
   - Login with any seeded user (password: P@ssw0rd)

## Project Structure

```
├── main.py                 # FastAPI application entry point
├── backend/               # Backend modules (models, database, AI)
├── templates/             # Jinja2 HTML templates
├── static/               # CSS, JavaScript, and assets
├── requirements.txt      # Python dependencies
└── seed.py              # Database seeding script
```

## Key Pages

- **Dashboard** (`/dashboard`): Overview of risks, incidents, and metrics
- **Organization Tree** (`/node-tree`): Interactive hierarchy with AI insights
- **Risks** (`/risks`): Comprehensive risk portfolio view
- **Incidents** (`/incidents`): Incident management and tracking

## Authentication

The application uses JWT tokens stored in secure HTTP-only cookies. Users are automatically redirected to login if not authenticated.

Default seeded users have username patterns like `alice1`, `bob2`, etc. with password `P@ssw0rd`.

## AI Integration

Configure your AI provider in `.env`:

```bash
AI_PROVIDER=openai  # or google, deepseek, azure, hf_transformers
OPENAI_API_KEY=your-key-here
```

## Development

- **Hot Reload**: Use `uvicorn main:app --reload` for development
- **Database Changes**: Modify `backend/app/models.py` and restart
- **Templates**: Edit files in `templates/` - changes are reflected immediately
- **Styles**: Modify `static/css/style.css` for custom styling

## Deployment

The application is ready for production deployment with:
- Gunicorn or Uvicorn workers
- Reverse proxy (Nginx)
- PostgreSQL database
- Environment-based configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ using FastAPI and HTMX for a modern, efficient web experience.