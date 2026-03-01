# Optical Ecommerce Platform Plan

## 1. Product Goal

Build a modern ecommerce website for an optical business that sells frames, sunglasses, lenses, and prescription eyewear. The platform should support standard ecommerce operations and include a home try-on model where a customer can select 10 or more glasses, pay Rs 500, try them at home, choose preferred frames, and then place a prescription order for final delivery.

## 1A. Business Model Constraint

This platform is for one optical business only.

- Single branded storefront
- Single admin organization
- Single catalog ownership model
- No vendor marketplace behavior
- No multi-tenant architecture
- No per-tenant data isolation layer

Implementation should optimize for a straightforward single-business setup rather than introducing tenant abstractions.

## 2. Recommended Build Direction

Use a full-stack TypeScript application with:

- Next.js for storefront and admin interface
- PostgreSQL for relational data
- Prisma for schema and migrations
- Server-side authentication for admin access
- Object storage for frame images, invoices, and prescription files

This gives good control over custom optical flows that are awkward in template-based ecommerce systems.

Because the platform is single-tenant, the data model and admin architecture should stay simple and should not include `Tenant`, `Store`, `Organization`, or similar multi-tenant wrapper models unless a future requirement explicitly adds them.

## 3. User Roles

### Customer

- Browse catalog in normal purchase mode
- Browse catalog in home try-on mode
- Configure lenses and prescription details
- Place cash-on-delivery orders
- Track order and try-on request status
- Manage address, phone, and saved prescriptions

### Admin

- Secure login
- Manage products, collections, pricing, inventory, and featured items
- Manage lens packages and prescription constraints
- Review customers, orders, invoices, refunds, and COD status
- Manage home try-on requests, deposits, dispatch, return, and conversion to final order
- View dashboards for sales, refunds, popular frames, and try-on conversion

### Staff

- Optional later phase role
- Can process orders, assign try-on logistics, and update statuses without full admin rights

## 4. Core Customer Features

### Storefront

- Responsive catalog for frames, sunglasses, lenses, and accessories
- Search, filtering, and sorting by type, gender, shape, material, size, brand, price, color, and face shape
- Product detail pages with multiple images, measurements, material details, fit notes, stock, and lens compatibility
- Wishlist, cart, and account area

### Optical-Specific Purchase Flow

- Frame-only purchase
- Frame plus prescription lens purchase
- Lens-only packages if needed later
- Prescription input options:
  - Manual entry
  - Upload prescription image or PDF
  - Enter later after order
- Lens package choices:
  - Single vision
  - Blue light
  - Anti-glare
  - Progressive
  - Sunglass tint or photochromic where supported
- PD, SPH, CYL, Axis, ADD, prism fields if the business supports them

### Checkout

- Cash on delivery only in initial release
- Address capture, delivery notes, and phone verification
- COD confirmation step to reduce fake orders
- Order summary split by frame, lens, and service charges

## 5. Home Try-On / Window Shopping Mode

### Business Rule

- Customer must select at least 10 frames
- Customer pays Rs 500 for the home try-on service
- Frames are sent to the customer address
- Customer tests them at home
- Customer selects preferred frame(s)
- Final prescription order is created after selection

### Recommended Operational Model

Phase 1 should treat Rs 500 as a service fee recorded as cash to collect on delivery. If the business later wants online payment or refundable deposits, that can be added in a later phase.

### Customer Flow

1. Customer toggles into home try-on mode.
2. Customer adds eligible frames to a separate try-on basket.
3. System enforces minimum quantity of 10 before checkout.
4. Customer submits address, phone, preferred visit or delivery slot, and notes.
5. Admin confirms inventory and dispatch.
6. Customer receives frames and selects preferred items.
7. Admin or customer converts chosen frames into a final order.
8. Remaining frames are marked returned.

### Admin Requirements

- Track try-on request lifecycle: requested, confirmed, packed, dispatched, delivered, selection pending, converted, returned, closed, cancelled
- Record which frames were sent, returned, damaged, or converted
- Track Rs 500 COD collection and any exceptions
- See conversion metrics from try-on to final sale

## 6. Admin Panel Scope

### Catalog Management

- Create and edit products
- Manage categories, brands, collections, tags, and lens compatibility
- Upload images
- Track frame inventory and try-on availability separately

### Order Management

- View order details, status, invoice, and COD status
- Update order states: pending, confirmed, lens processing, packed, shipped, delivered, returned, refunded, cancelled
- Manage refunds and replacements
- Generate invoice and printable packing slip

### Customer Management

- Customer profiles
- Order history
- Prescription files
- Address book
- Notes and internal flags

### Analytics

- Daily, weekly, monthly sales
- COD delivery rate
- Refund totals
- Best-selling frames
- Home try-on conversion rate
- Revenue split by frame and lens category

## 7. Suggested Data Model

### Main Entities

- User
- AdminUser
- Address
- Product
- ProductVariant
- ProductImage
- LensPackage
- Prescription
- Cart
- Order
- OrderItem
- Invoice
- Refund
- Shipment
- TryOnRequest
- TryOnItem
- CustomerNote
- AuditLog

### Key Domain Rules

- Product must support frame-only, lens-compatible, or accessory behavior
- Inventory should distinguish saleable stock from try-on stock
- Prescription can belong to a user and attach to one or more orders
- TryOnRequest should be convertible into a standard order
- All operational data belongs to the same business context, so tenant foreign keys are not required

## 8. Security Requirements

- Admin routes protected by server-side authentication
- Role-based access for admin and staff
- Password hashing or managed auth provider
- Audit logging for order changes, refunds, and catalog changes
- Secure file upload handling for prescriptions
- CSRF and rate-limit protections on login and admin actions
- PII-aware logging and secure environment variable handling

## 9. Recommended Release Phases

### Phase 1: Foundation

- App scaffold
- Database schema
- Auth
- Basic storefront shell
- Admin shell
- Catalog models

### Phase 2: Storefront Commerce

- Product listing and detail pages
- Cart and COD checkout
- Prescription capture
- Customer account basics

### Phase 3: Home Try-On

- Try-on basket
- Minimum 10-frame enforcement
- Rs 500 service fee handling
- Admin try-on operations
- Conversion to final order

### Phase 4: Operations and Reporting

- Invoice generation
- Refund handling
- Dashboards
- Search and filtering improvements
- Notifications and status updates

## 10. Technical Decisions For Implementation Phase

### Frontend

- Marketing-focused homepage with strong optical brand identity
- Separate journeys for shop now and try at home
- Mobile-first flows for product browsing and COD checkout

### Backend

- Server actions or API routes for checkout and admin workflows
- Structured status enums for order and try-on lifecycles
- Soft-delete or archive for operational records

### Infrastructure

- Vercel or similar for app hosting
- Managed PostgreSQL
- Object storage for media and documents
- Email or WhatsApp notifications can be deferred if needed

## 11. Risks To Address Early

- Prescription data validation complexity
- Separate inventory pools for sales and try-on
- Fraud and failed COD deliveries
- Operational handling of 10-frame try-on logistics
- Clear policy for damaged or missing trial frames

## 12. Definition Of Done For First Build

The first usable release should allow an admin to create products, manage orders, manage try-on requests, and track invoices and refunds, while customers can browse products, submit prescriptions, place COD orders, and request a home try-on with 10 or more frames and a Rs 500 service fee.
