/**
 * WhatsApp Workflow for Twenty CRM
 * Developed and maintained by Next Page Technologies Pvt. Ltd.
 * Copyright (c) 2026 Next Page Technologies Pvt. Ltd.
 * Website: https://www.nextpagetechnologies.com
 * Support & Customization: hello@nextpagetechnologies.com
 * SPDX-License-Identifier: Apache-2.0
 */

import { WhatsAppNodeError } from 'src/core/errors';
import { type SendTemplateRequest } from 'src/core/types';

export const buildMetaTemplateComponents = (
  request: SendTemplateRequest,
): Array<Record<string, unknown>> => {
  const components: Array<Record<string, unknown>> = [];

  if (request.headerParameters.length > 0) {
    components.push({
      type: 'header',
      parameters: request.headerParameters.map((text) => ({ type: 'text', text })),
    });
  }

  if (request.bodyParameters.length > 0) {
    components.push({
      type: 'body',
      parameters: request.bodyParameters.map((text) => ({ type: 'text', text })),
    });
  }

  if (request.buttonParameters.length > 0) {
    const expectedParameterType =
      request.buttonSubType === 'QUICK_REPLY' ? 'PAYLOAD' : 'TEXT';

    if (request.buttonParameterType !== expectedParameterType) {
      throw new WhatsAppNodeError(
        `${request.buttonSubType} buttons require ${expectedParameterType} parameters`,
        { errorCode: 'INVALID_BUTTON_PARAMETER_TYPE' },
      );
    }

    components.push({
      type: 'button',
      sub_type: request.buttonSubType.toLowerCase(),
      index: String(request.buttonIndex),
      parameters: request.buttonParameters.map((value) =>
        request.buttonParameterType === 'PAYLOAD'
          ? { type: 'payload', payload: value }
          : { type: 'text', text: value },
      ),
    });
  }

  return components;
};
