# WeddingBingo — Full Recovery and Production-Readiness Report

## Executive assessment

The latest WeddingBingo MVP archive was audited as the single source of truth. The application now passes frontend lint, frontend production build, and backend syntax validation. Several root-cause defects were repaired across startup configuration, database bootstrapping, public API integration, authentication boundaries, media handling, route behavior, public forms, and repository hygiene.

The project is **functionally improved and suitable for staging validation**, but it is **not yet production-ready** because external-service integration, end-to-end browser tests, two-factor authentication, object storage, CSRF tokens, automated tests, and several full-CMS workflows still require implementation or real credentials.

## Audit map

```text
Public/admin React pages
        ↓
Axios API client / public fetches
        ↓
Express routes and middleware
        ↓
Controllers and validation
        ↓
Mongoose models
        ↓
MongoDB / SMTP / local media storage
```

The most important broken links were startup-to-database configuration, public pages-to-API integration, placeholder forms, and unsafe local configuration/media handling.

## Issues discovered and root causes

| Severity | Area | Root cause | Status |
| --- | --- | --- | --- |
| Critical | Database startup | The connection code read `MONGO_URI` while the documented configuration used `MONGODB_URI`; startup also began seeding and listening without awaiting database readiness. | Fixed |
| Critical | Secrets | A backend `.env` file contained live-looking administrator, SMTP, and JWT values. | Removed from the patched project; credentials should be rotated if they were real or reused. |
| High | Public booking | `/book-now` was a placeholder and did not submit anything. | Fixed with a real booking request form and API endpoint. |
| High | Public packages/testimonials | Public pages were placeholders and did not consume the database-backed MVP content. | Fixed with read-only published-content APIs and resilient pages. |
| High | Contact workflow | Contact requests only attempted SMTP delivery, so an SMTP outage could lose the inquiry. | Fixed by persisting the inquiry first and treating notification email as best-effort. |
| High | Media upload security | Upload validation trusted filename extensions and used a weak timestamp/random filename. | Fixed with MIME-plus-extension checks, cryptographic filenames, file count limits, and size limits. |
| Medium | Password reset validation | The validator made both URL and body token optional, allowing an undefined token to reach the controller. | Fixed by requiring a token in either location. |
| Medium | Admin shell | Public navigation was rendered globally, including on admin routes. | Fixed by making the shell route-aware. |
| Medium | Routing | `/admin` had no stable entry redirect and unknown URLs had no explicit fallback. | Fixed with admin redirect and a 404 fallback. |
| Medium | Admin settings | Settings was a placeholder with no account-security operation. | Fixed with a password-change form connected to the secured API. |
| Low | Repository hygiene | Runtime upload directories were not ignored. | Fixed in `.gitignore`. |
| Low | Bundle size | The frontend main bundle exceeds Vite’s 500 kB warning threshold. | Not blocking; code splitting remains recommended. |

## Fixes implemented

The backend now loads configuration through standard dotenv behavior, validates the MongoDB configuration before connecting, awaits the connection, seeds the first administrator only after connection, and starts the HTTP listener only after successful initialization. The documented variable is `MONGODB_URI`, while legacy `MONGO_URI` remains accepted for migration compatibility.

The public contact flow validates the name, email, and message, stores an `Inquiry` document, and then attempts email notification. The response identifies whether notification delivery succeeded without losing the lead when SMTP is unavailable. The new public booking flow validates the couple name, email, and date, creates a `Booking`, and creates a linked inquiry record for follow-up.

Published packages and testimonials are now exposed through public read-only endpoints. The public packages and testimonials pages use those endpoints and include loading, empty, and error states. The booking page is no longer a placeholder and provides a responsive form with submission feedback.

Authentication continues to use HTTP-only cookie sessions with backend authorization and role permissions. The recovery pass adds a browser-origin check to state-changing authenticated admin requests, preserves session-version invalidation, and keeps bearer compatibility only for migration. The settings page now supports password changes, which invalidate existing sessions.

Media upload validation now checks MIME type and extension together, uses cryptographically random filenames, limits uploads to one file and 10 MB, and keeps deletion cleanup behavior. Local disk storage is still a staging implementation and must be replaced or backed by object storage for production.

## Verification performed

| Verification | Result |
| --- | --- |
| Backend syntax checks for server, database connector, routes, controllers, middleware, validators, and models | Passed |
| Frontend ESLint | Passed with zero errors and warnings |
| Frontend Vite production build | Passed |
| Startup behavior without required configuration | Fails safely with a clear missing-`MONGODB_URI` error rather than partially starting |
| Secret-file scan of the patched source | No `.env` file remains; only the safe `.env.example` template is included |
| Public booking/contact code path review | API contract implemented and aligned with the frontend forms |
| Protected MVP route review | All resource routes use authentication before permission enforcement |

