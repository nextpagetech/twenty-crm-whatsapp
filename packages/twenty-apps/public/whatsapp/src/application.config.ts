/**
 * WhatsApp Workflow for Twenty CRM
 * Developed and maintained by Next Page Technologies Pvt. Ltd.
 * Copyright (c) 2026 Next Page Technologies Pvt. Ltd.
 * Website: https://www.nextpagetechnologies.com
 * Support & Customization: hello@nextpagetechnologies.com
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineApplication } from 'twenty-sdk/define';

import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  WHATSAPP_ACCESS_TOKEN_VARIABLE_UNIVERSAL_IDENTIFIER,
  WHATSAPP_API_VERSION_VARIABLE_UNIVERSAL_IDENTIFIER,
  WHATSAPP_PHONE_NUMBER_ID_VARIABLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'WhatsApp for Twenty',
  description:
    'Open-source WhatsApp Business workflow actions for sending text and approved template messages.',
  author: 'Next Page Technologies Pvt. Ltd.',
  category: 'Communication',
  websiteUrl: 'https://www.nextpagetechnologies.com',
  issueReportUrl: 'https://github.com/nextpagetech/twentycrm-npt/issues',
  emailSupport: 'hello@nextpagetechnologies.com',
  applicationVariables: {
    WHATSAPP_ACCESS_TOKEN: {
      universalIdentifier: WHATSAPP_ACCESS_TOKEN_VARIABLE_UNIVERSAL_IDENTIFIER,
      description: 'Meta WhatsApp Cloud API access token.',
      isSecret: true,
    },
    WHATSAPP_PHONE_NUMBER_ID: {
      universalIdentifier: WHATSAPP_PHONE_NUMBER_ID_VARIABLE_UNIVERSAL_IDENTIFIER,
      description: 'Meta WhatsApp phone number ID used to send messages.',
      isSecret: false,
    },
    WHATSAPP_API_VERSION: {
      universalIdentifier: WHATSAPP_API_VERSION_VARIABLE_UNIVERSAL_IDENTIFIER,
      description: 'Meta Graph API version, for example v23.0.',
      isSecret: false,
    },
  },
});
