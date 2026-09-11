# People & Participation / Join Us — V104

## Purpose
This revision moves the public Join Us form toward a simple, relationship-first People & Participation experience rather than a job-style volunteer application.

## Implemented
- Removed the public opening Volunteer / Professional / Advisor / Patron / Partner classification chips.
- Added a blue-theme hero/banner using the supplied original Spandana logo and the repository's existing community image.
- Kept a single final Connect with Spandana submission button; removed the intermediate Submit now button.
- Initial profile captures name, profession/background, specialisation/area, WhatsApp/mobile, email and city/location.
- Profession and specialisation are settings-driven.
- Added Judge to the Lawyer / Legal Professional professional-role options.
- Skills, areas of interest and support-needed choices use dropdown/multi-select controls with Other support.
- Referral captures referrer name, mobile/WhatsApp and city.
- QR source metadata remains automatically captured from the QR connection URL.
- Professional pathways and question fields are stored in settings so Admin can edit them.
- Banner copy, form headings, labels, placeholders, options, future relationship options and sidebar copy are settings-driven.
- Added Admin → People & Participation as the canonical configuration and people/connection surface. Legacy People/Volunteer tabs redirect to it.
- Patron, Ambassador and Sponsor remain optional final relationship pathways; their displayed amount/detail is Admin-controlled.
- Added duplicate email/mobile detection before creating a new connection, including normalized phone comparison for new records.
- Added professional fields for medical expertise/service years and legal role/practice area to the stored record and Admin display/export.
- Preserved SER/recovery code and unrelated website sections.

## Validation
- Backend JavaScript syntax checks passed for the changed volunteer model, controller and route.
- TypeScript syntax parsing was run against the changed TSX files. Full type/build validation could not be completed because frontend dependencies/node_modules are not installed in the working environment; resulting TypeScript output is dependency-resolution related rather than a syntax failure.
