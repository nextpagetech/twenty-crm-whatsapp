/**
 * WhatsApp Workflow for Twenty CRM
 * Developed and maintained by Next Page Technologies Pvt. Ltd.
 * Copyright (c) 2026 Next Page Technologies Pvt. Ltd.
 * Website: https://www.nextpagetechnologies.com
 * Support & Customization: hello@nextpagetechnologies.com
 * SPDX-License-Identifier: Apache-2.0
 */

import { WhatsAppNodeError, isRetryableHttpStatus } from 'src/core/errors';
import {
  type ProviderSendResult,
  type SendTemplateRequest,
  type SendTextRequest,
} from 'src/core/types';
import { type WhatsAppProvider } from 'src/providers/provider';
import { buildMetaTemplateComponents } from 'src/providers/meta/meta-template-builder';
import { type MetaMessageResponse } from 'src/providers/meta/meta-types';

type MetaProviderConfig = {
  accessToken: string;
  phoneNumberId: string;
  apiVersion: string;
};

const getMetaConfig = (): MetaProviderConfig => {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const apiVersion = process.env.WHATSAPP_API_VERSION?.trim() || 'v23.0';

  if (!accessToken || !phoneNumberId) {
    throw new WhatsAppNodeError(
      'WhatsApp is not configured. Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in the app settings.',
      { errorCode: 'WHATSAPP_NOT_CONFIGURED' },
    );
  }

  if (!/^v\d+\.\d+$/.test(apiVersion)) {
    throw new WhatsAppNodeError('WHATSAPP_API_VERSION must look like v23.0', {
      errorCode: 'INVALID_API_VERSION',
    });
  }

  return { accessToken, phoneNumberId, apiVersion };
};

const parseMetaResponse = async (response: Response): Promise<MetaMessageResponse> => {
  const rawBody = await response.text();
  if (rawBody.trim().length === 0) return {};

  try {
    return JSON.parse(rawBody) as MetaMessageResponse;
  } catch {
    throw new WhatsAppNodeError(
      `Meta WhatsApp API returned a non-JSON response (HTTP ${response.status})`,
      {
        errorCode: 'META_INVALID_RESPONSE',
        httpStatus: response.status,
        retryable: isRetryableHttpStatus(response.status),
      },
    );
  }
};

export class MetaWhatsAppProvider implements WhatsAppProvider {
  readonly name = 'meta';

  private readonly config: MetaProviderConfig;

  constructor(config: MetaProviderConfig = getMetaConfig()) {
    this.config = config;
  }

  async sendText(request: SendTextRequest): Promise<ProviderSendResult> {
    return this.sendPayload({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: request.recipientPhoneNumber,
      type: 'text',
      text: {
        preview_url: request.previewUrl,
        body: request.messageBody,
      },
    });
  }

  async sendTemplate(request: SendTemplateRequest): Promise<ProviderSendResult> {
    const components = buildMetaTemplateComponents(request);

    return this.sendPayload({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: request.recipientPhoneNumber,
      type: 'template',
      template: {
        name: request.templateName,
        language: { code: request.languageCode },
        components: components.length > 0 ? components : undefined,
      },
    });
  }

  private async sendPayload(
    payload: Record<string, unknown>,
  ): Promise<ProviderSendResult> {
    const response = await fetch(
      `https://graph.facebook.com/${this.config.apiVersion}/${this.config.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15_000),
      },
    );

    const data = await parseMetaResponse(response);

    if (!response.ok) {
      throw new WhatsAppNodeError(
        data.error?.message || `Meta WhatsApp API returned HTTP ${response.status}`,
        {
          errorCode: data.error?.code ? String(data.error.code) : 'META_API_ERROR',
          httpStatus: response.status,
          retryable: isRetryableHttpStatus(response.status),
          providerErrorType: data.error?.type,
          providerErrorSubcode: data.error?.error_subcode,
          providerTraceId: data.error?.fbtrace_id,
        },
      );
    }

    const messageId = data.messages?.[0]?.id;
    if (!messageId) {
      throw new WhatsAppNodeError(
        'Meta accepted the request but did not return a WhatsApp message ID',
        { errorCode: 'MISSING_MESSAGE_ID' },
      );
    }

    const requestedRecipient = String(payload.to ?? '');

    return {
      messageId,
      recipientPhoneNumber: data.contacts?.[0]?.wa_id ?? requestedRecipient,
      providerStatus: data.messages?.[0]?.message_status,
    };
  }
}
