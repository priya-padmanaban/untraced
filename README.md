# Untraced

**140,704 routes. One shared record. Draw one we haven’t seen.**

Untraced is a communal nine-dot pattern hunt. Draw through every dot once and the site tells you whether you found a new route or repeated somebody else’s.

Direction, rotation, and reflection all count separately. Crossing an unused middle dot selects it automatically, just like an Android lock screen.

## Run it locally

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. Local development uses SQLite at `.data/untraced.sqlite`, so no database setup is needed.

Want some fake progress?

```sh
npm run db:seed -- empty
npm run db:seed -- early
npm run db:seed -- normal
npm run db:seed -- late
npm run db:seed -- one-remaining
npm run db:seed -- completed
```

Fixtures are local-only. The seed script refuses to touch PostgreSQL.

## Stack

- Next.js, React, and TypeScript
- PostgreSQL in production; SQLite locally
- Drizzle migrations
- Vitest and Playwright

The pattern rules live in `src/lib/patterns.ts`. Tests independently enumerate all 140,704 valid routes. Production submissions are transactional, so concurrent discoveries still get one first finder and one ordinal.

## Production

Copy `.env.example` to `.env.local` and set:

- `DATABASE_URL`
- `UNTRACED_DATABASE=postgres`
- `RATE_LIMIT_SECRET`
- `NEXT_PUBLIC_SITE_URL`

Then apply the schema:

```sh
npm run db:migrate
```

The app is set up for a normal Vercel deployment with a PostgreSQL database.

## Check your work

```sh
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

If Playwright needs a browser, run `npx playwright install chromium`.

## Privacy

No accounts. Each browser gets a random player ID and keeps its nickname, settings, and recent history locally. Submissions are associated with that anonymous ID so Mine can restore the browser’s history and pattern numbers. There’s no fingerprinting, email, location tracking, or durable raw IP storage.
