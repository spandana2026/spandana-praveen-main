# Spandana V107 — Join Us / People & Participation

Implemented from the V106 working copy after the agreed blueprint.

## Visitor experience
- Premium animated hero and section reveal transitions.
- Immediate loading state instead of blank/unloaded content.
- Safe frontend configuration merge with defaults when live settings are incomplete.
- Main Profession: single searchable selection.
- Additional Professions / Backgrounds: searchable multi-select.
- Skills, Interests, Contribution and Help: searchable multi-select.
- `Other` on controlled lists, with multiple custom values.
- Professional pathway content appears only for selected professions.
- Referral source reduced to `Someone introduced me` / `Other`.
- Reference name and mobile shown only for `Someone introduced me`.
- QR source captured from URL without asking visitor to type QR data.
- Optional help request retained.
- Final Connect button and thank-you screen.
- Returning visitor lookup when both mobile and email match; existing information can be enriched rather than blocked.

## Admin
- Existing Volunteer / Join Us Connections / Get Involved navigation preserved.
- People & Participation remains one Admin area.
- Human-readable control sections for opening experience, visitor wording, dropdown lists, professional pathways and suggested new options.
- Master lists support add/edit/delete through the same control area.
- Visitor-entered `Other` values are surfaced as Suggested New Options.

## Backend
- Added exact-person lookup endpoint.
- Returning submissions enrich the existing record and remain `New`.
- Added suggestion aggregation endpoint.
- Added storage for main/additional professions, custom values, multi-specialisations and professional profiles.
- Email alert includes the richer Join Us information.

## Verification
- Backend JavaScript syntax checks passed for modified backend files.
- Frontend TSX syntax transpilation checks passed for modified frontend files.
- Full Vite build was attempted but could not be completed in this environment because the dependency installation timed out; therefore this ZIP is not represented as a full production-build-verified release.
