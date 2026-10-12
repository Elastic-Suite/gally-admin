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

export class RecommenderType extends AbstractEntity {
  private readonly name: string
  private readonly code: string

  static readonly ENTITY_CODE = 'recommender_types'

  constructor(name: string, code: string, uri?: string) {
    super()
    this.name = name
    this.code = code
    this.uri = uri
  }

  getEntityCode(): string {
    return RecommenderType.ENTITY_CODE
  }

  getName(): string {
    return this.name
  }

  getCode(): string {
    return this.code
  }

  toJson(): Record<string, string> {
    const jsonFields: Record<string, string> = {
      name: this.getName(),
      code: this.getCode(),
    }

    if (this.getUri()) {
      jsonFields['@id'] = this.getUri()
    }

    return jsonFields
  }
}
