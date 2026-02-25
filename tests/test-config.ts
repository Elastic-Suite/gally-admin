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
    const url = conf.getBaseUri().replace(/\/+$/, '') + '/';
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok || response.status === 401;
  } catch {
    return false;
  }
}
