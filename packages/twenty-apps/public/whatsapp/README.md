# WhatsApp for Twenty CRM

Open-source WhatsApp Business workflow actions for Twenty CRM, developed and maintained by **Next Page Technologies Pvt. Ltd.**

The app currently supports the **Meta WhatsApp Cloud API** and adds a native WhatsApp workflow action for sending free-form text messages and approved template messages. The provider layer is separated so additional providers can be implemented later without coupling provider-specific HTTP behavior to the Twenty workflow contract.

## What it does

```text
Twenty Workflow
      |
      v
WhatsApp Action
      |
      +---- SEND_TEXT
      |
      +---- SEND_TEMPLATE
      |
      v
WhatsAppProvider interface
      |
      v
Meta WhatsApp Cloud API
      |
      v
Structured success/error output
      |
      v
Next Twenty workflow step
```

The integration lets a Twenty workflow send WhatsApp messages using static values or dynamic values resolved from Twenty records and previous workflow steps.

## Project metadata

| Item | Value |
| --- | --- |
| Package | `@nextpagetech/twenty-whatsapp` |
| Current version | `0.1.0` |
| Status | Pre-1.0 / active development |
| Repository | `nextpagetech/twenty-crm-whatsapp` |
| Maintainer | Next Page Technologies Pvt. Ltd. |
| Website | https://www.nextpagetechnologies.com |
| Support & customization | hello@nextpagetechnologies.com |
| WhatsApp / Phone | +91 8187030758 |
| Package license | Apache-2.0 |

## Features

- Native Twenty workflow action.
- Meta WhatsApp Cloud API provider.
- Send free-form text messages.
- Send approved templates with header, body and button parameters.
- URL and quick-reply template button parameters.
- Static values or dynamic Twenty workflow fields.
- Twenty phone-field object support.
- International phone-number normalization and validation.
- Structured provider errors with retryability information.
- Meta error code, type, subcode and trace ID when available.
- Optional `continueOnError` behavior.
- Provider abstraction prepared for future providers.

## Supported operations

| Operation | Purpose | Required values |
| --- | --- | --- |
| `SEND_TEXT` | Send a free-form text message when permitted by WhatsApp Business rules | Recipient phone number, message body |
| `SEND_TEMPLATE` | Send a Meta-approved WhatsApp template | Recipient phone number, template name |

## Current providers

| Provider | Status |
| --- | --- |
| Meta WhatsApp Cloud API | Supported |
| Twilio WhatsApp | Planned |
| 360dialog | Planned |
| Gupshup | Planned |

## Documentation

- [Installation](docs/installation.md)
- [Configuration](docs/configuration.md)
- [Meta WhatsApp setup](docs/meta-whatsapp-setup.md)
- [Workflow usage](docs/workflow-usage.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Architecture](docs/architecture.md)
- [Development](docs/development.md)
- [Examples](examples/README.md)

## Requirements

- Twenty CRM with app and logic-function support.
- Twenty `>=2.16.0` as the declared compatibility floor.
- Node.js `24.5+`.
- Yarn `4+`.
- Meta developer account and WhatsApp Business application.
- WhatsApp Cloud API access token.
- WhatsApp phone number ID.
- Approved Meta templates for template sends.

The Twenty version declaration is a compatibility floor, not a claim that every later release has been runtime-tested. Record the exact Twenty version used for production verification before release.

## Installation

From `packages/twenty-apps/public/whatsapp`:

```bash
corepack enable
yarn install --immutable
yarn lint
yarn typecheck
yarn test:unit
```

Connect the Twenty CLI to a development Twenty instance:

```bash
yarn twenty remote add --api-url https://your-twenty-server.example.com --as development
yarn twenty dev
```

For a one-time sync:

```bash
yarn twenty dev --once
```

After the app is synced/installed, open the installed app's application-variable settings in Twenty and configure the required Meta values before running a workflow.

See [Installation](docs/installation.md) for the full verification checklist.

## Configuration

Configure these Twenty application variables in the installed app's application-variable settings:

| Variable | Required | Secret | Description |
| --- | --- | --- | --- |
| `WHATSAPP_ACCESS_TOKEN` | Yes | Yes | Meta WhatsApp Cloud API access token. |
| `WHATSAPP_PHONE_NUMBER_ID` | Yes | No | Meta phone number ID used to send messages. |
| `WHATSAPP_API_VERSION` | No | No | Meta Graph API version. Defaults to `v23.0`. |

Never commit real access tokens, production IDs, customer phone numbers or production configuration.

See [Configuration](docs/configuration.md) and [Meta WhatsApp setup](docs/meta-whatsapp-setup.md) for details.

## Workflow usage

In Twenty:

1. Open a workflow.
2. Add an action.
3. Select **WhatsApp**.
4. Choose `SEND_TEXT` or `SEND_TEMPLATE`.
5. Map the recipient and message/template values.
6. Test with a Meta test recipient or another approved test setup.
7. Verify the structured action output.
8. Activate the workflow only after validation.

### `SEND_TEXT`

Required:

- Recipient phone number including country code.
- Message body.

Optional:

- Link preview.
- Continue workflow on error.

Free-form messaging remains subject to Meta's WhatsApp Business messaging-window and policy rules.

### `SEND_TEMPLATE`

Required:

- Recipient phone number including country code.
- Approved template name.

Optional:

- Language code; defaults to `en_US`.
- Header parameters.
- Body parameters.
- URL or quick-reply button parameters.
- Continue workflow on error.

Parameter order must match the approved Meta template.

For complete field behavior and examples, see [Workflow usage](docs/workflow-usage.md) and [Examples](examples/README.md).

## Success response

A successful send returns `success=true` and `acceptedByMeta=true` after Meta accepts the API request and returns a WhatsApp message ID.

Example:

```json
{
  "success": true,
  "acceptedByMeta": true,
  "provider": "meta",
  "operation": "SEND_TEXT",
  "messageId": "wamid.example-message-id",
  "recipientPhoneNumber": "918187030758",
  "providerStatus": "accepted"
}
```

For a template send, `templateName` is also returned.

`acceptedByMeta=true` does **not** mean delivered or read. Delivery/read confirmation requires webhook handling, which is not currently implemented.

## Error response

When `continueOnError=false` or is omitted, validation/provider failures are thrown and stop the action.

When `continueOnError=true`, the action returns `success=false` with structured error information instead of throwing.

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

Provider failures may additionally contain `httpStatus`, `providerErrorType`, `providerErrorSubcode` and `providerTraceId`.

See [Troubleshooting](docs/troubleshooting.md) for the error catalogue and retry guidance.

## Response contract

| Field | Type | When populated |
| --- | --- | --- |
| `success` | boolean | Always when a result object is returned |
| `acceptedByMeta` | boolean | Always when a result object is returned |
| `provider` | string | Always when a result object is returned; currently `meta` |
| `operation` | string | Always when a result object is returned |
| `messageId` | string | Successful provider acceptance |
| `recipientPhoneNumber` | string | Successful send; also on failures after recipient normalization succeeds |
| `providerStatus` | string | Successful send when Meta returns a message status |
| `templateName` | string | Template operation after template-name normalization succeeds |
| `errorCode` | string | Structured failure with `continueOnError=true` |
| `errorMessage` | string | Structured failure with `continueOnError=true` |
| `httpStatus` | number | Provider failure when an HTTP status is available |
| `retryable` | boolean | Structured failure with `continueOnError=true` |
| `providerErrorType` | string | Meta failure when supplied by Meta |
| `providerErrorSubcode` | number | Meta failure when supplied by Meta |
| `providerTraceId` | string | Meta failure when supplied by Meta |

## Architecture

```text
Twenty Workflow Action
        |
        v
WhatsApp Handler
        |
        v
WhatsAppProvider interface
        |
        +---- MetaWhatsAppProvider (current)
        |
        +---- future provider implementations
```

Provider-specific authentication, payloads, response parsing and errors remain inside provider implementations. The Twenty workflow contract should stay provider-neutral where practical. See [Architecture](docs/architecture.md).

## Developer workflow

Run the package quality gates before submitting changes:

```bash
yarn lint
yarn typecheck
yarn test:unit
```

When changing workflow schemas, dynamic field handling, application configuration or provider execution, also perform a real Twenty runtime test. See [Development](docs/development.md).

## Security

- The Meta access token is a secret Twenty application variable.
- Use a dedicated Meta system-user token with minimum required permissions.
- Rotate exposed or expired tokens immediately.
- Never log authorization headers or access tokens.
- Never publish real customer data in issues or examples.
- Report security issues privately as described in `SECURITY.md`.

## Current limitations

- Meta Cloud API only.
- No incoming webhook endpoint yet.
- No delivery/read-status webhook handling yet.
- No media/document/location sends yet.
- One configured Meta sender per app installation.

## Contributing

Contributions are welcome. Read `CONTRIBUTING.md` before opening a pull request. Good contribution areas include provider implementations, additional WhatsApp message types, tests, documentation and Twenty compatibility fixes.

Use GitHub Issues in `nextpagetech/twenty-crm-whatsapp` for reproducible bugs, feature requests and provider proposals that are not security-sensitive.

## Professional support & customization

For installation assistance, custom Twenty workflows, additional providers, WhatsApp Business integration, ERP/CRM integrations or project-specific customization:

**Next Page Technologies Pvt. Ltd.**  
Website: https://www.nextpagetechnologies.com  
Email: hello@nextpagetechnologies.com  
WhatsApp / Phone: +91 8187030758

## License and attribution

The independently authored WhatsApp app package is licensed under **Apache-2.0** as described by its package-local `LICENSE` file. The surrounding Twenty CRM repository contains upstream Twenty source under its own licensing terms; the entire repository must not be treated as Apache-2.0.

Twenty CRM is developed by Twenty. WhatsApp and Meta are trademarks of Meta Platforms, Inc. This integration is independently developed and maintained by Next Page Technologies Pvt. Ltd. and is not presented as an official Twenty or Meta product.
