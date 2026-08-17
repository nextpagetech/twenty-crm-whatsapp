/**
 * WhatsApp Workflow for Twenty CRM
 * Developed and maintained by Next Page Technologies Pvt. Ltd.
 * Copyright (c) 2026 Next Page Technologies Pvt. Ltd.
 * Website: https://www.nextpagetechnologies.com
 * Support & Customization: hello@nextpagetechnologies.com
 * SPDX-License-Identifier: Apache-2.0
 */

type WhatsAppNodeErrorOptions = {
  errorCode?: string;
  httpStatus?: number;
  retryable?: boolean;
  providerErrorType?: string;
  providerErrorSubcode?: number;
  providerTraceId?: string;
};

export class WhatsAppNodeError extends Error {
  errorCode?: string;
  httpStatus?: number;
  retryable: boolean;
  providerErrorType?: string;
  providerErrorSubcode?: number;
  providerTraceId?: string;

  constructor(message: string, options: WhatsAppNodeErrorOptions = {}) {
    super(message);
    this.name = WhatsAppNodeError.name;
    this.errorCode = options.errorCode;
    this.httpStatus = options.httpStatus;
    this.retryable = options.retryable ?? false;
    this.providerErrorType = options.providerErrorType;
    this.providerErrorSubcode = options.providerErrorSubcode;
    this.providerTraceId = options.providerTraceId;
  }
}

export const isRetryableHttpStatus = (status: number): boolean =>
  status === 408 || status === 429 || status >= 500;

export const toStructuredError = (error: unknown) => {
  if (error instanceof WhatsAppNodeError) {
    return {
      errorCode: error.errorCode,
      errorMessage: error.message,
      httpStatus: error.httpStatus,
      retryable: error.retryable,
      providerErrorType: error.providerErrorType,
      providerErrorSubcode: error.providerErrorSubcode,
      providerTraceId: error.providerTraceId,
    };
  }

  if (error instanceof Error) {
    return {
      errorCode: 'WHATSAPP_REQUEST_FAILED',
      errorMessage: error.message,
      httpStatus: undefined,
      retryable: error.name === 'AbortError' || error.name === 'TimeoutError',
      providerErrorType: undefined,
      providerErrorSubcode: undefined,
      providerTraceId: undefined,
    };
  }

  return {
    errorCode: 'WHATSAPP_REQUEST_FAILED',
    errorMessage: 'WhatsApp request failed',
    httpStatus: undefined,
    retryable: false,
    providerErrorType: undefined,
    providerErrorSubcode: undefined,
    providerTraceId: undefined,
  };
};
