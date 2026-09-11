# Spandana System Recovery

## Recovery design

The Admin Panel is not the recovery control plane. The project now includes an independent Recovery Console plus verified Recovery Points.

A Recovery Point contains:
- database backup when MongoDB is configured and `mongodump` is available
- live and draft settings snapshots
- settings history
- backend JSON data
- uploaded media
- system knowledge/docs
- application Git commit reference when available
- a verification manifest

A point is marked **GOOD** only when required artifacts exist, the database backup succeeds (or MongoDB is not configured), and the application health endpoint responds successfully at backup time.

## Settings protection

Every settings draft save creates a lightweight settings snapshot. Every settings publish creates a full Recovery Point. This keeps important Admin configuration recoverable without duplicating source code into the Knowledge Center.

## Non-technical recovery

1. Open `/recovery/` on the production domain.
2. Enter the Recovery Access Key configured for the deployment.
3. Check the system status.
4. Click **Recover Last Good** to restore the latest verified Recovery Point.
5. If necessary, select a specific Recovery Point and restore it.
6. The console restarts the Docker application when Docker control is available.
7. Check the resulting health status and then open Admin.

## Important operational requirement

Local backups are not sufficient protection against loss of the host itself. For production, `BACKUP_EXTERNAL_DIR` should point to a durable secondary/off-host backup destination (for example, a mounted backup volume or managed backup sync). The system reports whether the secondary copy succeeded; it does not pretend that an unconfigured external destination exists.

## Emergency Recovery Console — Email OTP

The independent Recovery Console no longer requires a manually managed recovery key for normal operator use. Authentication is performed with a one-time code sent to the configured `ADMIN_RECOVERY_EMAIL`.

### Operator flow

1. Open the independent `/recovery/` console.
2. Enter the registered recovery email.
3. Select **Send Recovery Code**.
4. Enter the six-digit one-time code received by email.
5. The console issues a short-lived, HttpOnly recovery session.
6. Use **Recover Last Good** to restore the latest verified-good Recovery Point.

### Security controls

- Recovery codes expire after 10 minutes and are single-use.
- Verification is limited to five attempts per challenge.
- Recovery-code requests are rate limited.
- State-changing recovery actions require an authenticated recovery session.
- A same-origin check is applied to recovery API requests.
- Before a restore/recovery operation, the console attempts a safety Recovery Point first.
- The recovery email and email credentials are configuration secrets and are never stored in the repository.

### Important deployment requirement

`ADMIN_RECOVERY_EMAIL`, `GMAIL_USER`, and `GMAIL_APP_PASSWORD` must be configured in the production environment. The Recovery Console is a separate process/container, so it remains available when the Admin frontend is unavailable. For stronger disaster recovery, the email provider and backup destination should be independent of the primary application infrastructure.
