/**
 * Sample data fixtures for integration tests.
 *
 * Provides realistic e-commerce data (catalogs, source fields, products)
 * to test the full SDK lifecycle against a real Gally instance.
 */

import {
  Catalog,
  Label,
  LocalizedCatalog,
  Metadata,
  SourceField,
  SourceFieldType,
  SourceFieldOption,
} from '../../src/index'

// ---------------------------------------------------------------------------
// Catalogs
// ---------------------------------------------------------------------------

export const sampleCatalog = new Catalog('sdk_test_shop', 'SDK Test Shop')

export const sampleLocalizedCatalogFr = new LocalizedCatalog(
  sampleCatalog,
  'sdk_test_shop_fr',
  'SDK Test Shop FR',
  'fr_FR',
  'EUR',
)

export const sampleLocalizedCatalogEn = new LocalizedCatalog(
  sampleCatalog,
  'sdk_test_shop_en',
  'SDK Test Shop EN',
  'en_US',
  'USD',
)

export const allLocalizedCatalogs = [
  sampleLocalizedCatalogFr,
  sampleLocalizedCatalogEn,
]

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const productMetadata = new Metadata('product')
export const categoryMetadata = new Metadata('category')

// ---------------------------------------------------------------------------
// Source Fields
// ---------------------------------------------------------------------------

export function createSampleSourceFields(): SourceField[] {
  return [
    new SourceField(productMetadata, 'name', SourceFieldType.TEXT, 'Name', [
      new Label(sampleLocalizedCatalogFr, 'Nom'),
      new Label(sampleLocalizedCatalogEn, 'Name'),
    ]),
    new SourceField(
      productMetadata,
      'description',
      SourceFieldType.TEXT,
      'Description',
      [
        new Label(sampleLocalizedCatalogFr, 'Description'),
        new Label(sampleLocalizedCatalogEn, 'Description'),
      ],
    ),
    new SourceField(productMetadata, 'sku', SourceFieldType.REFERENCE, 'SKU', [
      new Label(sampleLocalizedCatalogFr, 'SKU'),
      new Label(sampleLocalizedCatalogEn, 'SKU'),
    ]),
    new SourceField(productMetadata, 'brand', SourceFieldType.SELECT, 'Brand', [
      new Label(sampleLocalizedCatalogFr, 'Marque'),
      new Label(sampleLocalizedCatalogEn, 'Brand'),
    ]),
    new SourceField(productMetadata, 'color', SourceFieldType.SELECT, 'Color', [
      new Label(sampleLocalizedCatalogFr, 'Couleur'),
      new Label(sampleLocalizedCatalogEn, 'Color'),
    ]),
    new SourceField(productMetadata, 'size', SourceFieldType.KEYWORD, 'Size', [
      new Label(sampleLocalizedCatalogFr, 'Taille'),
      new Label(sampleLocalizedCatalogEn, 'Size'),
    ]),
    new SourceField(
      productMetadata,
      'is_active',
      SourceFieldType.BOOLEAN,
      'Active',
      [
        new Label(sampleLocalizedCatalogFr, 'Actif'),
        new Label(sampleLocalizedCatalogEn, 'Active'),
      ],
    ),
    new SourceField(
      productMetadata,
      'weight',
      SourceFieldType.FLOAT,
      'Weight',
      [
        new Label(sampleLocalizedCatalogFr, 'Poids'),
        new Label(sampleLocalizedCatalogEn, 'Weight'),
      ],
    ),
    new SourceField(productMetadata, 'image', SourceFieldType.IMAGE, 'Image', [
      new Label(sampleLocalizedCatalogFr, 'Image'),
      new Label(sampleLocalizedCatalogEn, 'Image'),
    ]),
  ]
}

// ---------------------------------------------------------------------------
// Source Field Options (for select fields like brand, color)
// ---------------------------------------------------------------------------

export function createSampleSourceFieldOptions(
  brandField: SourceField,
  colorField: SourceField,
): SourceFieldOption[] {
  return [
    // Brand options
    new SourceFieldOption(brandField, 'nike', 1, 'Nike', [
      new Label(sampleLocalizedCatalogFr, 'Nike'),
      new Label(sampleLocalizedCatalogEn, 'Nike'),
    ]),
    new SourceFieldOption(brandField, 'adidas', 2, 'Adidas', [
      new Label(sampleLocalizedCatalogFr, 'Adidas'),
      new Label(sampleLocalizedCatalogEn, 'Adidas'),
    ]),
    new SourceFieldOption(brandField, 'puma', 3, 'Puma', [
      new Label(sampleLocalizedCatalogFr, 'Puma'),
      new Label(sampleLocalizedCatalogEn, 'Puma'),
    ]),

    // Color options
    new SourceFieldOption(colorField, 'red', 1, 'Red', [
      new Label(sampleLocalizedCatalogFr, 'Rouge'),
      new Label(sampleLocalizedCatalogEn, 'Red'),
    ]),
    new SourceFieldOption(colorField, 'blue', 2, 'Blue', [
      new Label(sampleLocalizedCatalogFr, 'Bleu'),
      new Label(sampleLocalizedCatalogEn, 'Blue'),
    ]),
    new SourceFieldOption(colorField, 'black', 3, 'Black', [
      new Label(sampleLocalizedCatalogFr, 'Noir'),
      new Label(sampleLocalizedCatalogEn, 'Black'),
    ]),
    new SourceFieldOption(colorField, 'white', 4, 'White', [
      new Label(sampleLocalizedCatalogFr, 'Blanc'),
      new Label(sampleLocalizedCatalogEn, 'White'),
    ]),
  ]
}

