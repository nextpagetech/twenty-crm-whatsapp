# Troubleshooting

## `WHATSAPP_NOT_CONFIGURED`

Cause: access token or phone number ID is missing.

Check:

- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- that variables are configured for the installed Twenty app/workspace

## `INVALID_API_VERSION`

`WHATSAPP_API_VERSION` must look like `v23.0`.

## `INVALID_RECIPIENT`

The resolved recipient must be a valid international number after normalization, normally including country code.

If using a Twenty phone field, confirm its primary number and calling code are populated.

## `MISSING_TEXT_MESSAGE`

`SEND_TEXT` resolved an empty or invalid message body. Check dynamic workflow mappings for null/empty values.

## `MISSING_TEMPLATE_NAME`

`SEND_TEMPLATE` requires an approved Meta template name.

## `EMPTY_TEMPLATE_PARAMETER`

A dynamic template parameter resolved to null/empty/invalid data. Confirm every mapped variable resolves during the workflow run.

## `INVALID_BUTTON_PARAMETER_TYPE`

The app enforces:

- URL button -> `TEXT`
- QUICK_REPLY button -> `PAYLOAD`

Also verify the button index matches the approved template.

## Meta template errors

Meta may reject a send if the template name, language, parameter count/order, or button configuration does not match the approved template.

When `continueOnError=true`, inspect:

- `errorCode`
- `errorMessage`
- `providerErrorType`
- `providerErrorSubcode`
- `providerTraceId`

Sanitize these values before posting publicly if they contain customer context.

## HTTP 429 or 5xx

The app marks HTTP 429, 408 and 5xx responses as retryable. Use `retryable=true` to drive controlled workflow retry behavior; do not implement unbounded retries.

## `META_INVALID_RESPONSE`

Meta or an upstream intermediary returned a non-JSON response. Check the HTTP status, provider availability, network/proxy behavior and API version.

## `MISSING_MESSAGE_ID`

Meta returned a successful HTTP response without a message ID. Treat the send as unsuccessful and investigate the response/provider behavior.

## Timeouts/network failures

The Meta request uses a 15-second abort timeout. Timeout/abort errors are marked retryable when returned through `continueOnError`.

## Do not expose credentials

Never paste access tokens into GitHub Issues. Security-sensitive reports should follow `SECURITY.md`.
