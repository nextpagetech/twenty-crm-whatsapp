# Workflow Usage

## Add the action

1. Open a workflow in Twenty.
2. Add an action.
3. Select **WhatsApp**.
4. Choose `SEND_TEXT` or `SEND_TEMPLATE`.
5. Map static values or Twenty workflow fields.
6. Test the workflow before activation.

## `SEND_TEXT`

Use `SEND_TEXT` for free-form text messages when allowed by WhatsApp Business messaging rules.

Typical mapping:

```text
Operation: SEND_TEXT
Recipient phone number: Person > Phones
Text message: Hello {{Person.name}}
Preview links: false
```

Twenty phone-field objects are supported; the action extracts and normalizes the primary phone number.

## `SEND_TEMPLATE`

Use `SEND_TEMPLATE` for an approved Meta template.

Typical mapping:

```text
Operation: SEND_TEMPLATE
Recipient phone number: Person > Phones
Template name: appointment_reminder
Language code: en_US
Body parameters:
  1. Person > Name
  2. Meeting > Start Date
```

Template parameters are positional. Their order must match the approved Meta template.

## Buttons

For a URL button:

```text
Template button subtype: URL
Template button index: 0
Template button parameter type: TEXT
```

For a quick-reply button:

```text
Template button subtype: QUICK_REPLY
Template button index: 0
Template button parameter type: PAYLOAD
```

## Successful output

Example:

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

Use `success` and `messageId` when the next workflow step needs to branch on provider acceptance or store the provider reference.

## Error behavior

With `continueOnError=false`, validation/provider failures stop the action by throwing.

With `continueOnError=true`, the workflow receives a structured failure object and can branch on values such as:

```text
success
errorCode
httpStatus
retryable
providerErrorType
providerErrorSubcode
providerTraceId
```

Example:

```json
{
  "success": false,
  "acceptedByMeta": false,
  "provider": "meta",
  "operation": "SEND_TEXT",
  "errorCode": "WHATSAPP_NOT_CONFIGURED",
  "errorMessage": "WhatsApp is not configured. Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in the app settings.",
  "retryable": false
}
```

This is useful for controlled retry, fallback, alerting or exception workflows.

## Delivery semantics

`acceptedByMeta=true` means Meta accepted the API request and returned a message ID. Do not treat it as final delivered/read confirmation.

See [Configuration](configuration.md) for the complete response contract and [Troubleshooting](troubleshooting.md) for the error catalogue.