// ---------------------------------------------------------------------------
// Sample Categories
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Category tree:
 *   cat_root (Root Category)
 *   ├── cat_shoes (Chaussures / Shoes)
 *   │   ├── cat_running (Running)
 *   │   ├── cat_sneakers (Sneakers / Baskets)
 *   │   └── cat_lifestyle (Lifestyle)
 */

export const sampleCategoriesFr: Record<string, any>[] = [
  {
    id: 'cat_root',
    parentId: '',
    path: 'cat_root',
    level: 1,
    name: 'Catégorie racine',
  },
  {
    id: 'cat_shoes',
    parentId: 'cat_root',
    path: 'cat_root/cat_shoes',
    level: 2,
    name: 'Chaussures',
  },
  {
    id: 'cat_running',
    parentId: 'cat_shoes',
    path: 'cat_root/cat_shoes/cat_running',
    level: 3,
    name: 'Running',
  },
  {
    id: 'cat_sneakers',
    parentId: 'cat_shoes',
    path: 'cat_root/cat_shoes/cat_sneakers',
    level: 3,
    name: 'Baskets',
  },
  {
    id: 'cat_lifestyle',
    parentId: 'cat_shoes',
    path: 'cat_root/cat_shoes/cat_lifestyle',
    level: 3,
    name: 'Lifestyle',
  },
]

export const sampleCategoriesEn: Record<string, any>[] = [
  {
    id: 'cat_root',
    parentId: '',
    path: 'cat_root',
    level: 1,
    name: 'Root Category',
  },
  {
    id: 'cat_shoes',
    parentId: 'cat_root',
    path: 'cat_root/cat_shoes',
    level: 2,
    name: 'Shoes',
  },
  {
    id: 'cat_running',
    parentId: 'cat_shoes',
    path: 'cat_root/cat_shoes/cat_running',
    level: 3,
    name: 'Running',
  },
  {
    id: 'cat_sneakers',
    parentId: 'cat_shoes',
    path: 'cat_root/cat_shoes/cat_sneakers',
    level: 3,
    name: 'Sneakers',
  },
  {
    id: 'cat_lifestyle',
    parentId: 'cat_shoes',
    path: 'cat_root/cat_shoes/cat_lifestyle',
    level: 3,
    name: 'Lifestyle',
  },
]

// ---------------------------------------------------------------------------
// Sample Products
// ---------------------------------------------------------------------------

export const sampleProductsFr: Record<string, any>[] = [
  {
    id: '1',
    sku: 'SDK-SHOE-001',
    name: 'Chaussure de course Nike Air',
    description:
      'Chaussure de course légère et performante avec semelle en mousse.',
    brand: [{ value: 'nike', label: 'Nike' }],
    color: [{ value: 'red', label: 'Rouge' }],
    size: '42',
    is_active: true,
    weight: 0.35,
    image: 'https://example.com/images/nike-air.jpg',
    price: [{ price: 129.99, group_id: 0 }],
    stock: { status: true, qty: 50 },
    category: [
      { id: 'cat_running', name: 'Running' },
      { id: 'cat_shoes', name: 'Chaussures' },
    ],
  },
  {
    id: '2',
    sku: 'SDK-SHOE-002',
    name: 'Basket Adidas Ultraboost',
    description: 'Basket avec technologie Boost pour un confort optimal.',
    brand: [{ value: 'adidas', label: 'Adidas' }],
    color: [{ value: 'black', label: 'Noir' }],
    size: '43',
    is_active: true,
    weight: 0.38,
    image: 'https://example.com/images/adidas-ultraboost.jpg',
    price: [{ price: 179.99, group_id: 0 }],
    stock: { status: true, qty: 30 },
    category: [
      { id: 'cat_running', name: 'Running' },
      { id: 'cat_shoes', name: 'Chaussures' },
    ],
  },
  {
    id: '3',
    sku: 'SDK-SHOE-003',
    name: 'Puma RS-X Blanc',
    description: 'Sneaker rétro avec un design audacieux et semelle épaisse.',
    brand: [{ value: 'puma', label: 'Puma' }],
    color: [{ value: 'white', label: 'Blanc' }],
    size: '41',
    is_active: true,
    weight: 0.42,
    image: 'https://example.com/images/puma-rsx.jpg',
    price: [{ price: 109.99, group_id: 0 }],
    stock: { status: true, qty: 15 },
    category: [
      { id: 'cat_sneakers', name: 'Baskets' },
      { id: 'cat_shoes', name: 'Chaussures' },
    ],
  },
  {
    id: '4',
    sku: 'SDK-SHOE-004',
    name: 'Nike Air Max Bleu',
    description: 'Chaussure lifestyle avec unité Air visible et style urbain.',
    brand: [{ value: 'nike', label: 'Nike' }],
    color: [{ value: 'blue', label: 'Bleu' }],
    size: '44',
    is_active: true,
    weight: 0.4,
    image: 'https://example.com/images/nike-airmax.jpg',
    price: [{ price: 159.99, group_id: 0 }],
    stock: { status: true, qty: 25 },
    category: [
      { id: 'cat_lifestyle', name: 'Lifestyle' },
      { id: 'cat_shoes', name: 'Chaussures' },
    ],
  },
  {
    id: '5',
    sku: 'SDK-SHOE-005',
    name: 'Adidas Stan Smith Classique',
    description: 'La chaussure iconique en cuir blanc avec détails verts.',
    brand: [{ value: 'adidas', label: 'Adidas' }],
    color: [{ value: 'white', label: 'Blanc' }],
    size: '42',
    is_active: true,
    weight: 0.32,
    image: 'https://example.com/images/adidas-stansmith.jpg',
    price: [{ price: 99.99, group_id: 0 }],
    stock: { status: true, qty: 100 },
    category: [
      { id: 'cat_sneakers', name: 'Baskets' },
      { id: 'cat_shoes', name: 'Chaussures' },
    ],
  },
]

