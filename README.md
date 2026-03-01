# Optical Ecommerce Shop

Implementation repository for a single-brand optical ecommerce platform focused on frames, prescription lenses, home try-on, and cash-on-delivery operations.

## Current Status

Phase 1 planning is complete and the initial full-stack foundation is implemented.

## Business Model

This is a single-tenant ecommerce system for one optical business and one branded storefront. It is not a marketplace and does not need multi-store or multi-tenant architecture.

## Proposed Stack

- React with TypeScript and React Query
- Express with TypeScript
- Shared domain types for optical and commerce flows
- Cash on delivery flow in the storefront and API
- Cookie-based admin authentication scaffold

## Core Business Scope

- Glasses and sunglasses catalog
- Prescription lens configuration
- Cash on delivery checkout
- Secure admin panel for catalog, customers, invoices, orders, refunds, and sales tracking
- Home try-on or "window shopping" mode for 10 or more frames at Rs 500

## Implemented Foundation

- React storefront with home, catalog, product, cart, checkout, and try-at-home pages
- Express API with product, storefront, order, and try-at-home endpoints
- Admin login and dashboard shell backed by cookie-based auth
- Mock optical catalog, lens packages, seeded orders, and seeded try-at-home requests

## Local Run

1. Install dependencies:
   - `npm install`
   - `npm install --prefix apps/api`
   - `npm install --prefix apps/web`
2. Copy `.env.example` to `.env` and change the admin credentials.
3. Start both apps with `npm run dev`.
4. Frontend runs on `http://localhost:5173` and API runs on `http://localhost:4000`.

## Planning Docs

- [docs/product-plan.md](docs/product-plan.md)

## Next Phase

The next implementation phase should replace mock data with a database, add persistent admin operations, and expand order, invoice, refund, and customer management.
