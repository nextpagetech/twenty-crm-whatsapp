# Example: Send Template

Assume Meta has approved a template named `appointment_reminder` in `en_US` with two body variables.

```text
Operation: SEND_TEMPLATE
Recipient phone number: +91 88853 44518
Template name: appointment_reminder
Language code: en_US
Body parameters:
  1. John
  2. 18 Aug 2026, 10:30 AM
Continue workflow on error: true
```

The parameter order must exactly match the approved Meta template.

Start with a template that has no buttons. Add button configuration only after the basic template succeeds.
