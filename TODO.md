# WeddingBingo -> Production Wedding Photography Platform

## Step 1: Backend foundation (security + architecture)
- [x] Install deps: express-validator, express-mongo-sanitize, multer, cookie-parser
- [x] Add admin JWT auth (login, protected routes, middleware)
- [x] Add centralized error handling + async handler
- [x] Add validation middleware + file upload middleware (multer)
- [x] Add MongoDB sanitization
- [x] Update `backend/app.js`/`server.js` accordingly

## Step 2: Data models
- [ ] Update Image model for categories/featured/title/description
- [ ] Add models: Review, ContactInquiry, BookingRequest, Package

## Step 3: Backend APIs (gallery/public + admin)
- [ ] Public gallery fetch with filtering
- [ ] Admin CRUD for images (upload/edit/delete/feature)

## Step 4: Reviews workflow
- [ ] Public review submit (pending)
- [ ] Public listing (approved only)
- [ ] Admin approve/reject/edit/delete

## Step 5: Contact + Bookings
- [ ] Public contact form -> store + email confirmation + admin notification
- [ ] Public booking request -> store status=pending + email notifications
- [ ] Admin workflows: accept/reject/complete + update statuses

## Step 6: Packages CRUD
- [ ] Admin create/edit/delete packages with cover image upload
- [ ] Public packages fetch

## Step 7: Email templates
- [ ] Booking received/approved/rejected
- [ ] Contact confirmation + admin notification
- [ ] Forgot/reset password templates

## Step 8: Frontend upgrade
- [ ] Replace testimonials with approved reviews fetch
- [ ] Implement Booking + Contact to call new APIs
- [ ] Add SEO + loading/error states
- [ ] Add toast notifications + form validation
- [ ] Lazy-load images

## Step 9: Admin UI
- [ ] Admin login page
- [ ] Admin dashboard cards + tables
- [ ] Admin management pages for Gallery/Reviews/Bookings/Contacts/Packages

## Step 10: Verify + run
- [ ] Install deps in backend/frontend
- [ ] Run both servers
- [ ] Smoke test all workflows end-to-end