The production build reports a non-blocking main-chunk size warning. No real MongoDB or SMTP credentials were available, so live database, email, upload persistence, browser cookie, and cross-origin tests could not be honestly claimed as passed.

## Features now working in source

The admin panel includes cookie-session login, refresh-time server verification, logout, password changes, role/permission enforcement, audit log access, dashboard statistics, gallery upload/list/delete, weddings and portfolio CRUD, inquiries CRUD and status/notes operations, bookings CRUD, testimonials CRUD, packages CRUD, and responsive empty/loading/error states.

The public site includes gallery retrieval and engagement counters, database-backed packages and testimonials, a persisted contact inquiry flow, and a persisted booking request flow. The application also has an explicit admin entry redirect and a public not-found fallback.

## Missing configuration

| Variable | Purpose | Required format | Used by |
| --- | --- | --- | --- |
| `MONGODB_URI` | MongoDB connection | MongoDB URI | Backend startup and all database APIs |
| `JWT_SECRET` | Signs admin sessions | Long random secret | Login and auth middleware |
| `ADMIN_EMAIL` | Initial administrator email | Valid email | Idempotent admin seed |
| `ADMIN_PASSWORD` | Initial administrator password | Strong password | Idempotent admin seed |
| `FRONTEND_URL` | Credentialed CORS and origin checks | Full frontend origin | Express CORS and admin mutation protection |
| `EMAIL_USER` / `EMAIL_PASS` | SMTP credentials | Provider-specific credentials | Contact/reset notification services |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | Optional explicit SMTP transport | Host, numeric port, boolean secure flag | Mail transport |
| `STORAGE_*` / `CDN_BASE_URL` | Production media storage | Provider-specific | Not yet wired to durable object storage |
| `ANALYTICS_PROVIDER` / `ANALYTICS_ID` | Analytics | Provider-specific | Not yet wired |

A safe template is included at `backend/.env.example`. Never commit a real `.env` file. Any real credentials that were present in the earlier working copy should be rotated.

## Remaining blockers

The following work is still required before production launch:

| Priority | Blocker or incomplete area | Required next step |
| --- | --- | --- |
| P0 | No live integration test against MongoDB | Configure staging MongoDB and test login, refresh, CRUD, counters, and failure paths. |
| P0 | No full browser E2E suite | Add Playwright/Cypress coverage for login, refresh, logout, RBAC, forms, uploads, and responsive routes. |
| P0 | No TOTP 2FA | Add encrypted TOTP enrollment, challenge, backup codes, recovery, and audit events. |
| P0 | Origin check is not a complete CSRF token system | Add CSRF token issuance/validation or formally document and enforce a same-origin deployment model. |
| P0 | Local media storage | Move uploads to S3-compatible storage/CDN, generate derivatives, strip EXIF, and add orphan cleanup. |
| P1 | Admin user management | Add super-admin-only user CRUD, role assignment, suspension, session revocation, and permission overrides. |
| P1 | Full gallery/portfolio editor | Add wedding linkage, captions, alt text, tags, ordering, bulk actions, and media picker. |
| P1 | Calendar and availability | Add calendar views, blocked dates, conflict checks, reminders, and event editing. |
| P1 | Rich inquiry workflow | Add pipeline UI, follow-up dates, templates, and inquiry-to-booking conversion. |
| P1 | Homepage/SEO CMS | Add singleton homepage content, metadata, sitemap/robots configuration, and preview/publish controls. |
| P1 | Blog/news CMS | Add posts, drafts, publishing, cover media, tags, and public routes. |
| P2 | Analytics | Add privacy-conscious provider configuration and event reporting. |
| P2 | Automated unit/API tests and CI | Add controller, permission, model, and API contract tests with CI gates. |
| P2 | Frontend code splitting | Split routes/components to reduce the main bundle warning. |

## Production-readiness status

**Staging readiness: conditional.** The codebase builds and the major MVP source-level defects found in the audit have been repaired. It is ready for a controlled staging deployment once MongoDB and required configuration are supplied.

**Production readiness: not approved yet.** Production approval must wait for real-service integration tests, credential rotation, 2FA, stronger CSRF protection, durable media storage, automated regression tests, and completion of the remaining operational workflows.

## Recommended next phase

The next phase should be a security and integration hardening sprint. Configure a staging environment, add Playwright/API integration tests, implement TOTP 2FA and CSRF tokens, replace local uploads with durable object storage, and verify the complete login-to-database-to-UI path with real services. Only after those checks should the application move to production deployment review.
