# Velocity Spur Hotshot Ltd. — Website & Admin Portal

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · MongoDB Atlas (Mongoose) · Framer Motion · Lucide icons

## Quick start

```bash
npm install
cp .env.example .env.local        # fill in the three values
npm run create-admin -- you@company.ca "AStrongPassword123"
npm run dev                        # http://localhost:3000
```

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `ADMIN_SESSION_SECRET` | 32+ char random string used to sign the admin session cookie |
| `NEXT_PUBLIC_SITE_URL` | Production URL, no trailing slash (canonical URLs, sitemap, Open Graph) |

Default services, packages, page content and settings are seeded automatically the first time the site connects to an empty database. If the database is unreachable, the public site still renders using the same default content.

## Deploying to Vercel

1. Import the repository in Vercel.
2. Add the three environment variables (Production + Preview).
3. In MongoDB Atlas → Network Access, allow Vercel (`0.0.0.0/0`, or Vercel's static IPs on paid plans).
4. Deploy, then run `npm run create-admin` locally against the production `MONGODB_URI` to create the first admin.

## Routes

**Public:** `/`, `/about`, `/services`, `/packages`, `/request-quote`, `/contact`

**Admin** (`/admin/login` to sign in): `dashboard`, `quotes`, `inquiries`, `pages`, `services`, `packages`, `gallery`, `settings`

`proxy.ts` protects `/admin/**`, `/api/admin/**` and `/api/upload` (redirect for pages, `401` for APIs). Every admin route handler and the admin layout check the session again on the server.

## Image uploads (Vercel-safe)

Nothing is written to the filesystem.

- `POST /api/upload` (admin only, `runtime = "nodejs"`): validates folder (`products | gallery | pages | misc`), type (PNG/JPEG/WEBP/GIF) and size (8 MB), then stores the binary in the `StoredUpload` collection.
- `GET /api/uploads/[folder]/[filename]` serves it with `Cache-Control: public, max-age=31536000, immutable`.
- Content documents store **only the URL**.
- `lib/deleteStoredUpload.ts` removes the stored binary when an image is replaced, removed, or its service/package/gallery item is deleted. The editors also clean up uploads that were never saved.
- Uploaded images render with `unoptimized` because the Next.js optimizer cannot fetch route-handler responses. Upload web-ready images (WEBP or JPEG, roughly 1600px wide).
- Legacy `/uploads/...` paths and broken images fall back to `/images/placeholder.webp`.

Quote-request attachments (images or PDF) are stored privately and can only be opened by signed-in admins via `/api/admin/attachments/[filename]`.

## Editing content

- **Page Content:** headings, subheadings, descriptions, images, buttons and list items for every page section. In headings, `*word*` renders orange and a new line forces a line break.
- **Services / Packages / Gallery:** create, edit, reorder, hide/show, delete, and upload images.
- **Settings:** phone, email, location, taglines, service communities, planned expansion, logo and social links.

## Content rules (client requirement)

This is a newly incorporated company. Do not add customer reviews, delivery counts, years in business, fleet size, 24/7 claims, certifications or service outside Alberta unless the client confirms them. Saskatchewan and British Columbia must stay labelled as **planned** expansion.

## Before launch

- Replace `public/logo.svg` (a placeholder recreation of the badge) with the client's official logo file, or upload it under **Admin → Settings → Logo**.
- Replace the Unsplash stock images with real photos of the client's truck and trailer once available (Admin → Page Content / Services / Packages).
