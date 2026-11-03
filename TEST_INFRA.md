# Gaming Arena — Test Infrastructure Specification (TEST_INFRA.md)

**Document Version:** 1.0.0  
**Authors:** `test_writer_e2e_1` (Specialist QA & E2E Track Lead)  
**Workspace:** `C:\Users\thila\.gemini\antigravity\scratch\gaming_arena`  
**Target Environment:** Zero-host-dependency Node.js native test harness running against `http://localhost:3000` (or standalone mock harness).

---

## 1. Overview & Testing Philosophy

The Gaming Arena test suite is an **opaque-box, requirement-driven End-to-End (E2E) testing framework** designed to validate the entire platform against `ORIGINAL_REQUEST.md`, `PROJECT.md`, and `spec_miner_survey_1/spec_report.md`.

In strict adherence to the **Zero-Host Installation** constraint, the test framework relies exclusively on built-in Node.js runtime capabilities (`node:test`, `node:assert/strict`, `node:http`, `node:fs`, `node:path`, and native global `fetch`). No third-party packages or `node_modules` are required on the host machine.

The suite can run in two modes:
1. **Live Container Mode:** Executes HTTP requests and browser-level contracts against the live application container stack at `http://localhost:3000`.
2. **Autonomous Mock / Dry-Run Mode (`--mock`):** Spins up an internal ephemeral HTTP server simulating all API contracts, allowing independent test validation before or during container compilation.

---

## 2. 4-Tier Test Methodology

The test suite is structured into four distinct hierarchical tiers, guaranteeing comprehensive coverage from discrete functional components up to full multi-user production journeys.

```
+------------------------------------------------------------------------+
|                      Tier 4: Real-World Scenarios                      |
|       (Complete user journeys, mobile playthrough, adversarial attack)  |
+------------------------------------------------------------------------+
                                    |
+------------------------------------------------------------------------+
|                   Tier 3: Cross-Feature Combinations                   |
|   (Guest-to-registered migration, multiplayer leaderboard contention)   |
+------------------------------------------------------------------------+
                                    |
+------------------------------------------------------------------------+
|                  Tier 2: Boundary & Corner Cases                       |
|   (180-deg reversal buffer, wall limits, SQLi/tampering, anti-cheat)   |
+------------------------------------------------------------------------+
                                    |
+------------------------------------------------------------------------+
|                     Tier 1: Feature Coverage                           |
| (Portal UI, 3D Canvas, Controls, Audio, Auth, Leaderboard, Docker Infra)|
+------------------------------------------------------------------------+
```

### Tier 1: Feature Coverage (Minimum 5 tests per feature)
Verifies core happy-path behaviors and contract adherence for all 7 platform domains:
1. **Portal UI (`tests/e2e/tier1-features/portal-ui.test.mjs`):**
   - Home page (`/`) returns HTTP 200 with cyberpunk theme metadata.
   - Dynamic neon hero section contains "Welcome to Gaming Arena" and CTA.
   - Featured Showcase Card for "Snake 3D: Evolution" includes "Hot" badge and play link.
   - Upcoming game teasers rendered ("Space Invaders 3D", "Retro Pong", "Cyber Brick Breaker").
   - Navigation bar provides auth triggers and responsive layout.
2. **3D Canvas & Engine (`tests/e2e/tier1-features/canvas-3d.test.mjs`):**
   - Snake game route (`/games/snake-3d`) renders canvas shell with dynamic SSR disabled.
   - Isometric camera configuration ($[16, 20, 16]$, low-FOV).
   - $20 \times 20$ grid bounds math and coordinate clamping ($X, Z \in [-10, 10]$).
   - Apple collectible bobbing & star rotation animation parameters.
   - WebGL resource disposal contracts preventing GPU context leaks.
3. **Controls & Responsiveness (`tests/e2e/tier1-features/controls.test.mjs`):**
   - Keyboard WASD and Arrow key mappings to directional unit vectors.
   - Spacebar toggle for pause/resume game state.
   - Mobile touch swipe gesture threshold detection ($>30\text{px}$).
   - Retro virtual D-Pad on-screen overlay presence and button mappings.
   - Adaptive device pixel ratio clamping (`dpr={[1, 2]}`).
