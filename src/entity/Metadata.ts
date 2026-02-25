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

import { AbstractEntity } from './AbstractEntity';

export class Metadata extends AbstractEntity {
  private readonly entity: string;

  static readonly ENTITY_CODE = 'metadata';

  constructor(entity: string, uri?: string) {
    super();
    this.entity = entity;
    this.uri = uri;
  }

  getEntityCode(): string {
    return Metadata.ENTITY_CODE;
  }

  getEntity(): string {
    return this.entity;
  }

  toJson(): Record<string, string> {
    return { entity: this.getEntity() };
  }
}
