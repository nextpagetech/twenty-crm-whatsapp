/**
 * WhatsApp Workflow for Twenty CRM
 * Developed and maintained by Next Page Technologies Pvt. Ltd.
 * Copyright (c) 2026 Next Page Technologies Pvt. Ltd.
 * Website: https://www.nextpagetechnologies.com
 * Support & Customization: hello@nextpagetechnologies.com
 * SPDX-License-Identifier: Apache-2.0
 */

import { toStructuredError } from 'src/core/errors';
import {
  normalizeButtonIndex,
  normalizeParameterArray,
  normalizePhoneNumber,
  normalizeScalarValue,
} from 'src/core/normalization';
import { type WhatsAppNodeInput } from 'src/core/types';
import { MetaWhatsAppProvider } from 'src/providers/meta/meta-provider';

export const whatsappNodeHandler = async (parameters: WhatsAppNodeInput) => {
  let normalizedRecipientPhoneNumber: string | undefined;
  let normalizedTemplateName: string | undefined;

  try {
    const provider = new MetaWhatsAppProvider();
    normalizedRecipientPhoneNumber = normalizePhoneNumber(
      parameters.recipientPhoneNumber,
    );

    if (parameters.operation === 'SEND_TEXT') {
      const messageBody = normalizeScalarValue(
        parameters.messageBody,
        'Text message',
        'MISSING_TEXT_MESSAGE',
      );

      const result = await provider.sendText({
        recipientPhoneNumber: normalizedRecipientPhoneNumber,
        messageBody,
        previewUrl: parameters.previewUrl ?? false,
      });

      return {
        success: true,
        acceptedByMeta: true,
        provider: provider.name,
        operation: parameters.operation,
        ...result,
      };
    }

    normalizedTemplateName = normalizeScalarValue(
      parameters.templateName,
      'Template name',
      'MISSING_TEMPLATE_NAME',
    );
    const languageCode =
      parameters.languageCode === undefined || parameters.languageCode === null
        ? 'en_US'
        : normalizeScalarValue(
            parameters.languageCode,
            'Template language code',
            'MISSING_LANGUAGE_CODE',
          );
    const headerParameters = normalizeParameterArray(
      parameters.templateHeaderParameters,
      'Template header parameter',
    );
    const bodyParameters = normalizeParameterArray(
      parameters.templateBodyParameters,
      'Template body parameter',
    );
    const buttonParameters = normalizeParameterArray(
      parameters.templateButtonParameters,
      'Template button parameter',
    );
    const buttonSubType = parameters.templateButtonSubType ?? 'URL';
    const buttonParameterType =
      parameters.templateButtonParameterType ??
      (buttonSubType === 'QUICK_REPLY' ? 'PAYLOAD' : 'TEXT');

    const result = await provider.sendTemplate({
      recipientPhoneNumber: normalizedRecipientPhoneNumber,
      templateName: normalizedTemplateName,
      languageCode,
      headerParameters,
      bodyParameters,
      buttonSubType,
      buttonIndex: normalizeButtonIndex(parameters.templateButtonIndex),
      buttonParameterType,
      buttonParameters,
    });

    return {
      success: true,
      acceptedByMeta: true,
      provider: provider.name,
      operation: parameters.operation,
      templateName: normalizedTemplateName,
      ...result,
    };
  } catch (error) {
    if (!parameters.continueOnError) throw error;

    return {
      success: false,
      acceptedByMeta: false,
      provider: 'meta',
      operation: parameters.operation,
      recipientPhoneNumber: normalizedRecipientPhoneNumber,
      templateName: normalizedTemplateName,
      ...toStructuredError(error),
    };
  }
};
