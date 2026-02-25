/**
 * Test configuration helper.
 *
 * Loads Gally connection settings from environment variables or .env.test file.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { Configuration } from '../src/index';

// Load .env.test from the project root
config({ path: resolve(__dirname, '..', '.env.test') });

export function getTestConfiguration(): Configuration {
  const baseUri = process.env['GALLY_BASE_URI'];
  const user = process.env['GALLY_USER'];
  const password = process.env['GALLY_PASSWORD'];
  const checkSSL = process.env['GALLY_CHECK_SSL'] !== 'false';

  if (!baseUri || !user || !password) {
    throw new Error(
      'Missing Gally test configuration. ' +
        'Please create a .env.test file from .env.test.example with your Gally instance settings.\n' +
        'Required: GALLY_BASE_URI, GALLY_USER, GALLY_PASSWORD',
    );
  }

  return new Configuration({ baseUri, user, password, checkSSL });
}

/**
 * Check if the Gally test instance is reachable.
 * Skips the test suite if the instance is not available.
 */
export async function checkGallyAvailability(): Promise<boolean> {
  try {
    const conf = getTestConfiguration();

    // Temporarily disable SSL verification for the availability check
    // when checkSSL is false (self-signed certificates)
    const previousTlsSetting = process.env['NODE_TLS_REJECT_UNAUTHORIZED'];
    if (!conf.getCheckSSL()) {
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    }

    const url = conf.getBaseUri().replace(/\/+$/, '') + '/';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return response.ok || response.status === 301 || response.status === 401;
    } finally {
      clearTimeout(timeout);
      // Restore previous setting
      if (previousTlsSetting === undefined) {
        delete process.env['NODE_TLS_REJECT_UNAUTHORIZED'];
      } else {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = previousTlsSetting;
      }
    }
  } catch {
    return false;
  }
}
