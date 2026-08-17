/**
 * WhatsApp Workflow for Twenty CRM
 * Developed and maintained by Next Page Technologies Pvt. Ltd.
 * Copyright (c) 2026 Next Page Technologies Pvt. Ltd.
 * Website: https://www.nextpagetechnologies.com
 * Support & Customization: hello@nextpagetechnologies.com
 * SPDX-License-Identifier: Apache-2.0
 */

import { WhatsAppNodeError } from 'src/core/errors';

export const normalizeScalarValue = (
  value: unknown,
  label: string,
  errorCode: string,
): string => {
  if (typeof value === 'string') {
    const normalized = value.trim();
    if (normalized.length > 0) return normalized;
  }

  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'boolean') return String(value);

  throw new WhatsAppNodeError(`${label} resolved to an empty or invalid value`, {
    errorCode,
  });
};

export const normalizeParameterArray = (
  value: unknown,
  label: string,
): string[] => {
  if (value === undefined || value === null) return [];

  // Twenty can resolve a single dynamic chip as a scalar even when the
  // workflow field is configured as an array. Treat it as a one-item list.
  const values = Array.isArray(value) ? value : [value];

  return values.map((item, index) =>
    normalizeScalarValue(
      item,
      `${label} ${index + 1}`,
      'EMPTY_TEMPLATE_PARAMETER',
    ),
  );
};

const getPhoneCandidate = (value: unknown): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new WhatsAppNodeError(
      'Recipient phone number resolved to an empty or invalid value',
      { errorCode: 'INVALID_RECIPIENT' },
    );
  }

  const phone = value as Record<string, unknown>;
  const primaryPhoneNumber = phone.primaryPhoneNumber;
  const primaryPhoneCallingCode = phone.primaryPhoneCallingCode;

  if (
    typeof primaryPhoneNumber === 'string' ||
    typeof primaryPhoneNumber === 'number'
  ) {
    const primary = String(primaryPhoneNumber).trim();
    const callingCode =
      typeof primaryPhoneCallingCode === 'string' ||
      typeof primaryPhoneCallingCode === 'number'
        ? String(primaryPhoneCallingCode).trim()
        : '';

    if (callingCode && !primary.startsWith('+')) {
      const callingDigits = callingCode.replace(/\D/g, '');
      const primaryDigits = primary.replace(/\D/g, '');
      if (callingDigits && !primaryDigits.startsWith(callingDigits)) {
        return `${callingDigits}${primaryDigits}`;
      }
    }

    return primary;
  }

  for (const key of ['phoneNumber', 'number', 'value']) {
    const candidate = phone[key];
    if (typeof candidate === 'string' || typeof candidate === 'number') {
      return String(candidate);
    }
  }

  throw new WhatsAppNodeError(
    'Recipient phone number object does not contain a primary phone number',
    { errorCode: 'INVALID_RECIPIENT' },
  );
};

export const normalizePhoneNumber = (value: unknown): string => {
  const normalized = getPhoneCandidate(value)
    .trim()
    .replace(/[\s()+.-]/g, '');

  if (!/^\d{7,15}$/.test(normalized)) {
    throw new WhatsAppNodeError(
      'Recipient phone number must contain 7 to 15 digits including country code',
      { errorCode: 'INVALID_RECIPIENT' },
    );
  }

  return normalized;
};

export const normalizeButtonIndex = (value: unknown): number => {
  if (value === undefined || value === null || value === '') return 0;

  const index = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(index) || index < 0) {
    throw new WhatsAppNodeError(
      'Template button index must be a non-negative whole number',
      { errorCode: 'INVALID_BUTTON_INDEX' },
    );
  }

  return index;
};
