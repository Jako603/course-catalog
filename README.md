# Course Catalog (Frontend)

Next.js frontend for the course catalog. Fetches data from the FastAPI backend.

## How to run

Start the **backend first**, then the frontend.

**Backend:**
```bash
cd course-catalog-api
.venv\Scripts\Activate.ps1
fastapi dev main.py
```

**Frontend:**
```bash
cd course-catalog
npm run dev
```

Open http://localhost:3000

## Environment variables

Create a `.env.local` file in the project root (next to `package.json`):

```
API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- `API_URL` — used by Server Components (getCourses, getCourse); never exposed to the browser
- `NEXT_PUBLIC_API_URL` — used by Client Components (ElectiveFilter, LikeButton, EnrollForm); written into browser JS

## Decisions

`generateStaticParams` was removed from `/courses/[id]/page.tsx` because the course data now lives in the backend. Building pages in advance would freeze the data at build time, and the build would fail if the backend is not running. With `cache: "no-store"` both `/courses` and `/courses/[id]` are marked `ƒ` (dynamic) and always fetch fresh data on request.

The like button sends a `POST` with no body and no custom headers — a "simple" request in CORS terms, so the browser skips the preflight. The enrollment form sends `Content-Type: application/json`, which goes beyond simple request rules, so the browser first sends an `OPTIONS` preflight to ask for permission.

## Breakage journal

### Breakage 1: CORS removed entirely
- What I did: commented out the whole `app.add_middleware(CORSMiddleware, ...)` block
- Console: `Access to fetch at 'http://localhost:8000/courses' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource`
- Network: courses — red (CORS error), like POST went through but was blocked, OPTIONS enrollments → 405
- Cause: no `access-control-allow-origin` header in any response; `/courses` page still worked (server-to-server request)
- How I found it: step 3 of the algorithm — no `access-control-allow-origin` in response headers

### Breakage 2: trailing slash in allow_origins
- What I did: `allow_origins=["http://localhost:3000/"]`
- Console: same CORS message as breakage 1
- Network: courses — red, OPTIONS enrollments → 400 `Disallowed CORS origin`
- Cause: `"http://localhost:3000/"` with a trailing slash matches no origin
- How I found it: step 3 — header missing; step 4 — OPTIONS returned 400

### Breakage 3: allow_methods removed
- What I did: deleted the `allow_methods=["*"]` line
- Console: `Response to preflight request doesn't pass access control check: It does not have HTTP ok status`
- Network: /filter and like worked; OPTIONS enrollments → 400, POST not sent
- Cause: only GET is allowed by default; POST is rejected; `access-control-allow-origin` was present but `access-control-allow-methods` only showed GET
- How I found it: step 4 — OPTIONS returned 400; response showed methods didn't include POST

### Breakage 4: different origin (127.0.0.1)
- What I did: opened frontend at `http://127.0.0.1:3000/filter` (added `allowedDevOrigins: ["127.0.0.1"]` to next.config.ts)
- Console: `Access to fetch at 'http://localhost:8000/courses' from origin 'http://127.0.0.1:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present`
- Network: courses — red, backend log showed 200 OK
- Cause: `localhost` and `127.0.0.1` are different origins; only `http://localhost:3000` is in `allow_origins`
- How I found it: step 3 — no `access-control-allow-origin`; header value didn't match the page origin

### Breakage 5: Python error masquerading as CORS
- What I did: changed `p["offset"]` to `p["ofset"]` in `list_courses`
- Console: `No 'Access-Control-Allow-Origin' header is present` — looks like CORS
- Network: courses — red (CORS error); like and form still worked; `/courses` page showed error.tsx
- Cause: unhandled Python `KeyError` → 500 response produced outside `CORSMiddleware` → no `access-control-*` headers; not a CORS problem
- How I found it: step 5 — backend terminal showed `500 Internal Server Error` and `KeyError: 'ofset'`; the fact that `/courses` (server-to-server) also failed confirmed it was a server error
