# Google Play Compliance Notes

## App Permissions

Android permissions currently expected from Expo config:

- `CAMERA`: only requested when the user taps Take Photo in the service request form.
- `POST_NOTIFICATIONS`: only requested when the user enables request follow-up alerts.

The app should not request broad photo/video library permissions. Users attach photos and documents through system picker flows.

## Privacy Policy

Use this URL in Play Console:

https://servicioselpaisano.com/privacy.html

The app also links to the privacy policy from the Contact screen and includes an in-app Privacy & Data summary.

## Data Safety Form

Disclose service-request data if the production endpoint is enabled:

- Personal info: name, email address, phone number.
- User content/files: photos or documents attached by the user.
- App activity or device identifiers: only if analytics, push-token storage, or server logs are used in production.

Collection purpose:

- App functionality.
- Customer support / service request follow-up.

Mark notification token collection only if the production backend receives and stores push tokens.

## Store Listing

Prominently describe the features that use permissions:

- Users can request services and optionally attach photos/documents.
- Users can optionally enable notifications for request follow-up alerts.

## Build Requirement

For new apps and updates submitted after August 31, 2025, Google Play requires Android 15 / API 35 or higher for phone/tablet apps. Confirm the final AAB target SDK from the EAS build artifact before submission.