export const sampleProductsEn: Record<string, any>[] = [
  {
    id: '1',
    sku: 'SDK-SHOE-001',
    name: 'Nike Air Running Shoe',
    description:
      'Lightweight and high-performance running shoe with foam sole.',
    brand: [{ value: 'nike', label: 'Nike' }],
    color: [{ value: 'red', label: 'Red' }],
    size: '42',
    is_active: true,
    weight: 0.35,
    image: 'https://example.com/images/nike-air.jpg',
    price: [{ price: 139.99, group_id: 0 }],
    stock: { status: true, qty: 50 },
    category: [
      { id: 'cat_running', name: 'Running' },
      { id: 'cat_shoes', name: 'Shoes' },
    ],
  },
  {
    id: '2',
    sku: 'SDK-SHOE-002',
    name: 'Adidas Ultraboost Sneaker',
    description: 'Sneaker with Boost technology for optimal comfort.',
    brand: [{ value: 'adidas', label: 'Adidas' }],
    color: [{ value: 'black', label: 'Black' }],
    size: '43',
    is_active: true,
    weight: 0.38,
    image: 'https://example.com/images/adidas-ultraboost.jpg',
    price: [{ price: 189.99, group_id: 0 }],
    stock: { status: true, qty: 30 },
    category: [
      { id: 'cat_running', name: 'Running' },
      { id: 'cat_shoes', name: 'Shoes' },
    ],
  },
  {
    id: '3',
    sku: 'SDK-SHOE-003',
    name: 'Puma RS-X White',
    description: 'Retro sneaker with bold design and thick sole.',
    brand: [{ value: 'puma', label: 'Puma' }],
    color: [{ value: 'white', label: 'White' }],
    size: '41',
    is_active: true,
    weight: 0.42,
    image: 'https://example.com/images/puma-rsx.jpg',
    price: [{ price: 119.99, group_id: 0 }],
    stock: { status: true, qty: 15 },
    category: [
      { id: 'cat_sneakers', name: 'Sneakers' },
      { id: 'cat_shoes', name: 'Shoes' },
    ],
  },
  {
    id: '4',
    sku: 'SDK-SHOE-004',
    name: 'Nike Air Max Blue',
    description: 'Lifestyle shoe with visible Air unit and urban style.',
    brand: [{ value: 'nike', label: 'Nike' }],
    color: [{ value: 'blue', label: 'Blue' }],
    size: '44',
    is_active: true,
    weight: 0.4,
    image: 'https://example.com/images/nike-airmax.jpg',
    price: [{ price: 169.99, group_id: 0 }],
    stock: { status: true, qty: 25 },
    category: [
      { id: 'cat_lifestyle', name: 'Lifestyle' },
      { id: 'cat_shoes', name: 'Shoes' },
    ],
  },
  {
    id: '5',
    sku: 'SDK-SHOE-005',
    name: 'Adidas Stan Smith Classic',
    description: 'The iconic white leather shoe with green details.',
    brand: [{ value: 'adidas', label: 'Adidas' }],
    color: [{ value: 'white', label: 'White' }],
    size: '42',
    is_active: true,
    weight: 0.32,
    image: 'https://example.com/images/adidas-stansmith.jpg',
    price: [{ price: 109.99, group_id: 0 }],
    stock: { status: true, qty: 100 },
    category: [
      { id: 'cat_sneakers', name: 'Sneakers' },
      { id: 'cat_shoes', name: 'Shoes' },
    ],
  },
]
