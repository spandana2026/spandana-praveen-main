# Join Us V3 — People & Participation Foundation

This build updates the public Join Us experience around the agreed People & Participation model.

## Visitor experience
- Opening removes the Volunteer / Professional / Advisor / Patron / Partner classification chips.
- Opening banner uses the existing blue theme and a simple connection-first message.
- Minimum profile: name, profession/background, specialisation/area, WhatsApp/mobile, email, location.
- Visitor can submit immediately after the essential details and consent are complete.
- Additional sections are optional enrichment rather than a job-style application.
- Profession and specialisation use searchable browser datalists; major medical specialisations are included.
- DOB is optional and provides age/birthday micro-feedback when supplied.
- Professional details are shown according to the selected background; no generic Programs Interested list is shown.
- Skills/interests are selection-based, with Other available.
- Connection source supports referral, camp, program, team contact, network, social, WhatsApp, online and Other.
- Referral captures name, mobile/WhatsApp and city.
- QR source parameters can be captured automatically without asking the visitor to enter codes/designations.
- Optional help/support pathway is included.
- Patron / Ambassador / Sponsor are presented at the end as optional relationship pathways; pricing remains an Admin-controlled follow-up item.

## Backend
- Volunteer/Join Us records now store source, QR/source ID, connector, referral and help/future-role information.
- Skills are stored as an array.
- Consent is required; the previous association/contribution/program requirements are removed from public submission validation.
- DOB remains optional; if supplied for a minor, guardian information is required.
- Notification email now includes the meaningful submitted profile/source/referral/help fields rather than only name and email.

## Admin
- Existing People & Participation navigation remains the home for the existing volunteer/Join Us tabs.
- "Volunteer Applications" is renamed to "Join Us Connections".
- Admin connection records expose referral/source/QR/connector/help/future relationship information and CSV export includes these fields.

## Validation note
Backend JavaScript syntax checks passed for the modified backend files. Frontend dependency packages are not installed in this reference ZIP, so a full frontend build/typecheck could not be completed in this environment.
