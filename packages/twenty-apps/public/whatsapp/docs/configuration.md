# Configuration

## Application variables

Configure these variables in the Twenty application settings:

| Variable | Required | Secret | Purpose |
| --- | --- | --- | --- |
| `WHATSAPP_ACCESS_TOKEN` | Yes | Yes | Meta WhatsApp Cloud API access token |
| `WHATSAPP_PHONE_NUMBER_ID` | Yes | No | Sender phone number ID used by Meta |
| `WHATSAPP_API_VERSION` | No | No | Meta Graph API version; defaults to `v23.0` in the current implementation |

Never commit real credentials or production values.

## Workflow inputs

### Common

`operation` supports:

- `SEND_TEXT`
- `SEND_TEMPLATE`

`recipientPhoneNumber` accepts a complete international number or a Twenty phone-field object. The app normalizes supported phone values to digits-only international format and validates a length of 7 to 15 digits.

`continueOnError` controls failure behavior:

- `false` or omitted: the workflow action throws on failure.
- `true`: the action returns `success=false` with structured error details.

### SEND_TEXT

Required:

- `recipientPhoneNumber`
- `messageBody`

Optional:

- `previewUrl`
- `continueOnError`

### SEND_TEMPLATE

Required:

- `recipientPhoneNumber`
- `templateName`

Optional:

- `languageCode` — defaults to `en_US`
- `templateHeaderParameters`
- `templateBodyParameters`
- `templateButtonSubType` — `URL` or `QUICK_REPLY`
- `templateButtonIndex` — zero-based
- `templateButtonParameterType` — `TEXT` or `PAYLOAD`
- `templateButtonParameters`
- `continueOnError`

Parameter order must match the approved template definition in Meta.

## Outputs

Successful sends may return:

- `success`
- `acceptedByMeta`
- `provider`
- `operation`
- `messageId`
- `recipientPhoneNumber`
- `providerStatus`
- `templateName`

Structured failures may additionally return:

- `errorCode`
- `errorMessage`
- `httpStatus`
- `retryable`
- `providerErrorType`
- `providerErrorSubcode`
- `providerTraceId`

`acceptedByMeta=true` means Meta accepted the API request. It does not prove final delivery or read status.
