# Contributing to Twenty CRM + WhatsApp

Thank you for contributing to this repository maintained by Next Page Technologies Pvt. Ltd.

## Before you start

- Use GitHub Issues for reproducible bugs and concrete feature requests.
- Use GitHub Discussions for questions, ideas, provider proposals, and general community support.
- Do not post secrets, access tokens, customer data, production IDs, or private phone numbers.
- Security-sensitive reports must follow `.github/SECURITY.md` and must not be opened publicly.

## Development

For WhatsApp integration changes, work from:

```text
packages/twenty-apps/public/whatsapp
```

Run:

```bash
corepack enable
yarn install --immutable
yarn lint
yarn typecheck
yarn test:unit
```

When workflow schemas, app configuration, dynamic-field behavior, or provider execution changes, also perform a real Twenty runtime test against a development instance.

## Pull requests

1. Create a branch from `main`.
2. Keep the change focused.
3. Add or update tests for behavior changes.
4. Update documentation and changelog entries when user-visible behavior changes.
5. Open a pull request into `main`.
6. Resolve review conversations and obtain the required approval before merge.

The protected `main` branch requires pull requests and review before merge.

## Licensing and attribution

This repository contains original Twenty CRM source under its existing licensing terms and independently authored WhatsApp integration code under the package-local Apache-2.0 license where applicable.

Do not remove or alter upstream Twenty copyright/license notices, and do not relicense Enterprise-marked files.

Contributions to the WhatsApp package should be compatible with its Apache-2.0 licensing. Contributions to other parts of the repository remain subject to the licensing terms applicable to those files.

## Upstream Twenty issues

If a problem is clearly reproducible in unmodified upstream Twenty, please also check the upstream Twenty project. Issues specific to this distribution or the WhatsApp integration belong in this repository.
