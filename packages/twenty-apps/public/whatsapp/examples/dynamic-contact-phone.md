# Example: Dynamic Twenty Contact Phone

The recipient can be mapped from a Twenty phone field instead of entering a static number.

Conceptual workflow mapping:

```text
Trigger: Person updated
      |
      v
WhatsApp
  Operation: SEND_TEXT
  Recipient phone number: Person > Phones
  Text message: Your profile was updated.
```

The handler supports a Twenty phone-field object containing values such as:

```text
primaryPhoneNumber: 8187030758
primaryPhoneCallingCode: +91
```

It normalizes that value to:

```text
918187030758
```

If the primary number is empty or invalid, the action returns/throws `INVALID_RECIPIENT` depending on `continueOnError`.
