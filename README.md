# Lumière Beauty — Cosmetic Shop Management System

A modern, production-ready cosmetic shop + admin management system built with **Next.js 15 (App Router)**, **TypeScript**, **TailwindCSS**, **shadcn/ui**, **Framer Motion** and **MongoDB Atlas (Mongoose)**.

## Features
- Custom **JWT auth** via **HttpOnly cookies** (no NextAuth/Clerk/Firebase)
- Role-based access: Super Admin, Admin, Staff, Customer
- Storefront: homepage, search, categories, brands, product detail, cart, checkout, wishlist, order tracking, profile, addresses, security
- Admin: analytics dashboard (revenue/sales graphs), inventory (stock adjustment, history, low/out alerts), orders (status workflow + printable invoice), customers, employees (permissions), coupons, reports (CSV/PDF export), audit logs
- **Cloudinary** ready image storage
- Luxury glassmorphism UI, dark mode, skeletons, animated cards/tables
- Secure: password hashing (bcrypt), origin checks (CSRF), rate limiting, input validation (zod), audit logs

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in:
   - `MONGODB_URI` (MongoDB Atlas connection string)
   - `JWT_SECRET` (32+ char random string)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
3. `npm run seed` — seeds realistic Ghanaian data (15 categories, 20 brands, 150 products, 40 customers, 15 staff, 120 orders, reviews, coupons, inventory & audit logs)
4. `npm run dev` — http://localhost:3000

## Seeded accounts
- Super Admin: `admin@lumiere.gh` / `Admin123!`
- Staff: `staff0@lumiere.gh` / `Staff123!`
- Customers: `customer0@example.com` / `Customer123!`

## Deploy
Optimized for **Vercel** (serverless). Set the same env vars in the Vercel project.
