# Development

## Setup

From the package directory:

```bash
corepack enable
yarn install --immutable
```

Run the quality gates:

```bash
yarn lint
yarn typecheck
yarn test:unit
```

These checks are also executed by the WhatsApp GitHub Actions workflow when relevant files change.

## Twenty development server

Connect the Twenty CLI:

```bash
yarn twenty remote add --api-url https://your-twenty-server.example.com --as development
yarn twenty dev
```

For one sync:

```bash
yarn twenty dev --once
```

Use non-production Meta credentials for development testing.

## Engineering rules

- Keep provider-specific code in `src/providers/<provider>/`.
- Keep customer-specific business logic out of the generic integration.
- Preserve universal identifiers unless a migration is intentionally designed.
- Never commit credentials or real customer data.
- Add tests for bug fixes and new behavior.
- Preserve structured errors and retryability semantics.
- Update documentation for user-visible changes.

## Adding a provider

1. Create `src/providers/<provider>/`.
2. Implement `WhatsAppProvider`.
3. Keep provider authentication/configuration local to that provider.
4. Translate the shared send request into the provider payload.
5. Normalize the result into the shared `ProviderSendResult`.
6. Add provider-specific tests.
7. Add configuration/documentation without breaking existing Meta users.

Do not add provider selection to the workflow UI until the configuration model for multiple providers/accounts is deliberately designed.

## Pull-request checklist

Before opening a PR:

```bash
yarn lint
yarn typecheck
yarn test:unit
```

Also perform a Twenty runtime test when changing workflow schemas, app configuration, dynamic-field behavior or provider execution.

## Release readiness

Before a public release:

- CI must be green.
- Exact tested Twenty version(s) must be documented.
- `SEND_TEXT` must be runtime-tested.
- `SEND_TEMPLATE` must be runtime-tested.
- Dynamic phone and template parameter mappings must be runtime-tested.
- No credentials/customer data may exist in repository history intended for publication.
- README, changelog and compatibility information must match the released version.
