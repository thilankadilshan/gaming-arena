# 🎮 Gaming Arena — Full-Stack Web Platform & 3D Arcade

A modern, high-performance web gaming portal featuring a cyberpunk arcade aesthetic, real-time 3D browser games powered by **Three.js** and **React Three Fiber**, zero-asset procedural synthesized audio, guest & registered player leaderboards, and full multi-container **Docker orchestration** with **PostgreSQL 16**.

---

## 🌟 Features & Highlights

- **3D Snake: Evolution Engine**:
  - Isometric elevated $45^\circ$ third-person camera perspective.
  - 3D snake head with directional glowing emissive eyes tracking heading.
  - Trailing metallic/neon PBR body segments with dynamic color graduation.
  - 3D bobbing and rotating red apples with continuous sine-wave animation.
  - Periodic bonus golden star that spawns for 10 seconds, spins rapidly, and awards $3\times$ points ($300\text{ pts}$).
  - Dynamic difficulty curve: Snake speed ramps up every 5 apples consumed.
  - Memory-safe WebGL lifecycle handling: full geometry, material, and context disposal on unmount to eliminate memory leaks.
- **Zero-Dependency Procedural Audio Synthesizer**:
  - Pure Web Audio API synthesis without external `.mp3` or `.wav` audio files.
  - **Apple Pickup**: FM dual-oscillator bell chime ($587\text{ Hz} \to 880\text{ Hz}$ exponential decay).
  - **Star Bonus**: 4-note high-frequency arpeggio shimmer ($C6, E6, G6, C7$).
  - **Game Over**: Sub-bass frequency drop ($160\text{ Hz} \to 28\text{ Hz}$) with noise burst crunch.
- **Responsive Controls**:
  - Desktop: Keyboard navigation via `WASD` / Arrow keys, `Spacebar` for Pause / Resume.
  - Turn queue with $180^\circ$ instant self-collision lockout.
  - Mobile / Tablet: Touch swipe gestures with deadzone threshold.
  - On-screen retro virtual D-Pad with haptic feedback (`navigator.vibrate`).
- **Authentication & PostgreSQL Leaderboard**:
  - Frictionless guest play: play immediately with zero login requirements.
  - Post-game score persistence prompt allowing guests to save high scores.
  - Frictionless signup (username + password only, no email verification needed).
  - Secure password hashing with `bcryptjs` and stateless JWT session cookies via `jose`.
  - Anti-cheat validation verifying telemetry score consistency: $\text{score} = (\text{apples} \times 100) + (\text{stars} \times 300)$.
  - Real-time Top 10 global leaderboard powered by PostgreSQL descending B-Tree indexing.
- **Zero Host Installation**:
  - Everything builds and runs inside Docker containers. No Node.js, npm, or PostgreSQL dependencies need to be installed on your host machine.

---

## 🚀 Quick Start (Docker Compose)

The entire platform is containerized and boots with a single command.

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 2. Launch the Application
Open a terminal in the project directory (`C:\Users\thila\.gemini\antigravity\scratch\gaming_arena`) and run:

```bash
docker compose up --build
```

### 3. Open in Browser
Once the build completes and the containerized PostgreSQL database is ready, open:

- **Web Portal**: [http://localhost:3000](http://localhost:3000)
- **Snake 3D Direct Game**: [http://localhost:3000/games/snake-3d](http://localhost:3000/games/snake-3d)

### 4. Stop the Containers
Press `Ctrl + C` in your terminal, or run:
```bash
docker compose down
```
*(To wipe database volumes as well, run `docker compose down -v`)*

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14+ (App Router, Server & Client Components) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS + Cyberpunk Dark-Arcade Design System |
| **3D Engine** | Three.js via `@react-three/fiber` & `@react-three/drei` |
| **Audio** | Web Audio API (Synthesized procedural oscillators) |
| **Database** | PostgreSQL 16 (via Docker container) |
| **ORM** | Prisma 5 with automated schema migrations |
| **Security** | `bcryptjs` + `jose` (HTTP-only, SameSite=Lax JWT cookies) |
| **Icons** | Lucide React |
| **Containerization** | Multi-stage Dockerfile (`base` $\to$ `deps` $\to$ `builder` $\to$ `runner`) |

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register`: Create a new player account.
  ```json
  { "username": "CyberNinja", "password": "securepassword123" }
  ```
- `POST /api/auth/login`: Authenticate and issue secure session cookie.
  ```json
  { "username": "CyberNinja", "password": "securepassword123" }
  ```
- `GET /api/auth/me`: Check current user session.
- `POST /api/auth/logout`: Clear session cookie.

### Leaderboard & Scores
- `GET /api/scores?limit=10&game=snake_3d`: Retrieve top 10 global leaderboard entries.
- `POST /api/scores`: Save run score (Requires authenticated session).
  ```json
  {
    "score": 1200,
    "applesEaten": 9,
    "starsCollected": 1,
    "gameName": "snake_3d"
  }
  ```

---

## ☁️ Deploying to Vercel (100% Free Tier)

1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Connect a free-tier PostgreSQL database (such as **Supabase** or **Neon**):
   - Set Environment Variable `DATABASE_URL` in Vercel to your Postgres connection string.
   - Set Environment Variable `JWT_SECRET` to a random secret string.
4. Set build command: `npx prisma generate && next build`.
5. Deploy!
