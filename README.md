# BreachPoint — Round 1 Frontend

A minimal, dark, terminal-styled React frontend for the BreachPoint CTF event.

## Stack
- React 18 + React Router 6
- Vite
- Plain CSS (design tokens in `src/index.css`), no UI framework

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. For a production build:

```bash
npm run build
npm run preview
```

## What's included
- **Login** — split screen, team name + password, sign in / sign up
- **Dashboard** — header + sidebar + body shell, base story, first-time "unlock a path" flow
- **Path unlock** — card-based path selection; unlocking a second/third path mid-event warns it's capped at 80% of that path's points
- **Path view** — 10 connected challenge nodes + a locked 11th "ECHO" node that opens once the other 10 are resolved; hover shows category/difficulty
- **Challenge page** — pre-challenge narration → challenge (description, resource link/download, flag submission, skip-for-80%) → post-challenge narration
- **Narration** — shared component, letter-by-letter typing, back/skip/next
- **Leaderboard** — top-3 podium + full standings table with your team's row
- **Map** — all three paths with lock state and progress
- **Time Glitch** — `/glitch/start` and `/glitch/stop` standalone screens that reset progress to the starting point

All data (paths, nodes, leaderboard) is mock data in `src/data/mockData.js` — swap in real API calls when the backend is ready. State is managed in `src/context/GameContext.jsx`.
