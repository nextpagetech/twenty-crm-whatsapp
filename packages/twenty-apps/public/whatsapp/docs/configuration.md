# Configuration

## Where configuration lives

Configure the provider values in the installed WhatsApp app's **application-variable settings in Twenty**. Provider credentials should not be embedded directly in workflow steps or committed to source control.

## Application variables

| Variable | Required | Secret | Purpose |
| --- | --- | --- | --- |
| `WHATSAPP_ACCESS_TOKEN` | Yes | Yes | Meta WhatsApp Cloud API access token |
| `WHATSAPP_PHONE_NUMBER_ID` | Yes | No | Sender phone number ID used by Meta |
| `WHATSAPP_API_VERSION` | No | No | Meta Graph API version; defaults to `v23.0` |

Never commit real credentials or production values.

## Workflow inputs

### Common

`operation` supports:

- `SEND_TEXT`
- `SEND_TEMPLATE`

`recipientPhoneNumber` accepts either a complete international number or a supported Twenty phone-field object. The app normalizes supported phone values to digits-only international format and validates a length of 7 to 15 digits.

`continueOnError` controls failure behavior:

- `false` or omitted: validation/provider failures are thrown and stop the action.
- `true`: the action returns `success=false` with structured error details.

### `SEND_TEXT`

Required:

- `recipientPhoneNumber`
- `messageBody`

Optional:

- `previewUrl`
- `continueOnError`

### `SEND_TEMPLATE`

Required:

- `recipientPhoneNumber`
- `templateName`

Optional:

- `languageCode` — defaults to `en_US`
- `templateHeaderParameters`
- `templateBodyParameters`
- `templateButtonSubType` — `URL` or `QUICK_REPLY`
- `templateButtonIndex` — zero-based non-negative integer, defaults to `0`
- `templateButtonParameterType` — `TEXT` or `PAYLOAD`
- `templateButtonParameters`
- `continueOnError`

Parameter order must match the approved template definition in Meta.

For URL buttons the parameter type must be `TEXT`. For quick-reply buttons the parameter type must be `PAYLOAD`.

## Success response

Example `SEND_TEXT` response:

```json
{
  "success": true,
  "acceptedByMeta": true,
  "provider": "meta",
  "operation": "SEND_TEXT",
  "messageId": "wamid.example-message-id",
  "recipientPhoneNumber": "15551234567",
  "providerStatus": "accepted"
}
```

For `SEND_TEMPLATE`, `templateName` is also returned.

## Structured error response

With `continueOnError=true`, a failure is returned as a result object instead of being thrown.

Example:

```json
{
  "success": false,
  "acceptedByMeta": false,
  "provider": "meta",
  "operation": "SEND_TEXT",
  "errorCode": "INVALID_RECIPIENT",
  "errorMessage": "Recipient phone number must contain 7 to 15 digits including country code",
  "retryable": false
}
```

Meta/provider failures can additionally return HTTP and provider-specific diagnostics.

## Output contract

| Field | Type | Meaning / availability |
| --- | --- | --- |
| `success` | boolean | `true` for a successful provider acceptance; `false` for a structured failure |
| `acceptedByMeta` | boolean | `true` only after Meta accepts the API request and returns a message ID |
| `provider` | string | Provider name; currently `meta` |
| `operation` | string | Requested operation |
| `messageId` | string | Meta WhatsApp message ID on successful acceptance |
| `recipientPhoneNumber` | string | Normalized recipient when available |
| `providerStatus` | string | Meta message status when returned by Meta |
| `templateName` | string | Normalized template name for template operations when available |
| `errorCode` | string | Validation, generic request or provider error code |
| `errorMessage` | string | Human-readable error description |
| `httpStatus` | number | HTTP status when the failure came from an HTTP response |
| `retryable` | boolean | Whether the implementation classifies the failure as safe to consider for controlled retry |
| `providerErrorType` | string | Meta error type when supplied |
| `providerErrorSubcode` | number | Meta error subcode when supplied |
| `providerTraceId` | string | Meta trace ID when supplied |

`acceptedByMeta=true` means Meta accepted the API request. It does not prove final delivery or read status.

See [Troubleshooting](troubleshooting.md) for error-code details and retry guidance.
