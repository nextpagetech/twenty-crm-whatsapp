/**
 * WhatsApp Workflow for Twenty CRM
 * Developed and maintained by Next Page Technologies Pvt. Ltd.
 * Copyright (c) 2026 Next Page Technologies Pvt. Ltd.
 * Website: https://www.nextpagetechnologies.com
 * Support & Customization: hello@nextpagetechnologies.com
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  type ProviderSendResult,
  type SendTemplateRequest,
  type SendTextRequest,
} from 'src/core/types';

export interface WhatsAppProvider {
  readonly name: string;
  sendText(request: SendTextRequest): Promise<ProviderSendResult>;
  sendTemplate(request: SendTemplateRequest): Promise<ProviderSendResult>;
}
