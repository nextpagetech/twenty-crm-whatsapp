/**
 * WhatsApp Workflow for Twenty CRM
 * Developed and maintained by Next Page Technologies Pvt. Ltd.
 * Copyright (c) 2026 Next Page Technologies Pvt. Ltd.
 * Website: https://www.nextpagetechnologies.com
 * Support & Customization: hello@nextpagetechnologies.com
 * SPDX-License-Identifier: Apache-2.0
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { whatsappNodeHandler } from 'src/logic-functions/handlers/whatsapp-node-handler';

const createFetchResponse = ({
  ok,
  status,
  data,
  rawBody,
}: {
  ok: boolean;
  status: number;
  data?: unknown;
  rawBody?: string;
}) => ({
  ok,
  status,
  text: async () => rawBody ?? JSON.stringify(data ?? {}),
});

describe('whatsappNodeHandler', () => {
  beforeEach(() => {
    process.env.WHATSAPP_ACCESS_TOKEN = 'test-access-token';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '123456789';
    process.env.WHATSAPP_API_VERSION = 'v23.0';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;
    delete process.env.WHATSAPP_API_VERSION;
  });

  it('builds a text payload with link preview', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createFetchResponse({
        ok: true,
        status: 200,
        data: {
          contacts: [{ wa_id: '918885344518' }],
          messages: [{ id: 'wamid.text' }],
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      whatsappNodeHandler({
        operation: 'SEND_TEXT',
        recipientPhoneNumber: '+91 88853 44518',
        messageBody: 'Hello from Twenty',
        previewUrl: true,
      }),
    ).resolves.toMatchObject({
      success: true,
      acceptedByMeta: true,
      provider: 'meta',
      messageId: 'wamid.text',
    });

    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const payload = JSON.parse(String(request.body));
    expect(payload).toMatchObject({
      messaging_product: 'whatsapp',
      to: '918885344518',
      type: 'text',
      text: { preview_url: true, body: 'Hello from Twenty' },
    });
  });

  it('converts a dynamic numeric body parameter to text', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createFetchResponse({
        ok: true,
        status: 200,
        data: {
          contacts: [{ wa_id: '918885344518' }],
          messages: [{ id: 'wamid.body-parameter' }],
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await whatsappNodeHandler({
      operation: 'SEND_TEMPLATE',
      recipientPhoneNumber: '+91 88853 44518',
      templateName: 'welcome_customer',
      languageCode: 'en_US',
      templateBodyParameters: [45334],
    });

    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const payload = JSON.parse(String(request.body));
    expect(payload.template.components).toEqual([
      {
        type: 'body',
        parameters: [{ type: 'text', text: '45334' }],
      },
    ]);
  });

  it('builds body and URL button components for an OTP template', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createFetchResponse({
        ok: true,
        status: 200,
        data: {
          contacts: [{ wa_id: '918885344518' }],
          messages: [{ id: 'wamid.otp' }],
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await whatsappNodeHandler({
      operation: 'SEND_TEMPLATE',
      recipientPhoneNumber: '918885344518',
      templateName: 'otp_verification_1',
      languageCode: 'en',
      templateBodyParameters: [45334],
      templateButtonSubType: 'URL',
      templateButtonIndex: 0,
      templateButtonParameterType: 'TEXT',
      templateButtonParameters: [45334],
    });

    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const payload = JSON.parse(String(request.body));
    expect(payload.template.components).toHaveLength(2);
    expect(payload.template.components[1]).toEqual({
      type: 'button',
      sub_type: 'url',
      index: '0',
      parameters: [{ type: 'text', text: '45334' }],
    });
  });

  it('extracts a phone number from a dynamic Twenty phone-field object', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createFetchResponse({
        ok: true,
        status: 200,
        data: {
          contacts: [{ wa_id: '918885344518' }],
          messages: [{ id: 'wamid.phone-object' }],
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await whatsappNodeHandler({
      operation: 'SEND_TEMPLATE',
      recipientPhoneNumber: {
        primaryPhoneNumber: '8885344518',
        primaryPhoneCallingCode: '+91',
      },
      templateName: 'welcome_customer',
    });

    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const payload = JSON.parse(String(request.body));
    expect(payload.to).toBe('918885344518');
  });

  it('returns provider diagnostics for a structured Meta error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createFetchResponse({
        ok: false,
        status: 400,
        data: {
          error: {
            code: 131008,
            error_subcode: 2494010,
            type: 'OAuthException',
            fbtrace_id: 'trace-123',
            message: '(#131008) Required parameter is missing',
          },
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      whatsappNodeHandler({
        operation: 'SEND_TEMPLATE',
        recipientPhoneNumber: '918885344518',
        templateName: 'wrong_template_name',
        continueOnError: true,
      }),
    ).resolves.toMatchObject({
      success: false,
      errorCode: '131008',
      httpStatus: 400,
      retryable: false,
      providerErrorType: 'OAuthException',
      providerErrorSubcode: 2494010,
      providerTraceId: 'trace-123',
    });
  });

  it('marks HTTP 429 as retryable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createFetchResponse({
          ok: false,
          status: 429,
          data: { error: { code: 4, message: 'Rate limited' } },
        }),
      ),
    );

    await expect(
      whatsappNodeHandler({
        operation: 'SEND_TEXT',
        recipientPhoneNumber: '918885344518',
        messageBody: 'Hello',
        continueOnError: true,
      }),
    ).resolves.toMatchObject({ retryable: true, httpStatus: 429 });
  });

  it('returns a local validation error for an empty dynamic parameter', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      whatsappNodeHandler({
        operation: 'SEND_TEMPLATE',
        recipientPhoneNumber: '918885344518',
        templateName: 'welcome_customer',
        templateBodyParameters: [null],
        continueOnError: true,
      }),
    ).resolves.toMatchObject({
      success: false,
      errorCode: 'EMPTY_TEMPLATE_PARAMETER',
      retryable: false,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an invalid recipient before calling Meta', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      whatsappNodeHandler({
        operation: 'SEND_TEXT',
        recipientPhoneNumber: '123',
        messageBody: 'Hello',
        continueOnError: true,
      }),
    ).resolves.toMatchObject({
      success: false,
      errorCode: 'INVALID_RECIPIENT',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns not configured when credentials are absent', async () => {
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      whatsappNodeHandler({
        operation: 'SEND_TEXT',
        recipientPhoneNumber: '918885344518',
        messageBody: 'Hello',
        continueOnError: true,
      }),
    ).resolves.toMatchObject({
      success: false,
      errorCode: 'WHATSAPP_NOT_CONFIGURED',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an invalid Meta API version', async () => {
    process.env.WHATSAPP_API_VERSION = '23';
    vi.stubGlobal('fetch', vi.fn());

    await expect(
      whatsappNodeHandler({
        operation: 'SEND_TEXT',
        recipientPhoneNumber: '918885344518',
        messageBody: 'Hello',
        continueOnError: true,
      }),
    ).resolves.toMatchObject({
      success: false,
      errorCode: 'INVALID_API_VERSION',
    });
  });

  it('preserves the HTTP status when Meta returns non-JSON content', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createFetchResponse({ ok: false, status: 502, rawBody: '<html>Bad Gateway</html>' }),
      ),
    );

    await expect(
      whatsappNodeHandler({
        operation: 'SEND_TEXT',
        recipientPhoneNumber: '918885344518',
        messageBody: 'Hello',
        continueOnError: true,
      }),
    ).resolves.toMatchObject({
      success: false,
      errorCode: 'META_INVALID_RESPONSE',
      httpStatus: 502,
      retryable: true,
    });
  });

  it('fails successful responses that do not contain a message id', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createFetchResponse({ ok: true, status: 200, data: { messages: [{}] } }),
      ),
    );

    await expect(
      whatsappNodeHandler({
        operation: 'SEND_TEXT',
        recipientPhoneNumber: '918885344518',
        messageBody: 'Hello',
        continueOnError: true,
      }),
    ).resolves.toMatchObject({
      success: false,
      errorCode: 'MISSING_MESSAGE_ID',
    });
  });

  it('marks timeout failures as retryable when continue on error is enabled', async () => {
    const timeoutError = new Error('The operation timed out');
    timeoutError.name = 'TimeoutError';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(timeoutError));

    await expect(
      whatsappNodeHandler({
        operation: 'SEND_TEXT',
        recipientPhoneNumber: '918885344518',
        messageBody: 'Hello',
        continueOnError: true,
      }),
    ).resolves.toMatchObject({
      success: false,
      errorCode: 'WHATSAPP_REQUEST_FAILED',
      retryable: true,
    });
  });

  it('still throws when continue on error is disabled', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createFetchResponse({
          ok: false,
          status: 400,
          data: { error: { code: 132001, message: 'Template name does not exist' } },
        }),
      ),
    );

    await expect(
      whatsappNodeHandler({
        operation: 'SEND_TEMPLATE',
        recipientPhoneNumber: '918885344518',
        templateName: 'wrong_template_name',
      }),
    ).rejects.toThrow('Template name does not exist');
  });
});
