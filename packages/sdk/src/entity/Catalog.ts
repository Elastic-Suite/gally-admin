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

export class Catalog extends AbstractEntity {
  private readonly code: string
  private readonly name: string

  static readonly ENTITY_CODE = 'catalogs'

  constructor(code: string, name: string, uri?: string) {
    super()
    this.code = code
    this.name = name
    this.uri = uri
  }

  getEntityCode(): string {
    return Catalog.ENTITY_CODE
  }

  getCode(): string {
    return this.code
  }

  getName(): string {
    return this.name
  }

  toJson(): Record<string, string> {
    const jsonFields: Record<string, string> = {
      code: this.getCode(),
      name: this.getName(),
    }

    if (this.getUri()) {
      jsonFields['@id'] = this.getUri()
    }

    return jsonFields
  }
}
