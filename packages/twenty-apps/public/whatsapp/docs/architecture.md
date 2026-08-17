# Architecture

## Design goal

Keep the Twenty workflow contract stable while isolating provider-specific authentication, payloads, responses and errors.

```text
Twenty Workflow
      |
      v
Logic Function / Workflow Action
      |
      v
WhatsApp Handler
      |
      v
WhatsAppProvider interface
      |
      +---- MetaWhatsAppProvider
      |
      +---- TwilioWhatsAppProvider (future)
      +---- Other providers (future)
```

## Source layout

```text
src/
├── application.config.ts
├── constants/
├── core/
│   ├── errors.ts
│   ├── normalization.ts
│   └── types.ts
├── logic-functions/
├── providers/
│   ├── provider.ts
│   └── meta/
└── roles/
```

## Responsibilities

### Workflow layer

Owns the Twenty-facing input/output contract and selects the operation. It should remain provider-neutral wherever practical.

### Core layer

Owns shared types, phone/value normalization and structured errors.

### Provider interface

`WhatsAppProvider` defines the provider capabilities used by the workflow handler. New providers should implement this contract rather than adding conditionals throughout the handler.

### Meta provider

Owns Meta configuration, Graph API endpoint construction, request payloads, template components, response parsing and Meta-specific diagnostics.

## Security boundary

The app role currently requests no CRM record access. Dynamic workflow values are provided by Twenty to the action. The provider receives only the values required for the outbound message.

`WHATSAPP_ACCESS_TOKEN` is configured as a secret application variable.

## Error model

Provider/validation failures are represented by structured fields including HTTP status and retryability. Meta-specific diagnostics are preserved when available without exposing the access token.

## Stable identifiers

Application, role, variable and workflow-action universal identifiers are persistent identities. Do not change them after public release without an explicit migration strategy.

## Adding providers

Provider-specific code belongs under:

```text
src/providers/<provider>/
```

A provider should own authentication, payload translation, response parsing and provider-specific errors. Avoid leaking provider-only settings into the common workflow schema unless unavoidable.
