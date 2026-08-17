# Installation

## Status

The app is currently developed inside `packages/twenty-apps/public/whatsapp` in the `twentycrm-npt` repository. It is not yet treated as the canonical standalone distribution. The dedicated `twenty-whatsapp` repository will become canonical after hardening and runtime verification are complete.

The package declares Twenty `>=2.16.0`. Treat that as the compatibility floor, not as a claim that every later Twenty release has been runtime-verified.

## Requirements

- Twenty CRM with application and logic-function support
- Node.js `24.5+`
- Yarn `4+`
- Meta developer account with WhatsApp Business configured
- WhatsApp Cloud API access token
- WhatsApp phone number ID

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

After the app is synced/installed, configure the required application variables in Twenty before executing the workflow action.

## Production guidance

Do not use development credentials in production. Use a dedicated Meta system-user token with only the permissions required for the WhatsApp account, store it only as a secret application variable, and rotate it according to your credential policy.

Before production use, validate the app against the exact Twenty version you deploy and run at least one real `SEND_TEXT` and `SEND_TEMPLATE` workflow test.

## Next steps

Continue with [Meta WhatsApp setup](meta-whatsapp-setup.md) and [Configuration](configuration.md).
