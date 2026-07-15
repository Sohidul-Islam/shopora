# Shopora Admin Panel: Enterprise System Blueprint & Architectural Specification

This blueprint details the complete product requirements, UX strategies, information architectures, wireframe specifications, database schemas, REST/GraphQL API specifications, security strategies, and future scale roadmaps for the Shopora Admin Panel.

---

## SECTION 1: BUSINESS REQUIREMENTS DOCUMENT (BRD)

### 1.1 Executive Summary
Shopora requires a unified, high-density dashboard admin panel to consolidate multi-channel commerce management. The system is designed to empower merchants to control catalogs, fulfill orders, manage campaigns, trace security audits, and generate financial reports without code deployment.

### 1.2 Business Goals
- **Minimize Operational Latency:** Achieve sub-second page transitions and quick action workflows to reduce merchant overhead.
- **Support Scale & Localization:** Provide multi-currency, multi-warehouse, and multi-lingual compatibility from day one.
- **Enterprise Accountability:** Guarantee zero-trust RBAC access controls and record immutable audit logs for all mutations.

---

## SECTION 2: FUNCTIONAL REQUIREMENTS DOCUMENT (FRD)

### 2.1 Core Modules & Workflows
- **Global Search Command Palette:** Fast keyboard shortcut (`Ctrl+K` / `⌘+K`) index searching for catalog products, customers, settings, and orders.
- **Advanced Data Table Experience:** All tables must support column visibility toggles, multi-column sorting, sticky header parameters, global text filtering, and bulk state updates.
- **Real-Time Inventory Allocation:** Adjust stock balances across multiple warehouses with logged adjustment reasons.

---

## SECTION 3: INFORMATION ARCHITECTURE & SITEMAP

```
Admin Dashboard Root
 ├── Sales Management
 │    ├── Orders (Fulfillment tracking, details timeline)
 │    ├── Returns & Refunds (Audits, partial refund adapter)
 │    └── Payments & Transactions (Gateway status verification)
 ├── Catalog System
 │    ├── Products & Variant Matrix (Pricing, stock status)
 │    ├── Categories & Subcategories (Unlimited tree hierarchy)
 │    ├── Brand Partner Showcase (Banners, brand stories)
 │    └── Inventory Depots (Warehouses, reorder thresholds)
 ├── Customer Directory
 │    ├── Profiles (Addresses, loyalty reward points log)
 │    └── Support Center (Priority ticket queue)
 ├── Marketing & CMS Suite
 │    ├── Campaign Schedulers (Countdown timers, banners)
 │    ├── Page Builders (Custom layout landing pages)
 │    └── Blog Manager (Prose articles editor)
 ├── Reports & Analytics
 │    ├── Operational Sales Logs (Export to CSV)
 │    └── Invoice Audit summaries (Export to PDF)
 └── System configuration
      ├── Security Roles (Administrators, RBAC policies)
      └── Localization Settings (API keys, currency)
```

---

## SECTION 4: USER PERSONAS & FLOWS

### 4.1 Merchant Persona: Sarah Jenkins (Operations Manager)
- **Objective:** Fulfill high volumes of orders daily and manage warehouse discrepancies.
- **Flow:** Sarah opens dashboard -> sees low stock warnings -> uses `⌘+K` command palette to type "Inventory" -> Restocks SKU via the adjustment form -> clicks "Confirm" -> returns to orders list.

### 4.2 User Flow Diagram: Order Refund Lifecycle
```
[Order Listing] ──> [Select Order] ──> [Inspect Payment Logs]
                                              │
  ┌───────────────────────────────────────────┘
  ▼
[Trigger Refund Action] ──> [Validate RBAC Scope] ──> [Dispatch Gateway API Call]
                                                             │
  ┌──────────────────────────────────────────────────────────┘
  ▼
[Record Audit Log Entry] ──> [Optimistic UI State Reload]
```

---

## SECTION 5: UI/UX & DESIGN SYSTEM GUIDELINES

### 5.1 Color Tokens & Contrast
- **Background Base:** Pitch Black/Deep Space (`#05060b` / `#090b11`) for a high-end visual feel.
- **Borders & Rules:** Subtle translucent slate grey (`rgba(255, 255, 255, 0.08)`) with `backdrop-filter: blur(12px)`.
- **Primary Accents:** Royal Indigo Blue (`#3b82f6`) and Neon Emerald (`#10b981`) for operations.

### 5.2 Typography System
- **Headers:** Display font *Cabinet Grotesk* or *Outfit* for premium presentation headers.
- **UI Content:** Clear monospaced numerals (*Geist Mono*) for prices, margins, and SKU identifiers.

---

## SECTION 6: SYSTEM ARCHITECTURE & FOLDER STRUCTURE

```
/shopora
 ├── docs/
 │    └── admin_enterprise_blueprint.md  # System Architecture Spec
 ├── src/
 │    ├── app/
 │    │    ├── admin/
 │    │    │    └── page.tsx             # Main Panel Shell
 │    │    ├── api/
 │    │    │    └── admin/               # Administrative APIs
 ├── components/
 │    └── Countdown.tsx                   # Campaign Timer Component
```

---

## SECTION 7: DATABASE ARCHITECTURE (DRIZZLE DRIFT)

### Entity Relationship Diagram (Conceptual)
```
  [Warehouses] 1 ────── N [Inventories] N ────── 1 [Product Variants]
                                                        1
                                                        │
                                                        ▼
                                                 [Products] 1 ─── N [Images]
```

---

## SECTION 8: API DESIGN (REST PROTOCOL)

### 8.1 Inventory Level Update
- **Endpoint:** `POST /api/admin/inventory/adjust`
- **Headers:** `Authorization: Bearer <AdminToken>`
- **Payload Shape:**
  ```json
  {
    "sku": "SONY-XM5-SLV",
    "quantity": 15,
    "adjustmentReason": "Bulk cargo import restock"
  }
  ```
- **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "sku": "SONY-XM5-SLV",
    "newStock": 18
  }
  ```

---

## SECTION 9: SECURITY & AUDITING STRATEGY

1. **Role-Based Access Control (RBAC):** Admin tokens are verified at the server routing middleware. Write mutations are restricted to administrators with write permissions.
2. **Immutable Audit Trails:** DB interceptors log caller user-id, exact action (e.g. `ADJUST_STOCK`), timestamp, and caller IP address on every transaction database write.

---

## SECTION 10: FUTURE ROADMAP & SCALABILITY

- **Phase 1 (Current):** Unified Single-Page administrative panel, CMS, campaigns, and local inventory stock counters.
- **Phase 2:** Multi-warehouse localization with automatic logistics routing and real-time shipping rate calculation based on packages dimensions.
- **Phase 3:** AI-assisted category auto-tagging, product translation pipelines, and automated customer returns refund processing.
