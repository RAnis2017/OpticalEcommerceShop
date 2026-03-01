# Optical Ecommerce Shop

Planning-first repository for an optical ecommerce platform focused on frames, prescription lenses, home try-on, and cash-on-delivery operations.

## Current Status

Phase 1 is complete: product and implementation planning.

## Proposed Stack

- Next.js with TypeScript
- PostgreSQL with Prisma
- NextAuth or Clerk for admin authentication
- Stripe not required in phase 1 because payment mode is cash on delivery
- Cloudinary or S3-compatible storage for product media and prescription uploads

## Core Business Scope

- Glasses and sunglasses catalog
- Prescription lens configuration
- Cash on delivery checkout
- Secure admin panel for catalog, customers, invoices, orders, refunds, and sales tracking
- Home try-on or "window shopping" mode for 10 or more frames at Rs 500

## Planning Docs

- [docs/product-plan.md](docs/product-plan.md)

## Next Phase

Implementation should start with project scaffolding, database schema, admin authentication, and the storefront catalog plus home try-on booking flow.
