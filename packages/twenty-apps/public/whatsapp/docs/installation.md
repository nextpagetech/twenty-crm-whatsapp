# Installation

## Distribution status

The WhatsApp app is published in this repository at:

```text
packages/twenty-apps/public/whatsapp
```

Repository:

```text
https://github.com/nextpagetech/twenty-crm-whatsapp
```

The package is currently version `0.1.0` and pre-1.0.

The package declares Twenty `>=2.16.0`. Treat that as the compatibility floor, not as a claim that every later Twenty release has been runtime-verified.

## Requirements

- Twenty CRM with application and logic-function support.
- Node.js `24.5+`.
- Yarn `4+`.
- Meta developer account with WhatsApp Business configured.
- WhatsApp Cloud API access token.
- WhatsApp phone number ID.
- At least one approved Meta template for testing `SEND_TEMPLATE`.

## Development installation

From the WhatsApp package directory:

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

For a one-time sync:

```bash
yarn twenty dev --once
```

## Where to configure the app

After the app is synced or installed, open the installed app's application-variable settings in Twenty and configure:

- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_API_VERSION` when you need to override the default `v23.0`

The access token must be stored as the secret application variable provided by the app. Do not commit it to the repository or place it directly in workflow text fields.

Continue with [Meta WhatsApp setup](meta-whatsapp-setup.md) and [Configuration](configuration.md).

## Verify the installation

Before considering an installation ready, verify all of the following in the target Twenty instance:

1. The **WhatsApp** action appears in the workflow action picker.
2. `SEND_TEXT` can send a real test message.
3. A dynamic Twenty phone field resolves and normalizes correctly.
4. `SEND_TEMPLATE` can send an approved template.
5. Template body/header parameters resolve in the approved order.
6. Template button parameters work for the configured template when applicable.
7. `continueOnError=true` returns a structured failure object.
8. Invalid recipient input is rejected with `INVALID_RECIPIENT`.
9. Meta/provider failures expose structured diagnostics where available.
10. The action outputs can be consumed by the next Twenty workflow step.

## Compatibility record

| Item | Status |
| --- | --- |
| Declared Twenty compatibility floor | `>=2.16.0` |
| Package development dependency | `twenty-sdk ^2.16.0` |
| Exact production/runtime-tested Twenty release | Must be recorded after real-instance verification |

Do not convert the declared compatibility floor into a broader runtime-support claim until the exact deployed versions have been tested.

## Production guidance

- Do not use development credentials in production.
- Use a dedicated Meta system-user token with only the required permissions.
- Store the token only in the app's secret configuration.
- Rotate exposed or expired tokens according to your credential policy.
- Run at least one real `SEND_TEXT` and `SEND_TEMPLATE` test against the exact Twenty version you deploy.
- Confirm WhatsApp Business messaging and template policies for your use case.

## Next steps

- [Meta WhatsApp setup](meta-whatsapp-setup.md)
- [Configuration](configuration.md)
- [Workflow usage](workflow-usage.md)
- [Troubleshooting](troubleshooting.md)
