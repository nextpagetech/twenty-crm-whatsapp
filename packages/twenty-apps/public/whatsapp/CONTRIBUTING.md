# Contributing to WhatsApp for Twenty CRM

Thank you for contributing.

## Principles

- Keep the Twenty workflow contract stable and provider-neutral where practical.
- Keep Meta/Twilio/provider-specific code inside `src/providers/<provider>`.
- Do not introduce customer-specific business logic into the generic integration.
- Never commit credentials, production phone numbers or customer data.
- Add or update tests for behavior changes.

## Development setup

```bash
corepack enable
yarn install --immutable
yarn lint
yarn typecheck
yarn test:unit
```

For Twenty integration testing, configure a development remote and run:

```bash
yarn twenty dev
```

## Pull requests

Before submitting a PR:

1. Keep the change focused.
2. Add tests for new behavior or bug fixes.
3. Run lint, typecheck and unit tests.
4. Update README/CHANGELOG when user-visible behavior changes.
5. Do not change universal identifiers after a public release without an explicit migration plan.

Recommended PR title examples:

- `feat(meta): add media message support`
- `feat(twilio): add Twilio WhatsApp provider`
- `fix(meta): preserve API error diagnostics`
- `docs: clarify template button parameters`

## Adding a provider

Implement the `WhatsAppProvider` interface under `src/providers/<provider>/`. Provider implementations own provider-specific authentication, request payloads, response parsing and errors. Avoid adding provider-specific fields to the workflow contract unless they are essential.

## Reporting issues

Use GitHub Issues for reproducible bugs and feature requests. Include Twenty version, app version, provider, operation and sanitized error details. Never paste access tokens.

## Security issues

Do not open public issues for suspected credential exposure or exploitable vulnerabilities. Follow `SECURITY.md`.

## License

By contributing, you agree that your contribution may be distributed under the Apache License 2.0 applicable to this package.
