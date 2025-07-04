# Risk Wrapped Frontend Documentation

A modern, visually engaging React (TypeScript) dashboard for Risk Wrapped, inspired by Spotify Wrapped. Features a blue-gradient theme, animated cards, interactive charts, and AI-powered insights.

## Stack
- React + TypeScript
- styled-components (theming, CSS-in-JS)
- recharts (charts)
- react-icons (icons)
- Axios (API)

## Features
- Responsive dashboard with animated cards and charts
- JWT authentication (token stored in localStorage)
- Modern blue-gradient theme (see `src/theme.css`)
- Pages: Login, Dashboard, User Profile, Risk Details
- Avatar menu with profile, support, and logout

## Setup
```bash
cd frontend
npm install
npm start
```

## Theming
- All colors and gradients are defined in `src/theme.css` using CSS variables.
- Use `.gradient-blue`, `.text-gradient`, etc. for consistent branding.

## Main Components
- `RiskCard` – Animated risk metric card
- `CostCenterChart` – Donut chart for cost centers
- `TrendChart` – Line chart for risk trends
- `AIInsightCard` – AI-powered insights with gradient
- `AvatarMenu` – User menu with profile, support, logout

## Development
- All API calls are in `src/api/index.ts` (uses Axios)
- Protected routes use JWT from localStorage
- To build for production: `npm run build`

## Contributing
- Use feature branches and PRs
- Follow the blue-gradient theme for new components
- Document major changes in `../CHANGELOG.md`

---
See the backend README for API details. 