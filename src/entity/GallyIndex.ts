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

import { LocalizedCatalog } from './LocalizedCatalog';
import { Metadata } from './Metadata';

export class Index {
  private readonly metadata: Metadata;
  private readonly localizedCatalog: LocalizedCatalog;
  private name?: string;

  static readonly ENTITY_CODE = 'indices';

  constructor(
    metadata: Metadata,
    localizedCatalog: LocalizedCatalog,
    name?: string,
  ) {
    this.metadata = metadata;
    this.localizedCatalog = localizedCatalog;
    this.name = name;
  }

  getEntityCode(): string {
    return Index.ENTITY_CODE;
  }

  getMetadata(): Metadata {
    return this.metadata;
  }

  getLocalizedCatalog(): LocalizedCatalog {
    return this.localizedCatalog;
  }

  getName(): string | undefined {
    return this.name;
  }

  setName(name: string | undefined): void {
    this.name = name;
  }

  toJson(): Record<string, string> {
    const jsonFields: Record<string, string> = {
      entityType: this.getMetadata().getEntity(),
      localizedCatalog: this.getLocalizedCatalog().getCode(),
    };

    if (this.getName()) {
      jsonFields['name'] = this.getName()!;
    }

    return jsonFields;
  }
}
