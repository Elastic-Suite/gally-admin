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

export class Label {
  private localizedCatalog: LocalizedCatalog;
  private readonly label: string;

  constructor(localizedCatalog: LocalizedCatalog, label: string) {
    this.localizedCatalog = localizedCatalog;
    this.label = label;
  }

  getLocalizedCatalog(): LocalizedCatalog {
    return this.localizedCatalog;
  }

  setLocalizedCatalog(localizedCatalog: LocalizedCatalog): void {
    this.localizedCatalog = localizedCatalog;
  }

  getLabel(): string {
    return this.label;
  }

  toJson(): Record<string, string> {
    return {
      localizedCatalog: this.getLocalizedCatalog().toString(),
      label: this.getLabel(),
    };
  }
}
