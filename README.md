# Untraced

Untraced is a communal web game for discovering all **140,704** valid Android-style nine-dot patterns that use every node exactly once. Players draw without seeing which routes remain; the server reveals whether a completed trace is a global first or a repeat.

## Rules and correctness

Nodes are numbered left-to-right, top-to-bottom. A move crossing the midpoint of a row, column, or long diagonal is legal only after that midpoint has been visited. The drawing surface reproduces Android behavior by automatically acquiring an unused midpoint when the pointer crosses it. Direction, rotation, and reflection remain distinct.

`src/lib/patterns.ts` contains the pure authoritative validator, pointer-segment intersection helper, and an independent exhaustive enumerator. The unit suite asserts exactly 140,704 unique nine-node routes.

## Stack

- Next.js App Router, React, and TypeScript
- PostgreSQL in production through `postgres`; ordinary Vercel-compatible Postgres works (Neon is a good default)
- Drizzle schema and checked-in SQL migration
- SQLite development adapter in `.data/untraced.sqlite`, requiring no credentials
- Zod-compatible strict request shape plus server-side route validation
- Vitest and Playwright

PostgreSQL submissions run inside a transaction while locking the single hunt-state row. This serializes ordinal allocation, ensures simultaneous copies of the same undiscovered route produce one first discovery, inserts milestone rows idempotently, and freezes completion exactly once. The public APIs expose recent/popular *discovered* geometry only—never missing routes or the full discovered set.

## Local setup

1. Copy `.env.example` to `.env.local`. The defaults use local SQLite.
2. Run `npm install`.
3. Run `npm run dev` and open `http://localhost:3000`.

Local development creates `.data/untraced.sqlite` automatically. Load deliberate states with:

```sh
npm run db:seed -- empty
npm run db:seed -- early
npm run db:seed -- normal
npm run db:seed -- late
npm run db:seed -- one-remaining
npm run db:seed -- completed
```

The seed script refuses production use unless `ALLOW_PRODUCTION_SEED=true`; PostgreSQL fixture resets are intentionally omitted to keep the shared record safe.

## Production database and Vercel

Create a PostgreSQL database, set `DATABASE_URL`, `UNTRACED_DATABASE=postgres`, a strong `RATE_LIMIT_SECRET`, and the canonical `NEXT_PUBLIC_SITE_URL`. Apply the schema before the first deployment:

```sh
npm run db:migrate
```

Deploy the resulting Next.js project to Vercel normally. The database must support transactions, row locks, UUID generation (`gen_random_uuid()`), and standard PostgreSQL `ON CONFLICT`. All timestamps are stored in UTC and formatted in the browser.

The in-process production rate limiter allows a modest human burst and is isolated in `src/server/rate-limit.ts`. For multi-instance deployments, replace its map with Vercel KV/Upstash or another short-lived shared store without changing submission logic. Development deliberately bypasses throttling.

## Verification

```sh
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

Playwright browser binaries may be installed with `npx playwright install chromium`. Tests cover enumeration, every midpoint relationship in both directions, malformed routes, fast-pointer midpoint acquisition, transformations remaining distinct, percentage formatting, repeat/concurrent submission invariants, milestone/completion idempotence, the home interaction, incomplete traces, mobile rendering, and secondary routes.

## Privacy and moderation

The browser creates a random UUID and keeps personal history, nickname, and mute preference locally. Accepted submissions associate that UUID with server aggregates. It is a browser/device convenience identifier, not authentication or a count of humans. No fingerprinting, location, email, advertising ID, or durable raw IP storage is used. Optional nicknames are restricted to 24 conservative characters and rendered as text. To hide an inappropriate attribution for MVP, set `first_discoverer_name` to `NULL` directly in `patterns`; the historical route remains intact.

No commits, pushes, repository creation, or deployments were performed by Codex.
