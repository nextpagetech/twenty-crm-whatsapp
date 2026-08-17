/**
 * WhatsApp Workflow for Twenty CRM
 *
 * Developed and maintained by Next Page Technologies Pvt. Ltd.
 * Copyright (c) 2026 Next Page Technologies Pvt. Ltd.
 *
 * Website: https://www.nextpagetechnologies.com
 * Support & Customization: hello@nextpagetechnologies.com
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
