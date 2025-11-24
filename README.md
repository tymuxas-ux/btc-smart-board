# BTC Smart Board

Next.js dashboard that aggregates BTC metrics: price, open interest, funding, exchange netflow, on-chain activity, liquidation/funding heatmaps, and a computed macro risk score.

## Quick start

1. Clone or create project folder and paste files.
2. `cp .env.example .env.local` and add your API keys.
3. `npm install`
4. `npm run dev`
5. Open `http://localhost:3000`

## Deploy

Push to GitHub and deploy with Vercel. Add the same environment variables (see `.env.example`) in Vercel project settings.

## Notes

- Do not commit `.env.local`.
- Some providers are paid or rate-limited (Glassnode, CryptoQuant, Coinalyze).
- If a provider fails, endpoints return mock data so dashboard continues to work.
