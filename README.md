# Spend Tracker – Frontend

React + TypeScript + Vite frontend for the Spend Tracker app. Uses Firebase Auth and talks to the **spend-tracker-backend** API.

## Setup

1. **Clone and install**
   ```bash
   git clone <your-frontend-repo-url> spend-tracker-frontend
   cd spend-tracker-frontend
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env`.
   - Fill in Firebase Web app config (from Firebase Console → Project settings → Your apps).
   - In development, the Vite proxy forwards `/api` to `http://localhost:3001`. In production, set `VITE_API_URL` to your backend URL (e.g. `https://your-api.railway.app`).

## Run

- **Development:** `npm run dev` (Vite on port 5173; API proxy to backend on 3001).
- **Build:** `npm run build`
- **Preview build:** `npm run preview`

## Backend

The backend lives in a separate repo (**spend-tracker-backend**). Run it on port 3001 so the dev proxy works, or set `VITE_API_URL` for production.

## License

ISC
