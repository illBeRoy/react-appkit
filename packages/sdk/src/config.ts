/**
 * @module config
 * Builder used to define app configuration. Should be used by the "app.config.ts" file in the app root.
 */

import type { AppConfig } from '@react-appkit/runtime/shared/config';

/**
 * Defines the app configuration.
 * @param config - The app configuration.
 * @returns An app configuration that can be used by the runtime.
 */
export const appConfig = (config: AppConfig) => {
  return config;
};
