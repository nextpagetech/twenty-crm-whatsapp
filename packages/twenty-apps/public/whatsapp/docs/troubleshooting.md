# Troubleshooting

When `continueOnError=false` or is omitted, validation/provider failures are thrown. When `continueOnError=true`, the workflow receives a structured failure object containing `success=false`, `errorCode`, `errorMessage`, `retryable` and any available HTTP/provider diagnostics.

## Error catalogue

| Error code | Meaning | Typical action |
| --- | --- | --- |
| `WHATSAPP_NOT_CONFIGURED` | Access token or phone number ID is missing | Configure `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` in the installed app settings |
| `INVALID_API_VERSION` | `WHATSAPP_API_VERSION` does not match a value such as `v23.0` | Correct the configured Meta Graph API version |
| `INVALID_RECIPIENT` | Recipient could not be normalized to 7–15 international digits | Check the mapped phone value and country calling code |
| `MISSING_TEXT_MESSAGE` | `SEND_TEXT` resolved an empty/invalid message body | Check static text or dynamic workflow mappings |
| `MISSING_TEMPLATE_NAME` | `SEND_TEMPLATE` resolved an empty/invalid template name | Supply the approved Meta template name |
| `MISSING_LANGUAGE_CODE` | A provided template language code resolved empty/invalid | Remove the empty override to use `en_US`, or provide a valid approved language code |
| `EMPTY_TEMPLATE_PARAMETER` | Header/body/button parameter resolved empty/invalid | Check every mapped positional parameter |
| `INVALID_BUTTON_INDEX` | Template button index is not a non-negative whole number | Use `0`, `1`, etc. according to the approved template |
| `INVALID_BUTTON_PARAMETER_TYPE` | Button subtype and parameter type do not match | Use `TEXT` for URL buttons and `PAYLOAD` for quick replies |
| `META_INVALID_RESPONSE` | Meta or an upstream intermediary returned a non-JSON response | Inspect HTTP status, API availability, proxy/network behavior and API version |
| `MISSING_MESSAGE_ID` | Meta returned a successful HTTP response without a WhatsApp message ID | Treat the send as unsuccessful and investigate the provider response |
| `META_API_ERROR` | Meta returned an error without a numeric Meta error code | Inspect `httpStatus` and provider diagnostics |
| Meta numeric code as string | Meta returned an error containing its own numeric error code | Use the returned `errorMessage`, type, subcode and trace ID with Meta documentation/support |
| `WHATSAPP_REQUEST_FAILED` | A non-provider-specific request/runtime failure occurred | Inspect the error message and network/runtime conditions |

## Example structured failure

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

## Meta provider diagnostics

When Meta supplies them, structured failures may include:

- `httpStatus`
- `providerErrorType`
- `providerErrorSubcode`
- `providerTraceId`

Sanitize provider diagnostics before posting publicly if they contain customer context.

## Retry behavior

The implementation marks these HTTP statuses as retryable:

- HTTP `408`
- HTTP `429`
- HTTP `5xx`

Timeout/abort errors are also marked retryable when they surface through the generic request-failure path.

`retryable=true` is guidance for controlled workflow retry logic, not a command to retry indefinitely. Use retry limits and backoff appropriate to your workflow and Meta rate limits.

## Meta template errors

Meta may reject a send if the template name, language, parameter count/order or button configuration does not match the approved template. Confirm the exact approved template definition in Meta before changing the integration code.

## Timeouts/network failures

The Meta request uses a 15-second abort timeout. Network failures may surface as `WHATSAPP_REQUEST_FAILED`; timeout/abort errors are marked retryable when returned through `continueOnError`.

## Delivery vs acceptance

A successful action means Meta accepted the API request and returned a message ID. It does not guarantee the recipient received or read the message. Delivery/read status handling requires webhooks, which are not currently implemented.

## Do not expose credentials

Never paste access tokens into GitHub Issues, screenshots, logs or examples. Security-sensitive reports should follow `SECURITY.md`.
