# Security Policy

## Reporting a vulnerability

Please report suspected security vulnerabilities privately to:

**hello@nextpagetechnologies.com**

Use the subject: `Security: Twenty WhatsApp`

Do not open a public GitHub issue for active credential exposure, authentication bypass, remote code execution, secret leakage or another vulnerability that could put users at immediate risk.

Include the affected version, Twenty version, reproduction steps, impact and any relevant sanitized logs. Never send live access tokens unless a secure exchange method has been explicitly agreed.

## Supported versions

Until the project reaches 1.0, security fixes are applied to the latest maintained release line.

## Secret handling

- Store WhatsApp provider tokens only in secret application variables.
- Do not log Authorization headers or tokens.
- Rotate any credential that may have been exposed.
- Use minimum provider permissions required for messaging.
