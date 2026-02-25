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

export interface ConfigurationOptions {
  baseUri: string;
  checkSSL?: boolean;
  user: string;
  password: string;
}

export class Configuration {
  private readonly baseUri: string;
  private readonly checkSSL: boolean;
  private readonly user: string;
  private readonly password: string;

  constructor(options: ConfigurationOptions) {
    this.baseUri = options.baseUri;
    this.checkSSL = options.checkSSL ?? true;
    this.user = options.user;
    this.password = options.password;
  }

  getBaseUri(): string {
    return this.baseUri;
  }

  getCheckSSL(): boolean {
    return this.checkSSL;
  }

  getUser(): string {
    return this.user;
  }

  getPassword(): string {
    return this.password;
  }
}
