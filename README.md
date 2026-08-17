# Twenty CRM + WhatsApp

Independent open-source distribution of Twenty CRM with a native WhatsApp Business workflow integration maintained by **Next Page Technologies Pvt. Ltd.**

This repository contains the Twenty CRM codebase together with the WhatsApp workflow app under `packages/twenty-apps/public/whatsapp`.

## WhatsApp integration

The WhatsApp app currently supports the **Meta WhatsApp Cloud API** and provides native Twenty workflow actions for:

- `SEND_TEXT` free-form text messages.
- `SEND_TEMPLATE` approved WhatsApp template messages.
- Static or dynamic Twenty workflow values.
- Twenty phone-field objects and international phone normalization.
- Header, body, URL-button and quick-reply template parameters.
- Structured success/error outputs with retryability and Meta diagnostics.

Functional and developer documentation:

- [WhatsApp app README](packages/twenty-apps/public/whatsapp/README.md)
- [Installation](packages/twenty-apps/public/whatsapp/docs/installation.md)
- [Configuration](packages/twenty-apps/public/whatsapp/docs/configuration.md)
- [Meta WhatsApp setup](packages/twenty-apps/public/whatsapp/docs/meta-whatsapp-setup.md)
- [Workflow usage](packages/twenty-apps/public/whatsapp/docs/workflow-usage.md)
- [Troubleshooting](packages/twenty-apps/public/whatsapp/docs/troubleshooting.md)
- [Architecture](packages/twenty-apps/public/whatsapp/docs/architecture.md)
- [Development](packages/twenty-apps/public/whatsapp/docs/development.md)
- [Examples](packages/twenty-apps/public/whatsapp/examples/README.md)

## Repository status

The WhatsApp package is currently version `0.1.0` and is pre-1.0. It declares Twenty `>=2.16.0` as its compatibility floor. That declaration is not a claim that every later Twenty release has been runtime-verified; exact runtime-tested versions should be recorded before a production release.

## Repository layout

```text
packages/twenty-apps/public/whatsapp/
├── src/                 WhatsApp workflow implementation
├── docs/                Functional and developer documentation
├── examples/            Usage examples
├── README.md            App overview and response contract
├── CONTRIBUTING.md
├── SECURITY.md
├── SUPPORT.md
├── ROADMAP.md
└── LICENSE              Apache-2.0 for the WhatsApp package
```

The remaining repository structure is the upstream Twenty CRM codebase.

## Twenty CRM

Twenty is an open-source CRM developed by the Twenty project. For core Twenty documentation, self-hosting, product usage and upstream development guidance, use the official Twenty resources:

- Project: https://github.com/twentyhq/twenty
- Website: https://twenty.com
- Documentation: https://docs.twenty.com

Changes to original Twenty source remain subject to the licensing and notices present in the Twenty codebase.

## Licensing and attribution

This repository contains code under more than one licensing context. **Do not treat the entire repository as Apache-2.0.**

- Original Twenty CRM source, assets and Enterprise-marked files retain their original Twenty licensing, copyright notices and restrictions.
- The independently authored WhatsApp app package includes its own Apache License 2.0 file and Next Page Technologies attribution where applicable.
- Twenty CRM is developed by Twenty.
- WhatsApp and Meta are trademarks of Meta Platforms, Inc.
- This distribution and WhatsApp integration are independently maintained by Next Page Technologies Pvt. Ltd. and are not presented as an official Twenty or Meta product.

See the root `LICENSE` and `packages/twenty-apps/public/whatsapp/LICENSE` before redistribution or modification.

## Support for the WhatsApp integration

**Next Page Technologies Pvt. Ltd.**  
Website: https://www.nextpagetechnologies.com  
Email: hello@nextpagetechnologies.com  
WhatsApp / Phone: +91 8187030758

For reproducible non-security issues, use this repository's GitHub Issues. For security-sensitive reports, follow the security guidance in the repository and WhatsApp package.
