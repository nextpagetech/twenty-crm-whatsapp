/**
 * WhatsApp Workflow for Twenty CRM
 * Developed and maintained by Next Page Technologies Pvt. Ltd.
 * Copyright (c) 2026 Next Page Technologies Pvt. Ltd.
 * Website: https://www.nextpagetechnologies.com
 * Support & Customization: hello@nextpagetechnologies.com
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineLogicFunction } from 'twenty-sdk/define';

import { WHATSAPP_WORKFLOW_NODE_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { whatsappNodeHandler } from 'src/logic-functions/handlers/whatsapp-node-handler';
import { whatsappNodeInputSchema } from 'src/logic-functions/schemas/whatsapp-node-input.schema';
import { jsonSchemaToInputSchema } from 'src/logic-functions/utils/json-schema-to-input-schema';

export default defineLogicFunction({
  universalIdentifier: WHATSAPP_WORKFLOW_NODE_UNIVERSAL_IDENTIFIER,
  name: 'whatsapp',
  description:
    'Send WhatsApp text or approved template messages from a Twenty workflow.',
  timeoutSeconds: 30,
  workflowActionTriggerSettings: {
    label: 'WhatsApp',
    icon: 'IconBrandWhatsapp',
    inputSchema: jsonSchemaToInputSchema(whatsappNodeInputSchema),
    outputSchema: [
      {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          acceptedByMeta: { type: 'boolean' },
          provider: { type: 'string' },
          operation: { type: 'string' },
          messageId: { type: 'string' },
          recipientPhoneNumber: { type: 'string' },
          providerStatus: { type: 'string' },
          templateName: { type: 'string' },
          errorCode: { type: 'string' },
          errorMessage: { type: 'string' },
          httpStatus: { type: 'number' },
          retryable: { type: 'boolean' },
          providerErrorType: { type: 'string' },
          providerErrorSubcode: { type: 'number' },
          providerTraceId: { type: 'string' },
        },
      },
    ],
  },
  handler: whatsappNodeHandler,
});
