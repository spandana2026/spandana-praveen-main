# V108 — Join Us Connections: ID Error + UX Polish

## Fixed
- Mongo-backed Join Us records now receive a stable string `id` in the admin list response, derived from `_id` when needed.
- The admin UI defensively derives the record ID from either `id` or `_id` before status/delete actions.
- Status updates use the canonical `/api/v1/admin/volunteers/:id/status` endpoint.
- Backend status update now rejects a missing ID with HTTP 400 and converts Mongo CastError into a controlled HTTP 400 instead of exposing a raw Mongoose exception.
- Admin connection records no longer send `undefined` as the Volunteer model ID.

## UX / visual polish
- Join Us Connections admin page now has a premium header, summary cards, cleaner search/filter bar, status badges, responsive connection cards, and clearer expanded profile information.
- Existing Admin navigation is preserved; no new Admin navigation section was added.
- Public Join Us config merge is hardened against incomplete/malformed live settings for option lists, specialisations, pathways and pathway fields.
- Duplicate `Other` entries in multi-select menus are prevented visually.
- Several public search placeholders now come from configurable settings when available.

## Verification
- `node --check` passed for the modified backend controller and volunteer route.
- Full frontend build could not be completed because project dependencies are not fully installed in the execution environment; `npm ci`/`npm install` timed out. `tsc` also reports missing dependency type definitions. No claim of a successful production Vite build is made.
