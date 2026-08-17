# Meta WhatsApp Cloud API Setup

This app currently uses the Meta WhatsApp Cloud API directly.

## 1. Prepare Meta Business and WhatsApp

Use a Meta business portfolio and developer application with WhatsApp configured. Add or connect the WhatsApp Business Account and sender phone number you intend to use.

For initial development, Meta-provided test resources can be used. For production, use the production WhatsApp Business Account and approved sender.

## 2. Obtain the phone number ID

The app requires the Meta **phone number ID**, not the visible WhatsApp phone number.

Store it in Twenty as:

```text
WHATSAPP_PHONE_NUMBER_ID
```

## 3. Create an access token

For production, prefer a dedicated Meta system-user token rather than a short-lived developer token. Grant only the permissions required for the WhatsApp account and sending use case.

Store the token in Twenty as the secret variable:

```text
WHATSAPP_ACCESS_TOKEN
```

Never put it in source code, screenshots, issues, logs or `.env` files committed to Git.

## 4. Set the Graph API version

The current implementation defaults to:

```text
v23.0
```

You can override it with:

```text
WHATSAPP_API_VERSION
```

The value must follow the format `v<major>.<minor>`, for example `v23.0`.

When Meta retires an API version, update this variable only after testing the app against the replacement version.

## 5. Configure templates

`SEND_TEMPLATE` requires a template already approved and available to the WhatsApp Business Account.

The following must match Meta exactly:

- template name
- language code
- header parameter order
- body parameter order
- button subtype/index/parameter type

## 6. Validate with a test workflow

Before production activation:

1. Send a basic text message to an allowed/test recipient.
2. Send a simple approved template with no dynamic parameters.
3. Test a template with dynamic parameters.
4. Confirm the returned `messageId`.
5. Confirm the message arrives on the recipient device.

A successful send response proves API acceptance only. Delivery/read status requires webhook handling, which is outside the current implementation.
