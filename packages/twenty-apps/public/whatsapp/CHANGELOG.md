# Changelog

All notable changes to this package are documented here.

## [Unreleased]

### Changed

- Refactored provider-specific Meta implementation behind a `WhatsAppProvider` interface.
- Removed business-specific order parsing from the generic WhatsApp workflow action.
- Improved Meta API response parsing and structured diagnostics.
- Standardized Next Page Technologies attribution and support contact details.
- Changed package license declaration to Apache-2.0.

### Added

- Provider diagnostics (`providerErrorType`, `providerErrorSubcode`, `providerTraceId`).
- Tests for text payloads, invalid recipients, missing configuration, invalid API versions, rate limits, non-JSON responses, missing message IDs and timeouts.
- Open-source project documentation and community files.

## [0.1.0]

Initial development version with Meta WhatsApp Cloud API text and template sending from Twenty workflows.
