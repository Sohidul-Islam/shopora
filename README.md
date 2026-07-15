# Shopora — Enterprise Full-Stack E-commerce System Architecture

Shopora is a modern, premium, production-ready full-stack e-commerce platform designed using a clean, scalable, enterprise-grade architecture. It encapsulates customer-facing storefront screens, a minimal inventory-focused admin panel, fully normalized MySQL schemas, and containerized Docker environments.

---

## Technical Architecture

```
                                    +-----------------------+
                                    |    Customer Website   |
                                    |    & Admin UI         |
                                    +-----------+-----------+
                                                | HTTP
                                                v
                                    +-----------------------+
                                    | Next.js API Routes /  |
                                    | Server Actions        |
                                    +-----------+-----------+
                                                |
                                                v
                                    +-----------------------+
                                    |     Service Layer     | (Business Rules, Math)
                                    +-----------+-----------+
                                                |
                                                v
                                    +-----------------------+
                                    |   Repository Layer    | (Data Access)
                                    +-----------+-----------+
                                                | Drizzle ORM
                                                v
                                    +-----------------------+
                                    |       MySQL 8.0       | (E-commerce Schema)
                                    +-----------------------+
```

---

## Feature Scope

- **Customer Storefront:** Landing hero slide, category and brand filters, products list (grid/list sorting), product details, persistent cart, checkout.
- **Admin Dashboard:** Real-time revenue trackers, low stock alerts list, order processing timeline, coupon creation form, stock levels adjuster.
- **Polymorphic Payment Adapters:** Extendable adapter pattern supporting Cash on Delivery (COD), Stripe, PayPal, and SSLCommerz.
- **Normalized Schema:** 35+ tables covering users, roles, sessions, product variants, categories hierarchy, warehouses, inventory logs, transactions.

---

## Folder Structure

```
shopora/
├── drizzle/                  # Auto-generated SQL migration files
├── scripts/                  # Seed script (seed.js)
├── src/
│   ├── app/                  # Next.js pages, layouts, and route API endpoints
│   ├── core/
│   │   ├── adapters/         # Gateways payment adapters
│   │   ├── repositories/     # UserRepository, ProductRepository, OrderRepository
│   │   └── services/         # UserService, ProductService, OrderService
│   ├── db/                   # Drizzle client index and full schema.ts
│   ├── store/                # Zustand client stores
│   └── lib/                  # Utilities (cn, formatPrice)
├── Dockerfile                # Production multi-stage build
├── Dockerfile.dev            # Development configuration
└── docker-compose.yml        # Orchestration services
```

---

## Database Schema (Summary of Core Tables)

Shopora's database architecture contains 37 normalized relational tables:
1. **Authentication:** `roles`, `permissions`, `role_permissions`, `users`, `sessions`, `oauth_accounts`.
2. **Catalog:** `categories`, `brands`, `products`, `product_images`, `product_variants`, `product_attributes`, `attribute_values`.
3. **Inventory:** `warehouses`, `inventories`, `stock_logs`.
4. **Orders & Payments:** `orders`, `order_items`, `order_status_logs`, `payments`, `payment_transactions`, `coupons`, `coupon_usages`.
5. **CMS & Feedback:** `reviews`, `banners`, `pages`, `faqs`, `settings`, `activity_logs`.

---

## API Endpoints List

- `POST /api/auth/register` - Create customer credentials.
- `POST /api/auth/login` - Authenticate user and issue secure session token.
- `GET /api/products` - List products with category, brand, search, and price range filters.
- `POST /api/checkout` - Create order transaction and initialize payment adapter redirect.
- `POST /api/payment/callback` - Receive payment processor webhooks to complete order statuses.

---

## Docker & Orchestration Setup

### Development Run
To start the entire environment (Next.js in dev, MySQL, Redis, phpMyAdmin, auto-migrations, and auto-seeding):
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Production Build
To build and start the production optimized Next.js server container:
```bash
docker compose up -d --build
```

---

## Installation & Running Locally

If you prefer running without Docker containers:

1. Clone the project and configure variables in `.env`.
2. Install npm modules:
   ```bash
   npm install
   ```
3. Generate Drizzle migrations:
   ```bash
   npx drizzle-kit generate
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

---

## Coding Standards & Git Workflow

- **TypeScript Standard:** Strict type checking, explicit interfaces for API inputs/outputs.
- **Decoupled Architecture:** Controllers must not access the DB directly; all transactions must be delegated to Services, and all queries must be handled by Repositories.
- **Git Branch Strategy:** `main` (production), `develop` (integration), and feature branches (`feature/your-feature-name`).
