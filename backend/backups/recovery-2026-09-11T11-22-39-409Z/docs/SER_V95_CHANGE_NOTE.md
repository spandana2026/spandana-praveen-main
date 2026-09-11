# SER V95 Change Note

## Purpose
Fix the Recovery Console backup and verification behavior without changing the main application, MongoDB URI, Gmail credentials, or Admin Panel.

## Findings
- The Recovery Console runs as a separate Node process.
- The native MongoDB backup previously checked `isDbConnected()` but the SER process had never established the main application's MongoDB connection.
- As a result, manual SER backups could report `MongoDB backup did not complete` even while the main application health check was healthy.
- Local development does not require the Docker CLI, so Docker absence should not make `Verify SER Safely` fail in local non-Docker testing.

## V95 behavior
- `mongoDump()` now asks the existing database configuration to establish a connection when the SER process is not connected, then performs the native MongoDB snapshot.
- `Verify SER Safely` treats Docker as not required during local non-production testing.
- Recovery Console wording now makes clear that SMTP configuration is already verified and that the protected safe-verification action runs after OTP unlock.

## Safety
- No destructive restore behavior was loosened.
- Only VERIFIED GOOD Recovery Points remain restorable.
- No credentials or secrets are included in this build.