4. **Procedural Web Audio (`tests/e2e/tier1-features/audio.test.mjs`):**
   - Zero-dependency synthesizer initialization via Web Audio API.
   - Apple pickup chime ($587\text{Hz} \to 880\text{Hz}$ FM bell sweep).
   - Star bonus sparkle (3-note/4-note triad arpeggio).
   - Game over thud ($160\text{Hz} \to 42\text{Hz}$ low-pass filtered pitch-drop).
   - Audio mute master toggle state persistence.
5. **Authentication System (`tests/e2e/tier1-features/auth.test.mjs`):**
   - User registration (`POST /api/auth/register`) with bcrypt hashing.
   - User login (`POST /api/auth/login`) issuing HTTP-only JWT cookie.
   - Session validation (`GET /api/auth/me`) returning user profile.
   - User logout (`POST /api/auth/logout`) clearing session cookie.
   - Guest identity preservation prior to login.
6. **Leaderboard System (`tests/e2e/tier1-features/leaderboard.test.mjs`):**
   - Leaderboard retrieval (`GET /api/scores`) returning descending rank array.
   - Score submission (`POST /api/scores`) with user association.
   - Anti-cheat validation formula `score === (apples * 100) + (stars * 300)`.
   - Top 10 result limit enforcement.
   - Personal best score calculation and rank tracking.
7. **Docker & Infrastructure (`tests/e2e/tier1-features/docker-compose.test.mjs`):**
   - Multi-stage Dockerfile definition (deps, builder, runner).
   - Standalone Next.js output configuration (`output: 'standalone'`).
   - `docker-compose.yml` service declarations (`web`, `db`).
   - PostgreSQL healthcheck definition (`pg_isready`) and `service_healthy` dependency.
   - Container startup entrypoint script executing `prisma db push`.

### Tier 2: Boundary & Corner Cases (Minimum 5 tests per category)
Tests resilience against extreme inputs, mathematical edges, and hostile conditions:
1. **Limits & Extreme Magnitudes (`tests/e2e/tier2-boundaries/limits.test.mjs`):**
   - Maximum username length boundary (e.g. 20 chars allowed, 21 rejected).
   - Score submission ceiling and 32-bit integer overflow checks.
   - Leaderboard pagination/limit parameter bounding ($1 \le \text{limit} \le 50$).
   - Snake coordinate maximum bounds boundary ($X = \pm 10.0$ vs $X = \pm 10.01$).
   - Extreme snake length simulation (filling $>90\%$ of arena cells).
2. **Empty Strings & Missing Payloads (`tests/e2e/tier2-boundaries/empty-inputs.test.mjs`):**
   - Registration with empty username string.
   - Registration with missing password.
   - Score submission with empty JSON object `{}`.
   - Malformed JSON body in HTTP requests.
   - Whitespace-only username rejection.
3. **Rapid Collisions & Coordinate Mechanics (`tests/e2e/tier2-boundaries/rapid-collisions.test.mjs`):**
   - Instant wall collision on tick 1 when heading out of bounds.
   - Self-collision when head enters body segment index $> 0$.
   - Corner boundary collision at $(10, 10)$ and $(-10, -10)$.
   - Tail vacancy rule: advancing head into cell vacated by tail on same tick does NOT collide.
   - Out-of-bounds coordinate spawning prevention for apples and stars.
4. **Invalid Auth & Security Tampering (`tests/e2e/tier2-boundaries/invalid-auth.test.mjs`):**
   - Login with non-existent username returns 401.
   - Login with incorrect password returns 401.
   - Tampered JWT signature rejection.
   - Expired JWT token handling.
   - SQL injection payloads in username/password sanitized.
5. **Anti-Cheat & Calculation Tampering (`tests/e2e/tier2-boundaries/anti-cheat-scores.test.mjs`):**
   - Forged score mismatching apple/star calculation rejected with 400.
   - Negative score value rejected.
   - Negative apples or stars count rejected.
   - Floating point score values rejected.
   - Unauthenticated score submission rejected with 401.
