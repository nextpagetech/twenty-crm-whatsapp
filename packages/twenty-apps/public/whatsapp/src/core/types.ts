/**
 * WhatsApp Workflow for Twenty CRM
 * Developed and maintained by Next Page Technologies Pvt. Ltd.
 * Copyright (c) 2026 Next Page Technologies Pvt. Ltd.
 * Website: https://www.nextpagetechnologies.com
 * Support & Customization: hello@nextpagetechnologies.com
 * SPDX-License-Identifier: Apache-2.0
 */

export type WhatsAppOperation = 'SEND_TEXT' | 'SEND_TEMPLATE';

export type WhatsAppNodeInput = {
  operation: WhatsAppOperation;
  recipientPhoneNumber?: unknown;
  messageBody?: unknown;
  previewUrl?: boolean;
  templateName?: unknown;
  languageCode?: unknown;
  templateHeaderParameters?: unknown;
  templateBodyParameters?: unknown;
  templateButtonSubType?: 'URL' | 'QUICK_REPLY';
  templateButtonIndex?: unknown;
  templateButtonParameterType?: 'TEXT' | 'PAYLOAD';
  templateButtonParameters?: unknown;
  continueOnError?: boolean;
};

export type ProviderSendResult = {
  messageId: string;
  recipientPhoneNumber: string;
  providerStatus?: string;
};

export type SendTextRequest = {
  recipientPhoneNumber: string;
  messageBody: string;
  previewUrl: boolean;
};

export type SendTemplateRequest = {
  recipientPhoneNumber: string;
  templateName: string;
  languageCode: string;
  headerParameters: string[];
  bodyParameters: string[];
  buttonSubType: 'URL' | 'QUICK_REPLY';
  buttonIndex: number;
  buttonParameterType: 'TEXT' | 'PAYLOAD';
  buttonParameters: string[];
};
