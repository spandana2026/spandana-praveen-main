# Emergency Recovery by Email

## Purpose

The Admin Panel is not required to start or authenticate the independent Recovery Console. A dedicated recovery email receives a one-time code that unlocks the recovery actions.

## Required production configuration

Set these values in the production environment (not in Git):

- `ADMIN_RECOVERY_EMAIL` — the dedicated recovery mailbox.
- `GMAIL_USER` — the mailbox used by the recovery service to send the code.
- `GMAIL_APP_PASSWORD` — an app password for that mailbox, not the mailbox's normal password.
- `BACKUP_EXTERNAL_DIR` — a durable/off-host backup destination, preferably on storage independent of the application host.

## Operator procedure

1. Open `/recovery/`.
2. Enter the registered recovery email.
3. Click **Send Recovery Code**.
4. Enter the six-digit code from email.
5. Click **Recover Last Good**.
6. Confirm the recovery point shown by the console.
7. Wait for the recovery result and health check.

## Security

The recovery code is never written to disk, never returned in the API response, and expires after 10 minutes. A verified recovery session is short-lived and stored in an HttpOnly cookie. Recovery requests and OTP attempts are rate limited.

## Independence

The Recovery Console is a separate Docker service. It does not depend on the Admin frontend being healthy. It does still require the host/container runtime and the configured email service to be available. For full-host disaster recovery, configure a durable secondary backup destination and a separate infrastructure failover plan.


## Local configuration checklist

The recovery console reads its environment from `backend/.env`. Before using email recovery, configure:

- `ADMIN_RECOVERY_EMAIL` — the email address allowed to unlock recovery.
- `GMAIL_USER` — the Gmail account that sends recovery messages.
- `GMAIL_APP_PASSWORD` — a Google App Password for that sender account.

Do not put the normal Gmail password here. Do not commit `backend/.env` to Git.

Start locally with `npm run recovery:console`, then open `http://localhost:5051/`. If email settings are missing, the console reports **Email OTP: NOT CONFIGURED** instead of pretending recovery email is ready.