6. **180-Degree Reversal Buffer (`tests/e2e/tier2-boundaries/reversal-buffer.test.mjs`):**
   - Immediate 180° reverse direction input ignored (e.g. Right followed by Left).
   - Rapid double-keystroke within single tick buffered correctly (Right -> Down -> Left).
   - Opposing axis inputs while paused ignored.
   - Rapid key mash during game over state prevented from corrupting score modal.
   - Unrecognized key inputs ignored without crashing input loop.

### Tier 3: Cross-Feature Combinations (Pairwise Interactions)
Validates interactions across decoupled sub-systems:
1. **Guest-to-Registered Flow (`tests/e2e/tier3-combinations/guest-to-registered-flow.test.mjs`):**
   - Unauthenticated guest plays game -> hits wall -> post-game modal appears with score -> guest registers inline -> score auto-submitted to `/api/scores` -> leaderboard reflects new player.
2. **Multiplayer Leaderboard Race (`tests/e2e/tier3-combinations/multiplayer-leaderboard-race.test.mjs`):**
   - Multiple concurrent users submit increasing scores -> leaderboard rank dynamically re-orders -> personal best records updated.
3. **Session Persistence & Lifecycle Isolation (`tests/e2e/tier3-combinations/auth-lifecycle-isolation.test.mjs`):**
   - User registers -> verifies `/api/auth/me` -> logs out -> verifies `/api/auth/me` is null -> ensures unauthenticated score posting is blocked.
4. **Difficulty Curve & Scoring Rate (`tests/e2e/tier3-combinations/difficulty-and-scoring-progression.test.mjs`):**
   - Verifies difficulty acceleration ($180\text{ms} \to 65\text{ms}$ floor) coupled with 3x star multiplier score calculation.
5. **Input and Procedural Audio Synchronization (`tests/e2e/tier3-combinations/input-audio-event-sync.test.mjs`):**
   - Verifies audio trigger event queue synchronization when collision and collectible events fire in rapid succession.

### Tier 4: Real-World Scenarios (End-to-End User Journeys)
1. **Guest First-Time Journey (`tests/e2e/tier4-scenarios/scenario-guest-journey.test.mjs`):**
   - Visitor arrives at landing page -> views teasers -> clicks "Play Snake 3D" -> plays run -> achieves high score -> persists score by creating account -> verifies presence on global Hall of Fame.
2. **Veteran High-Score Run (`tests/e2e/tier4-scenarios/scenario-veteran-player.test.mjs`):**
   - Existing user logs in -> launches Snake 3D -> plays game collecting 15 apples and 3 bonus stars -> submits 2400 pts -> verifies personal best updated and leaderboard rank updated.
3. **Adversarial Security Stress (`tests/e2e/tier4-scenarios/scenario-adversarial-tamper.test.mjs`):**
   - Attacker attempts SQL injection, forged cookies, synthetic 999999 scores, and route tampering -> all blocked with appropriate 400/401 status codes -> system remains operational.
4. **Mobile Player Experience (`tests/e2e/tier4-scenarios/scenario-mobile-virtual-dpad.test.mjs`):**
   - Simulates mobile viewport with touch swipe gestures, virtual D-pad clicks, and responsive DPR scaling.
5. **Docker Infrastructure Stack Verification (`tests/e2e/tier4-scenarios/scenario-docker-stack-integrity.test.mjs`):**
   - Validates container image specifications, entrypoint migration logic, database connection string parsing, and healthcheck contracts.

---

## 3. Directory Layout

