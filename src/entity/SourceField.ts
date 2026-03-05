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
import { Metadata } from './Metadata';

export enum SourceFieldType {
  TEXT = 'text',
  KEYWORD = 'keyword',
  SELECT = 'select',
  INT = 'int',
  BOOLEAN = 'boolean',
  FLOAT = 'float',
  PRICE = 'price',
  STOCK = 'stock',
  CATEGORY = 'category',
  REFERENCE = 'reference',
  IMAGE = 'image',
  OBJECT = 'object',
  DATE = 'date',
  LOCATION = 'location',
}

export class SourceField extends AbstractEntity {
  private readonly metadata: Metadata;
  private readonly code: string;
  private readonly type: string;
  private readonly defaultLabel: string;
  private readonly labels: Label[];
  private readonly isSystemField: boolean;

  static readonly ENTITY_CODE = 'source_fields';

  constructor(
    metadata: Metadata,
    code: string,
    type: string,
    defaultLabel: string,
    labels: Label[],
    isSystem = false,
    uri?: string,
  ) {
    super();
    this.metadata = metadata;
    this.code = code;
    this.type = type;
    this.defaultLabel = defaultLabel;
    this.labels = labels;
    this.isSystemField = isSystem;
    this.uri = uri;
  }

  getEntityCode(): string {
    return SourceField.ENTITY_CODE;
  }

  getMetadata(): Metadata {
    return this.metadata;
  }

  getCode(): string {
    return this.code;
  }

  getType(): string {
    return this.type;
  }

  getDefaultLabel(): string {
    return this.defaultLabel;
  }

  getLabels(): Label[] {
    return this.labels;
  }

  isSystem(): boolean {
    return this.isSystemField;
  }

  toJson(): Record<string, any> {
    const data: Record<string, any> = {
      metadata: this.getMetadata().toString(),
      code: this.getCode(),
      type: this.getType(),
      defaultLabel: this.getDefaultLabel(),
      labels: this.getLabels().map((label) => label.toJson()),
    };

    if (this.isSystemField) {
      data['isUsedForRules'] = true;
      data['isSystem'] = true;
    }

    if (this.getUri()) {
      data['@id'] = this.getUri();
    }

    return data;
  }
}
