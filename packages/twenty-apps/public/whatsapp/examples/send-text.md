# Example: Send Text

Use this for a simple outbound text message.

```text
Operation: SEND_TEXT
Recipient phone number: 918187030758
Text message: Hello from Twenty CRM
Preview links: false
Continue workflow on error: true
```

Expected successful output includes:

```text
success: true
acceptedByMeta: true
provider: meta
messageId: <Meta message ID>
recipientPhoneNumber: 918187030758
```

Free-form messages remain subject to WhatsApp Business messaging rules and allowed messaging windows.