```
tests/
└── e2e/
    ├── config.mjs                                  # Environment config & constants
    ├── runner.mjs                                  # Autonomous test runner script
    ├── helpers/
    │   ├── httpClient.mjs                          # HTTP client with cookie jar & retries
    │   ├── mockServer.mjs                          # Built-in contract mock server for dry-run
    │   └── gameSimulator.mjs                       # Discrete game grid & collision simulator
    ├── tier1-features/
    │   ├── portal-ui.test.mjs
    │   ├── canvas-3d.test.mjs
    │   ├── controls.test.mjs
    │   ├── audio.test.mjs
    │   ├── auth.test.mjs
    │   ├── leaderboard.test.mjs
    │   └── docker-compose.test.mjs
    ├── tier2-boundaries/
    │   ├── limits.test.mjs
    │   ├── empty-inputs.test.mjs
    │   ├── rapid-collisions.test.mjs
    │   ├── invalid-auth.test.mjs
    │   ├── anti-cheat-scores.test.mjs
    │   └── reversal-buffer.test.mjs
    ├── tier3-combinations/
    │   ├── guest-to-registered-flow.test.mjs
    │   ├── multiplayer-leaderboard-race.test.mjs
    │   ├── auth-lifecycle-isolation.test.mjs
    │   ├── difficulty-and-scoring-progression.test.mjs
    │   └── input-audio-event-sync.test.mjs
    ├── tier4-scenarios/
    │   ├── scenario-guest-journey.test.mjs
    │   ├── scenario-veteran-player.test.mjs
    │   ├── scenario-adversarial-tamper.test.mjs
    │   ├── scenario-mobile-virtual-dpad.test.mjs
    │   └── scenario-docker-stack-integrity.test.mjs
    └── reports/
        └── test-results.json                       # Structured test run output
```

---

## 4. Execution Commands

### Running the Entire E2E Test Suite (All Tiers)
Against running container stack:
```bash
node tests/e2e/runner.mjs
```
Custom target URL:
```bash
APP_URL=http://localhost:3000 node tests/e2e/runner.mjs
```

### Running with Ephemeral Mock Server (Offline / Validation Mode)
If the container stack is not yet running, execute with the `--mock` flag to boot the internal RFC-compliant mock server:
```bash
node tests/e2e/runner.mjs --mock
```

### Running Individual Tiers
```bash
node tests/e2e/runner.mjs --tier=1    # Run Tier 1: Feature Coverage only
node tests/e2e/runner.mjs --tier=2    # Run Tier 2: Boundary & Corner Cases only
node tests/e2e/runner.mjs --tier=3    # Run Tier 3: Cross-Feature Combinations only
node tests/e2e/runner.mjs --tier=4    # Run Tier 4: Real-World Scenarios only
```

---

## 5. Structured Output & Reporting

The test runner outputs standard color-coded terminal results with summary metrics, and generates a persistent JSON report at `tests/e2e/reports/test-results.json`:

```json
{
  "timestamp": "2026-11-03T14:30:00.000Z",
  "appUrl": "http://localhost:3000",
  "mode": "live",
  "totalTests": 85,
  "passed": 85,
  "failed": 0,
  "skipped": 0,
  "durationMs": 4120,
  "tiers": {
    "tier1": { "total": 35, "passed": 35, "failed": 0 },
    "tier2": { "total": 30, "passed": 30, "failed": 0 },
    "tier3": { "total": 10, "passed": 10, "failed": 0 },
    "tier4": { "total": 10, "passed": 10, "failed": 0 }
  }
}
```

---

## 6. Traceability Matrix

| Requirement | Description | Test Modules | Tiers Covered |
|---|---|---|---|
| R1 | Cyberpunk Portal & UI | `portal-ui.test.mjs`, `scenario-guest-journey.test.mjs` | Tier 1, Tier 4 |
| R2 | 3D Snake Game Engine & Web Audio | `canvas-3d.test.mjs`, `audio.test.mjs`, `rapid-collisions.test.mjs`, `reversal-buffer.test.mjs`, `difficulty-and-scoring-progression.test.mjs` | Tier 1, Tier 2, Tier 3 |
| R3 | Controls & Mobile Responsiveness | `controls.test.mjs`, `reversal-buffer.test.mjs`, `scenario-mobile-virtual-dpad.test.mjs` | Tier 1, Tier 2, Tier 4 |
| R4 | Auth, Leaderboard & Anti-Cheat | `auth.test.mjs`, `leaderboard.test.mjs`, `invalid-auth.test.mjs`, `anti-cheat-scores.test.mjs`, `guest-to-registered-flow.test.mjs`, `scenario-veteran-player.test.mjs` | Tier 1, Tier 2, Tier 3, Tier 4 |
| R5 | Docker Compose & Zero-Host | `docker-compose.test.mjs`, `scenario-docker-stack-integrity.test.mjs` | Tier 1, Tier 4 |
