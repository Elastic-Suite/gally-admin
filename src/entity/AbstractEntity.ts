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

/* eslint-disable @typescript-eslint/no-explicit-any */

export abstract class AbstractEntity {
  protected uri?: string;

  abstract getEntityCode(): string;

  getUri(): string {
    return this.uri ?? '';
  }

  setUri(uri: string): void {
    this.uri = uri;
  }

  toString(): string {
    return this.getUri();
  }

  abstract toJson(): Record<string, any>;
}
