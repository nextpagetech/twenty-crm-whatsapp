# WhatsApp for Twenty CRM

Open-source WhatsApp Business workflow actions for Twenty CRM, developed and maintained by **Next Page Technologies Pvt. Ltd.**

The app currently supports the **Meta WhatsApp Cloud API** and adds a native WhatsApp workflow action for sending free-form text messages and approved template messages. The provider layer is intentionally separated so additional providers such as Twilio can be added later without changing the workflow contract.

## Project metadata

| Item | Value |
| --- | --- |
| Package | `@nextpagetech/twenty-whatsapp` |
| Current version | `0.1.0` |
| Status | Pre-1.0 / active development |
| Maintainer | Next Page Technologies Pvt. Ltd. |
| Website | https://www.nextpagetechnologies.com |
| Support & customization | hello@nextpagetechnologies.com |
| WhatsApp / Phone | +91 8187030758 |
| License | Apache-2.0 |

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
- Provider abstraction prepared for future Twilio/360dialog/Gupshup implementations.

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
- Twenty `>= 2.16.0` (declared compatibility floor; verify the exact deployed version before production use).
- Node.js `24.5+`.
- Yarn `4+`.
- Meta developer account and WhatsApp Business application.
- WhatsApp Cloud API access token.
- WhatsApp phone number ID.
- Approved Meta templates for template sends.

## Configuration

Configure these Twenty application variables:

| Variable | Required | Secret | Description |
| --- | --- | --- | --- |
| `WHATSAPP_ACCESS_TOKEN` | Yes | Yes | Meta WhatsApp Cloud API access token. |
| `WHATSAPP_PHONE_NUMBER_ID` | Yes | No | Meta phone number ID used to send messages. |
| `WHATSAPP_API_VERSION` | No | No | Meta Graph API version. Defaults to `v23.0`. |

Never commit real tokens, customer phone numbers or production configuration.

See [Configuration](docs/configuration.md) and [Meta WhatsApp setup](docs/meta-whatsapp-setup.md) for details.

## Local development

From this package directory:

```bash
corepack enable
yarn install --immutable
yarn lint
yarn typecheck
yarn test:unit
```

Connect the Twenty CLI to a development server:

```bash
yarn twenty remote add --api-url https://your-twenty-server.example.com --as development
yarn twenty dev
```

One-time sync:

```bash
yarn twenty dev --once
```

## Workflow usage

In Twenty:

1. Open a workflow.
2. Add an action.
3. Select **WhatsApp**.
4. Choose `SEND_TEXT` or `SEND_TEMPLATE`.
5. Map the recipient and message/template values.
6. Test with a Meta test recipient.
7. Activate the workflow after verifying the response.

For complete field behavior and examples, see [Workflow usage](docs/workflow-usage.md) and [Examples](examples/README.md).

### SEND_TEXT

Required:

- Recipient phone number including country code.
- Message body.

Optional:

- Link preview.
- Continue workflow on error.

Free-form messaging remains subject to Meta's WhatsApp Business messaging-window and policy rules.

### SEND_TEMPLATE

Required:

- Recipient phone number including country code.
- Approved template name.

Optional:

- Language code (defaults to `en_US`).
- Header parameters.
- Body parameters.
- URL or quick-reply button parameters.
- Continue workflow on error.

Parameter order must match the approved Meta template.

## Outputs

Successful sends can return:

- `success`
- `acceptedByMeta`
- `provider`
- `operation`
- `messageId`
- `recipientPhoneNumber`
- `providerStatus`
- `templateName`

When `continueOnError` is enabled, failures can additionally return:

- `errorCode`
- `errorMessage`
- `httpStatus`
- `retryable`
- `providerErrorType`
- `providerErrorSubcode`
- `providerTraceId`

A successful API response means Meta accepted the request. It does not guarantee final delivery. Delivery/read confirmation requires webhook handling, which is not yet implemented.

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
        +---- Twilio provider (planned)
        +---- other providers (planned)
```

Provider-specific payloads, response parsing and errors should remain inside provider implementations. The Twenty workflow contract should stay provider-neutral where practical. See [Architecture](docs/architecture.md).

## Security

- The Meta access token is a secret Twenty application variable.
- Use a dedicated Meta system-user token with minimum required permissions.
- Rotate exposed or expired tokens immediately.
- Never log authorization headers or access tokens.
- Report security issues privately as described in `SECURITY.md`.

## Current limitations

- Meta Cloud API only.
- No incoming webhook endpoint yet.
- No delivery/read-status webhook handling yet.
- No media/document/location sends yet.
- One configured Meta sender per app installation.

## Contributing

Contributions are welcome. Read `CONTRIBUTING.md` before opening a pull request. Good contribution areas include provider implementations, additional WhatsApp message types, tests, documentation and Twenty compatibility fixes.

While this app remains inside the Twenty monorepo, open provider proposals as regular GitHub issues. A dedicated provider-request issue template will be added at repository root after migration to the standalone `twenty-whatsapp` repository.

## Professional support & customization

For installation assistance, custom Twenty workflows, additional providers, WhatsApp Business integration, ERP/CRM integrations or project-specific customization:

**Next Page Technologies Pvt. Ltd.**  
Website: https://www.nextpagetechnologies.com  
Email: hello@nextpagetechnologies.com  
WhatsApp / Phone: +91 8187030758

Community bugs and feature requests should still be opened publicly through GitHub Issues whenever they are not security-sensitive.

## License and attribution

This WhatsApp app package is licensed under **Apache-2.0**. The surrounding `twentycrm-npt` repository contains Twenty CRM source code under its own licensing terms. This package will later be moved to its dedicated repository after the hardening and verification phase.

Twenty CRM is developed by Twenty. WhatsApp and Meta are trademarks of Meta Platforms, Inc. This integration is independently developed and maintained by Next Page Technologies Pvt. Ltd. and is not presented as an official Twenty or Meta product.
