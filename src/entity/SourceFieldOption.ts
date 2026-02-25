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

import { AbstractEntity } from './AbstractEntity';
import { Label } from './Label';
import { SourceField } from './SourceField';

export class SourceFieldOption extends AbstractEntity {
  private sourceField: SourceField;
  private readonly code: string;
  private readonly position: number;
  private readonly defaultLabel: string;
  private readonly labels: Label[];

  static readonly ENTITY_CODE = 'source_field_options';

  constructor(
    sourceField: SourceField,
    code: string,
    position: number,
    defaultLabel: string,
    labels: Label[],
    uri?: string,
  ) {
    super();
    this.sourceField = sourceField;
    this.code = code;
    this.position = position;
    this.defaultLabel = defaultLabel;
    this.labels = labels;
    this.uri = uri;
  }

  getEntityCode(): string {
    return SourceFieldOption.ENTITY_CODE;
  }

  getSourceField(): SourceField {
    return this.sourceField;
  }

  setSourceField(sourceField: SourceField): void {
    this.sourceField = sourceField;
  }

  getCode(): string {
    return this.code;
  }

  getPosition(): number {
    return this.position;
  }

  getDefaultLabel(): string {
    return this.defaultLabel;
  }

  getLabels(): Label[] {
    return this.labels;
  }

  toJson(): Record<string, any> {
    return {
      sourceField: this.getSourceField().toString(),
      code: this.getCode(),
      position: this.getPosition(),
      defaultLabel: this.getDefaultLabel(),
      labels: this.getLabels().map((label) => label.toJson()),
    };
  }
}
