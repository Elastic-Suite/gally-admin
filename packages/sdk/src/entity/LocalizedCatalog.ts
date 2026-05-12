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

import { AbstractEntity } from './AbstractEntity'
import { Catalog } from './Catalog'

export class LocalizedCatalog extends AbstractEntity {
  private readonly catalog: Catalog
  private readonly code: string
  private readonly name: string
  private readonly locale: string
  private readonly currency: string

  static readonly ENTITY_CODE = 'localized_catalogs'

  constructor(
    catalog: Catalog,
    code: string,
    name: string,
    locale: string,
    currency: string,
    uri?: string,
  ) {
    super()
    this.catalog = catalog
    this.code = code
    this.name = name
    this.locale = locale
    this.currency = currency
    this.uri = uri
  }

  getEntityCode(): string {
    return LocalizedCatalog.ENTITY_CODE
  }

  getCatalog(): Catalog {
    return this.catalog
  }

  getCode(): string {
    return this.code
  }

  getName(): string {
    return this.name
  }

  getLocale(): string {
    return this.locale
  }

  getCurrency(): string {
    return this.currency
  }

  toJson(): Record<string, string> {
    const jsonFields: Record<string, string> = {
      code: this.getCode(),
      name: this.getName(),
      locale: this.getLocale(),
      currency: this.getCurrency(),
      catalog: this.getCatalog().toString(),
    }

    if (this.getUri()) {
      jsonFields['@id'] = this.getUri()
    }

    return jsonFields
  }
}
