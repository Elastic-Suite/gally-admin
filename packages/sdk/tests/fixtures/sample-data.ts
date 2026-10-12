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
  SourceFieldOption,
  SourceFieldType,
} from '@elastic-suite/gally-sdk'

// ---------------------------------------------------------------------------
// Catalogs
// ---------------------------------------------------------------------------

export const sampleCatalog = new Catalog('sdk_test_shop', 'SDK Test Shop')

export const sampleLocalizedCatalogFr = new LocalizedCatalog(
  sampleCatalog,
  'sdk_test_shop_fr',
  'SDK Test Shop FR',
  'fr_FR',
  'EUR'
)

export const sampleLocalizedCatalogEn = new LocalizedCatalog(
  sampleCatalog,
  'sdk_test_shop_en',
  'SDK Test Shop EN',
  'en_US',
  'USD'
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

// Source fields belong to the metadata, not to a catalog, so these are shared with any demo data on
// the instance. The custom ones carry an `sdk_test_` prefix: with plain codes such as `size` or
// `color`, the sync would rewrite the demo's fields (a demo `select` became a `keyword`, and indexing
// then failed on the stale mapping).
export function createSampleSourceFields(): SourceField[] {
  return [
    new SourceField(productMetadata, 'name', SourceFieldType.TEXT, 'Name', [
      new Label(sampleLocalizedCatalogFr, 'Nom du produit'),
      new Label(sampleLocalizedCatalogEn, 'Product Name'),
    ]),
    new SourceField(
      productMetadata,
      'description',
      SourceFieldType.TEXT,
      'Description',
      [
        new Label(sampleLocalizedCatalogFr, 'Description'),
        new Label(sampleLocalizedCatalogEn, 'Description'),
      ]
    ),
    new SourceField(productMetadata, 'sku', SourceFieldType.REFERENCE, 'SKU', [
      new Label(sampleLocalizedCatalogFr, 'SKU'),
      new Label(sampleLocalizedCatalogEn, 'SKU'),
    ]),
    new SourceField(
      productMetadata,
      'sdk_test_brand',
      SourceFieldType.SELECT,
      'Brand',
      [
        new Label(sampleLocalizedCatalogFr, 'Marque'),
        new Label(sampleLocalizedCatalogEn, 'Brand'),
      ]
    ),
    new SourceField(
      productMetadata,
      'sdk_test_color',
      SourceFieldType.SELECT,
      'Color',
      [
        new Label(sampleLocalizedCatalogFr, 'Couleur'),
        new Label(sampleLocalizedCatalogEn, 'Color'),
      ]
    ),
    new SourceField(
      productMetadata,
      'sdk_test_size',
      SourceFieldType.KEYWORD,
      'Size',
      [
        new Label(sampleLocalizedCatalogFr, 'Taille'),
        new Label(sampleLocalizedCatalogEn, 'Size'),
      ]
    ),
    new SourceField(
      productMetadata,
      'sdk_test_is_active',
      SourceFieldType.BOOLEAN,
      'Active',
      [
        new Label(sampleLocalizedCatalogFr, 'Actif'),
        new Label(sampleLocalizedCatalogEn, 'Active'),
      ]
    ),
    new SourceField(
      productMetadata,
      'sdk_test_weight',
      SourceFieldType.FLOAT,
      'Weight',
      [
        new Label(sampleLocalizedCatalogFr, 'Poids'),
        new Label(sampleLocalizedCatalogEn, 'Weight'),
      ]
    ),
    new SourceField(productMetadata, 'image', SourceFieldType.IMAGE, 'Image', [
      new Label(sampleLocalizedCatalogFr, 'Image'),
      new Label(sampleLocalizedCatalogEn, 'Image'),
    ]),
  ]
}

// ---------------------------------------------------------------------------
// Source Field Options (for the select fields sdk_test_brand, sdk_test_color)
// ---------------------------------------------------------------------------

export function createSampleSourceFieldOptions(
  brandField: SourceField,
  colorField: SourceField
): SourceFieldOption[] {
  return [
    // Brand options
    new SourceFieldOption(brandField, 'brand_a', 1, 'Brand A', [
      new Label(sampleLocalizedCatalogFr, 'Marque A'),
      new Label(sampleLocalizedCatalogEn, 'Brand A'),
    ]),
    new SourceFieldOption(brandField, 'brand_b', 2, 'Brand B', [
      new Label(sampleLocalizedCatalogFr, 'Marque B'),
      new Label(sampleLocalizedCatalogEn, 'Brand B'),
    ]),
    new SourceFieldOption(brandField, 'brand_c', 3, 'Brand C', [
      new Label(sampleLocalizedCatalogFr, 'Marque C'),
      new Label(sampleLocalizedCatalogEn, 'Brand C'),
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

// Browsing products needs a category: the API refuses a product_catalog request without one. Every
// product is also assigned to the root, as a connector indexes all parent categories, so a browse of
// the root returns the whole catalog.
export const rootCategoryId = 'cat_root'

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
    name: 'Chaussure de course légère',
    description:
      'Chaussure de course légère et performante avec semelle en mousse.',
    sdk_test_brand: [{ value: 'brand_a', label: 'Brand A' }],
    sdk_test_color: [{ value: 'red', label: 'Rouge' }],
    sdk_test_size: '42',
    sdk_test_is_active: true,
    sdk_test_weight: 0.35,
    image: 'https://example.com/images/running-shoe.jpg',
    price: [{ price: 129.99, group_id: 0 }],
    stock: { status: true, qty: 50 },
    category: [
      { id: rootCategoryId, name: 'Catégorie racine' },
      { id: 'cat_running', name: 'Running' },
      { id: 'cat_shoes', name: 'Chaussures' },
    ],
  },
  {
    id: '2',
    sku: 'SDK-SHOE-002',
    name: 'Basket confort',
    description: 'Basket avec semelle amortissante pour un confort optimal.',
    sdk_test_brand: [{ value: 'brand_b', label: 'Brand B' }],
    sdk_test_color: [{ value: 'black', label: 'Noir' }],
    sdk_test_size: '43',
    sdk_test_is_active: true,
    sdk_test_weight: 0.38,
    image: 'https://example.com/images/comfort-sneaker.jpg',
    price: [{ price: 179.99, group_id: 0 }],
    stock: { status: true, qty: 30 },
    category: [
      { id: rootCategoryId, name: 'Catégorie racine' },
      { id: 'cat_running', name: 'Running' },
      { id: 'cat_shoes', name: 'Chaussures' },
    ],
  },
  {
    id: '3',
    sku: 'SDK-SHOE-003',
    name: 'Basket rétro blanche',
    description: 'Sneaker rétro avec un design audacieux et semelle épaisse.',
    sdk_test_brand: [{ value: 'brand_c', label: 'Brand C' }],
    sdk_test_color: [{ value: 'white', label: 'Blanc' }],
    sdk_test_size: '41',
    sdk_test_is_active: true,
    sdk_test_weight: 0.42,
    image: 'https://example.com/images/retro-sneaker.jpg',
    price: [{ price: 109.99, group_id: 0 }],
    stock: { status: true, qty: 15 },
    category: [
      { id: rootCategoryId, name: 'Catégorie racine' },
      { id: 'cat_sneakers', name: 'Baskets' },
      { id: 'cat_shoes', name: 'Chaussures' },
    ],
  },
  {
    id: '4',
    sku: 'SDK-SHOE-004',
    name: 'Chaussure lifestyle bleue',
    description: 'Chaussure lifestyle avec talon transparent et style urbain.',
    sdk_test_brand: [{ value: 'brand_a', label: 'Brand A' }],
    sdk_test_color: [{ value: 'blue', label: 'Bleu' }],
    sdk_test_size: '44',
    sdk_test_is_active: true,
    sdk_test_weight: 0.4,
    image: 'https://example.com/images/lifestyle-shoe.jpg',
    price: [{ price: 159.99, group_id: 0 }],
    stock: { status: true, qty: 25 },
    category: [
      { id: rootCategoryId, name: 'Catégorie racine' },
      { id: 'cat_lifestyle', name: 'Lifestyle' },
      { id: 'cat_shoes', name: 'Chaussures' },
    ],
  },
  {
    id: '5',
    sku: 'SDK-SHOE-005',
    name: 'Basket classique en cuir',
    description: 'Basket classique en cuir blanc avec talon contrasté.',
    sdk_test_brand: [{ value: 'brand_b', label: 'Brand B' }],
    sdk_test_color: [{ value: 'white', label: 'Blanc' }],
    sdk_test_size: '42',
    sdk_test_is_active: true,
    sdk_test_weight: 0.32,
    image: 'https://example.com/images/leather-sneaker.jpg',
    price: [{ price: 99.99, group_id: 0 }],
    stock: { status: true, qty: 100 },
    category: [
      { id: rootCategoryId, name: 'Catégorie racine' },
      { id: 'cat_sneakers', name: 'Baskets' },
      { id: 'cat_shoes', name: 'Chaussures' },
    ],
  },
]

export const sampleProductsEn: Record<string, any>[] = [
  {
    id: '1',
    sku: 'SDK-SHOE-001',
    name: 'Lightweight Running Shoe',
    description:
      'Lightweight and high-performance running shoe with foam sole.',
    sdk_test_brand: [{ value: 'brand_a', label: 'Brand A' }],
    sdk_test_color: [{ value: 'red', label: 'Red' }],
    sdk_test_size: '42',
    sdk_test_is_active: true,
    sdk_test_weight: 0.35,
    image: 'https://example.com/images/running-shoe.jpg',
    price: [{ price: 139.99, group_id: 0 }],
    stock: { status: true, qty: 50 },
    category: [
      { id: rootCategoryId, name: 'Root Category' },
      { id: 'cat_running', name: 'Running' },
      { id: 'cat_shoes', name: 'Shoes' },
    ],
  },
  {
    id: '2',
    sku: 'SDK-SHOE-002',
    name: 'Comfort Sneaker',
    description: 'Sneaker with a cushioned sole for optimal comfort.',
    sdk_test_brand: [{ value: 'brand_b', label: 'Brand B' }],
    sdk_test_color: [{ value: 'black', label: 'Black' }],
    sdk_test_size: '43',
    sdk_test_is_active: true,
    sdk_test_weight: 0.38,
    image: 'https://example.com/images/comfort-sneaker.jpg',
    price: [{ price: 189.99, group_id: 0 }],
    stock: { status: true, qty: 30 },
    category: [
      { id: rootCategoryId, name: 'Root Category' },
      { id: 'cat_running', name: 'Running' },
      { id: 'cat_shoes', name: 'Shoes' },
    ],
  },
  {
    id: '3',
    sku: 'SDK-SHOE-003',
    name: 'White Retro Sneaker',
    description: 'Retro sneaker with bold design and thick sole.',
    sdk_test_brand: [{ value: 'brand_c', label: 'Brand C' }],
    sdk_test_color: [{ value: 'white', label: 'White' }],
    sdk_test_size: '41',
    sdk_test_is_active: true,
    sdk_test_weight: 0.42,
    image: 'https://example.com/images/retro-sneaker.jpg',
    price: [{ price: 119.99, group_id: 0 }],
    stock: { status: true, qty: 15 },
    category: [
      { id: rootCategoryId, name: 'Root Category' },
      { id: 'cat_sneakers', name: 'Sneakers' },
      { id: 'cat_shoes', name: 'Shoes' },
    ],
  },
  {
    id: '4',
    sku: 'SDK-SHOE-004',
    name: 'Blue Lifestyle Shoe',
    description: 'Lifestyle shoe with a transparent heel and urban style.',
    sdk_test_brand: [{ value: 'brand_a', label: 'Brand A' }],
    sdk_test_color: [{ value: 'blue', label: 'Blue' }],
    sdk_test_size: '44',
    sdk_test_is_active: true,
    sdk_test_weight: 0.4,
    image: 'https://example.com/images/lifestyle-shoe.jpg',
    price: [{ price: 169.99, group_id: 0 }],
    stock: { status: true, qty: 25 },
    category: [
      { id: rootCategoryId, name: 'Root Category' },
      { id: 'cat_lifestyle', name: 'Lifestyle' },
      { id: 'cat_shoes', name: 'Shoes' },
    ],
  },
  {
    id: '5',
    sku: 'SDK-SHOE-005',
    name: 'Classic Leather Sneaker',
    description: 'Classic white leather sneaker with a contrasting heel.',
    sdk_test_brand: [{ value: 'brand_b', label: 'Brand B' }],
    sdk_test_color: [{ value: 'white', label: 'White' }],
    sdk_test_size: '42',
    sdk_test_is_active: true,
    sdk_test_weight: 0.32,
    image: 'https://example.com/images/leather-sneaker.jpg',
    price: [{ price: 109.99, group_id: 0 }],
    stock: { status: true, qty: 100 },
    category: [
      { id: rootCategoryId, name: 'Root Category' },
      { id: 'cat_sneakers', name: 'Sneakers' },
      { id: 'cat_shoes', name: 'Shoes' },
    ],
  },
]
