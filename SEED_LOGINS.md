# Lumière Beauty — Seed Logins

These accounts are created by `npm run seed`. Use them to test the storefront and admin dashboard.

> Passwords are fixed. The storefront requires a `customer` account; the admin area requires an `admin`/`staff`/`super_admin` account.

## Super Admin
| Role | Email | Password |
| --- | --- | --- |
| Super Admin | `admin@lumiere.gh` | `Admin123!` |

## Admin users (4)
| Role | Email pattern | Password |
| --- | --- | --- |
| Admin | `admin1@lumiere.gh` … `admin4@lumiere.gh` | `Staff123!` |

## Staff users (10)
| Role | Email pattern | Password |
| --- | --- | --- |
| Staff | `staff0@lumiere.gh` … `staff9@lumiere.gh` | `Staff123!` |

## Customer users (40)
| Role | Email pattern | Password |
| --- | --- | --- |
| Customer | `customer0@example.com` … `customer39@example.com` | `Customer123!` |

## How to test
1. `npm install`
2. Set real values in `.env.local` (`MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`).
3. `npm run seed`  (creates 15 categories, 20 brands, 150 products, 120 orders, etc.)
4. `npm run dev`
5. Open `http://localhost:3000`:
   - Browse/register as a **customer**, add to cart, checkout.
   - Log in as **admin@lumiere.gh / Admin123!** to access `/admin` (dashboard, products, inventory, orders, customers, employees, coupons, reports, audit).

## Notes
- Image URLs are seeded (Unsplash). Cloudinary uploads work once `CLOUDINARY_*` keys are set in `.env.local`.
- `.env.local` is git-ignored — never commit secrets. Set the same env vars in the Vercel project dashboard.
