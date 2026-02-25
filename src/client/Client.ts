/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2024-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

import { Configuration } from './Configuration';
import { TokenCacheManager } from './TokenCacheManager';

/* eslint-disable @typescript-eslint/no-explicit-any */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export class Client {
  private readonly configuration: Configuration;
  private readonly tokenCacheManager?: TokenCacheManager;
  private baseUrl: string;

  constructor(
    configuration: Configuration,
    tokenCacheManager?: TokenCacheManager,
  ) {
    this.configuration = configuration;
    this.tokenCacheManager = tokenCacheManager;
    this.baseUrl = configuration.getBaseUri().replace(/\/+$/, '') + '/';

    // Disable SSL certificate verification when checkSSL is false.
    // This is necessary for self-signed certificates (e.g. local dev environments).
    if (!configuration.getCheckSSL()) {
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    }
  }

  async get(
    endpoint: string,
    data: Record<string, any> = {},
    isPrivate = true,
  ): Promise<Record<string, any>> {
    return this.query('GET', endpoint, data, {}, isPrivate);
  }

  async post(
    endpoint: string,
    data: any = {},
    isPrivate = true,
  ): Promise<Record<string, any>> {
    return this.query('POST', endpoint, data, {}, isPrivate);
  }

  async put(
    endpoint: string,
    data: Record<string, any> = {},
    isPrivate = true,
  ): Promise<Record<string, any>> {
    return this.query('PUT', endpoint, data, {}, isPrivate);
  }

  async delete(
    endpoint: string,
    data: Record<string, any> = {},
    isPrivate = true,
  ): Promise<void> {
    await this.query('DELETE', endpoint, data, {}, isPrivate);
  }

  async patch(
    endpoint: string,
    data: Record<string, any> = {},
    isPrivate = true,
  ): Promise<Record<string, any>> {
    return this.query('PATCH', endpoint, data, {}, isPrivate);
  }

  async graphql(
    query: string,
    variables: Record<string, any> = {},
    headers: Record<string, string> = {},
    isPrivate = true,
  ): Promise<Record<string, any>> {
    const response = await this.query(
      'POST',
      'graphql',
      { query, variables },
      {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      isPrivate,
    );

    if (response['errors']) {
      const errors = response['errors'] as Array<{
        message: string;
        extensions?: { debugMessage?: string };
      }>;
      const error = errors[0];
      throw new Error(
        error?.extensions?.debugMessage ?? error?.message ?? 'GraphQL error',
      );
    }

    return response;
  }

  async query(
    method: HttpMethod,
    endpoint: string,
    data: any = {},
    headers: Record<string, string> = {},
    isPrivate = true,
  ): Promise<Record<string, any>> {
    const mergedHeaders: Record<string, string> = {
      Accept: 'application/ld+json',
      'Content-Type': 'application/ld+json',
      ...headers,
    };

    if (isPrivate) {
      const token = this.tokenCacheManager
        ? await this.tokenCacheManager.getToken(
            () => this.getAuthorizationToken(),
          )
        : await this.getAuthorizationToken();
      mergedHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
      return await this.executeRequest(method, endpoint, data, mergedHeaders);
    } catch (error: any) {
      // If we get a 401, try to generate a new token.
      if (isPrivate && error?.status === 401) {
        const token = this.tokenCacheManager
          ? await this.tokenCacheManager.getToken(
              () => this.getAuthorizationToken(),
              false,
            )
          : await this.getAuthorizationToken();
        mergedHeaders['Authorization'] = `Bearer ${token}`;

        return this.executeRequest(method, endpoint, data, mergedHeaders);
      }
      throw new Error(
        `An error happened when fetching the "${endpoint}" API endpoint.`,
        { cause: error },
      );
    }
  }

  async getAuthorizationToken(): Promise<string> {
    try {
      const url = new URL('authentication_token', this.baseUrl);
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          Accept: 'application/ld+json',
          'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify({
          email: this.configuration.getUser(),
          password: this.configuration.getPassword(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = (await response.json()) as { token: string };
      return json.token;
    } catch (error) {
      throw new Error(
        'An error happened when fetching the authentication token.',
        { cause: error },
      );
    }
  }

  private async executeRequest(
    method: HttpMethod,
    endpoint: string,
    data: any,
    headers: Record<string, string>,
  ): Promise<Record<string, any>> {
    let url: string;
    const fetchOptions: RequestInit = { method, headers };

    if (method === 'GET') {
      const queryString = new URLSearchParams(
        this.flattenParams(data),
      ).toString();
      url = new URL(
        queryString ? `${endpoint}?${queryString}` : endpoint,
        this.baseUrl,
      ).toString();
    } else {
      url = new URL(endpoint, this.baseUrl).toString();
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch {
        // ignore
      }
      const errorMessage = errorBody
        ? `HTTP ${response.status}: ${response.statusText} — ${errorBody}`
        : `HTTP ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    const responseBody = await response.text();
    if (responseBody === '') {
      return {};
    }

    return JSON.parse(responseBody) as Record<string, any>;
  }

  private flattenParams(
    data: Record<string, any>,
    prefix = '',
  ): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      const paramKey = prefix ? `${prefix}[${key}]` : key;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(result, this.flattenParams(value, paramKey));
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            Object.assign(result, this.flattenParams(item, `${paramKey}[${index}]`));
          } else {
            result[`${paramKey}[${index}]`] = String(item);
          }
        });
      } else {
        result[paramKey] = String(value);
      }
    }
    return result;
  }
}
