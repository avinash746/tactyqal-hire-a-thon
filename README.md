# Tactyqal Labs: Hire-a-thon Submission

Two deliverables in one repository:

| Folder | What it is | Stack |
| --- | --- | --- |
| [`frontend/`](frontend) | **Task 1.** Redesigned, responsive homepage, plus blog pages and an admin demo that run on the new API | Next.js 14 (App Router), JavaScript, Tailwind CSS, lucide-react |
| [`backend/`](backend) | **Task 2.** Blog backend: database schema and REST API (create, read, update, delete), search, tags, pagination | Node.js, Express 5, **MongoDB** (Mongoose), Zod |

## Quick start

Requires Node.js 18+ (tested on 22) and a MongoDB instance: local, Docker (`docker compose up -d` in `backend/`), or a free MongoDB Atlas cluster.

```bash
# 1. Backend (terminal 1)
cd backend
npm install
cp .env.example .env          # set MONGODB_URI and your own ADMIN_API_KEY
docker compose up -d          # optional: local MongoDB on :27017
npm run seed                  # optional: loads 6 sample posts
npm run dev                   # http://localhost:4000/api

# 2. Frontend (terminal 2)
cd frontend
npm install
cp .env.example .env.local
npm run dev                   # http://localhost:3000
```

Pages: `/` homepage, `/blog` listing (search, topic filter, pagination), `/blog/<slug>` article, `/admin` create/edit/delete demo (paste your `ADMIN_API_KEY`).
The homepage still renders if the API is offline: the blog section falls back to links to the existing WordPress articles.

Run the backend tests: `cd backend && npm test` (7 tests covering auth, validation, CRUD, drafts, bad ids, 404s). They need a running MongoDB and use a throwaway database that is dropped afterwards (override with `MONGODB_TEST_URI`).

---

## Task 1: Homepage redesign

**Goals.** The current page is a long stack of sections on one CodeIgniter template. The redesign keeps all real content (programs, stories, pricing, FAQ, contact details) but makes the page faster to understand and easier to act on.

**Design decisions**
- **One memorable moment.** The hero shows a phone that "builds itself" through the real four program stages (ideation, prototype, development, launch). Visitors can click a stage, and it auto-advances once, pausing as soon as they interact. It explains the product in five seconds without a video.
- **Palette and type.** Chalk background, deep ink, signal blue for actions, marigold and mint as accents. Bricolage Grotesque for headings and Figtree for body text, both self-hosted through Fontsource (no third-party font requests).
- **Varied layouts, one job each.** Stories use a feature-plus-grid layout, the program is a true timeline (it is a real sequence), reasons are a definition list, tools are quick-link chips, pricing is a single focused card.
- **Accessibility and performance.** Skip link, visible focus, semantic landmarks, native `<details>` FAQ, `prefers-reduced-motion` respected, lazy-loaded images, no horizontal overflow at 390px or 1366px. Almost no client JavaScript: only the navbar, the hero phone and the admin panel are client components.
- **Clear, specific CTAs.** "Book free consultation" is repeated at every decision point and opens the existing booking calendar.

**Structure:** `components/` holds one file per section, `lib/content.js` holds all copy, `lib/api.js` talks to the backend.

---

## Task 2: Blog backend

**Why replace WordPress for the blog?** It runs as a separate system with its own login, theme and plugin updates, and a different look from the main site. A small API owned by the same team lets any frontend (Next.js now, CodeIgniter or mobile later) read the same content.

### Data model

One `posts` collection (Mongoose model in `src/models/Post.js`). Tags are embedded in the post, which is the natural MongoDB shape and avoids joins:

```
Post {
  _id, title, slug (unique), excerpt, content (Markdown), coverImage, author,
  status: 'draft' | 'published', readTime (minutes),
  tags: [{ name, slug }], publishedAt, createdAt, updatedAt
}
```
Indexes: unique `slug`, `{ status, publishedAt }` for the public listing, and `tags.slug` for topic filters. `/tags` is a single aggregation (`$unwind` + `$group`) over published posts.

### API

Base URL `http://localhost:4000/api`. Write routes need `Authorization: Bearer <ADMIN_API_KEY>` (or `X-API-Key`).

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | no | Liveness check |
| GET | `/posts` | no | Published posts. Query: `page`, `limit` (max 50), `q` (search), `tag`. Admins may add `status=draft\|all` |
| GET | `/posts/:idOrSlug` | no (drafts: admin) | One post (by slug or MongoDB id) with full Markdown content |
| POST | `/posts` | admin | Create (`title`, `content` required) |
| PUT | `/posts/:id` | admin | Replace a post |
| PATCH | `/posts/:id` | admin | Update only the fields sent |
| DELETE | `/posts/:id` | admin | Delete (returns 204) |
| GET | `/tags` | no | Tags with published-post counts |

```bash
curl -X POST http://localhost:4000/api/posts \
  -H "Authorization: Bearer $ADMIN_API_KEY" -H "Content-Type: application/json" \
  -d '{"title":"My first post","content":"Hello **world**","tags":["News"],"status":"published"}'
```

Responses are `{ "data": ... }` (lists add `meta: { page, limit, total, totalPages }`). Errors are `{ "error": "...", "details": [{ "field", "message" }] }` with correct status codes (400, 401, 404, 413, 429, 500).

### Engineering notes
- **Layered:** `routes` (HTTP) → `postsRepo` (all queries) → `models/Post.js` (schema). Database code is isolated, so changing store later means re-implementing `src/postsRepo.js` only.
- **Validation:** Zod schemas reject unknown fields and bad input before they reach the database.
- **Security:** Helmet, CORS allow-list, rate limiting, 1 MB body limit, timing-safe key comparison, user input is never interpolated into queries (search text is regex-escaped, ids are validated as ObjectIds), drafts hidden from the public. The frontend renders Markdown with `react-markdown`, which does not execute raw HTML.
- **Slugs and read time** are generated automatically. Duplicate titles get `-2`, `-3`, and so on, and the unique index plus a retry covers simultaneous requests. `publishedAt` is set the first time a post is published.
- **Migration:** `npm run import:wp -- https://tactyqal.com/blog` copies existing WordPress posts (tags, cover image, author, date) through the WordPress REST API. It is safe to re-run.

### Known limitations and next steps
Single shared admin key (a real login with roles would be next), search uses a case-insensitive regex (a MongoDB text or Atlas Search index would scale better), and image upload is not included (cover images are URLs).

---

## Deploying

- **Database:** MongoDB Atlas free tier. Copy its connection string into `MONGODB_URI` (and allow your host's IP in Atlas network access).
- **Backend:** any Node host (Render, Railway, Fly.io). Set `MONGODB_URI`, `ADMIN_API_KEY` and `CORS_ORIGIN` (your frontend URL).
- **Frontend:** Vercel. Set `API_URL` and `NEXT_PUBLIC_API_URL` to the deployed API.

## Submission checklist
- [ ] Push to GitHub: `git init && git add . && git commit -m "Tactyqal hire-a-thon" && git branch -M main && git remote add origin <your-repo-url> && git push -u origin main`
- [ ] Live demo URL **or** video walkthrough link added here: `<link>`
- [ ] GitHub repository link: `<link>`
