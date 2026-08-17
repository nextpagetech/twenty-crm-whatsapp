# Example: Dynamic Template Variables

Assume the approved template body is conceptually:

```text
Hello {{1}}, your quotation {{2}} is ready for {{3}}.
```

Map workflow fields in the same positional order:

```text
Operation: SEND_TEMPLATE
Template name: quotation_ready
Language code: en_US
Body parameters:
  1. Person > Name
  2. Quotation > Number
  3. Quotation > Total Amount
```

Numeric and boolean workflow values are converted to text automatically.

If any required dynamic value resolves to empty/null, the integration raises `EMPTY_TEMPLATE_PARAMETER` rather than sending an invalid payload to Meta.

For URL or quick-reply button variables, configure the button subtype, zero-based button index, parameter type and parameter values exactly as defined by the approved Meta template.
