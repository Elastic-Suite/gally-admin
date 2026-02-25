# @gally/sdk

TypeScript SDK for [Gally](https://meetgally.com) connectors.

Gally is a searchandising solution that allows you to manage and search your e-commerce content through a powerful API.

## Installation

```bash
npm install @gally/sdk
```

## Quick Start

### Configuration

```typescript
import { Configuration, IndexOperation, StructureSynchronizer, SearchManager } from '@gally/sdk';

const config = new Configuration({
  baseUri: 'https://your-gally-instance.com/api/',
  user: 'admin@example.com',
  password: 'your-password',
  checkSSL: true,
});
```

### Sync Catalog Structure

```typescript
import { Catalog, LocalizedCatalog, Metadata, SourceField, Label } from '@gally/sdk';

const synchronizer = new StructureSynchronizer(config);

// Create catalogs and localized catalogs
const catalog = new Catalog('my_shop', 'My Shop');
const localizedCatalogFr = new LocalizedCatalog(catalog, 'my_shop_fr', 'My Shop FR', 'fr_FR', 'EUR');
const localizedCatalogEn = new LocalizedCatalog(catalog, 'my_shop_en', 'My Shop EN', 'en_US', 'USD');

await synchronizer.syncAllLocalizedCatalogs([localizedCatalogFr, localizedCatalogEn]);

// Sync source fields
const metadata = new Metadata('product');
const nameField = new SourceField(metadata, 'name', 'text', 'Name', [
  new Label(localizedCatalogFr, 'Nom'),
  new Label(localizedCatalogEn, 'Name'),
]);

await synchronizer.syncAllSourceFields([nameField]);
```

### Index Documents

```typescript
const indexOp = new IndexOperation(config);
const metadata = new Metadata('product');

// Create index
const index = await indexOp.createIndex(metadata, localizedCatalogFr);

// Bulk documents
await indexOp.executeBulk(index, [
  { id: '1', sku: 'PROD-001', name: 'Product 1', price: [{ price: 29.99, group_id: 0 }] },
  { id: '2', sku: 'PROD-002', name: 'Product 2', price: [{ price: 49.99, group_id: 0 }] },
]);

// Install the index (make it live)
await indexOp.installIndex(index);
```

### Search

```typescript
import { Request, SearchManager } from '@gally/sdk';

const searchManager = new SearchManager(config);

const request = new Request({
  localizedCatalog: localizedCatalogFr,
  metadata: new Metadata('product'),
  isAutocomplete: false,
  selectedFields: ['id', 'sku', 'name'],
  currentPage: 1,
  pageSize: 10,
  searchQuery: 'shoes',
  filters: [],
});

const response = await searchManager.search(request);

console.log(`Total: ${response.getTotalCount()}`);
for (const product of response.getCollection()) {
  console.log(product);
}
```

## Architecture

The SDK mirrors the PHP SDK structure:

| Module | Description |
|--------|-------------|
| `client/` | HTTP client, configuration, and token management |
| `entity/` | Data models (Catalog, LocalizedCatalog, Metadata, SourceField, etc.) |
| `graphql/` | GraphQL request builder and response parser |
| `repository/` | CRUD repositories with caching and bulk operations |
| `service/` | High-level services (IndexOperation, SearchManager, StructureSynchronizer) |

## Source Field Types

| Type | Description |
|------|-------------|
| `text` | Text fields (name, description) |
| `keyword` | Non-analyzed text (identifiers) |
| `select` | Closed list of values (brand, color) |
| `int` | Integer fields |
| `boolean` | True/false fields |
| `float` | Floating numbers |
| `price` | Price fields with group support |
| `stock` | Stock status & quantity |
| `category` | Category relations |
| `reference` | Unique identifiers (SKU) |
| `image` | Image URLs |
| `object` | Complex nested objects |
| `date` | Date fields |
| `location` | Geo-location fields |

## Token Cache Manager

You can implement custom token caching by providing a `TokenCacheManager`:

```typescript
import { TokenCacheManager } from '@gally/sdk';

const tokenCache: TokenCacheManager = {
  async getToken(getToken, useCache = true) {
    if (useCache) {
      const cached = await myCache.get('gally_token');
      if (cached) return cached;
    }
    const token = await getToken();
    await myCache.set('gally_token', token);
    return token;
  },
};

const indexOp = new IndexOperation(config, tokenCache);
```

## Requirements

- Node.js >= 18.0.0 (uses native `fetch`)
- TypeScript >= 5.3 (for development)

## Integration Tests

The SDK includes integration tests that run against a real Gally instance. They test the complete lifecycle: catalog sync → indexation → search.

### Setup

1. Copy the environment template:

```bash
cp .env.test.example .env.test
```

2. Edit `.env.test` with your Gally instance settings:

```env
GALLY_BASE_URI=https://your-gally-instance.com/api/
GALLY_USER=admin@example.com
GALLY_PASSWORD=your-password
GALLY_CHECK_SSL=false
```

3. Run the tests:

```bash
# Run all integration tests
npm run test:integration

# Run a specific test file
npx vitest run tests/integration/04-full-lifecycle.test.ts

# Run in watch mode
npm run test:watch
```

### Test Structure

| File | Description |
|------|-------------|
| `tests/fixtures/sample-data.ts` | Sample catalogs, source fields, and products |
| `tests/integration/01-structure-sync.test.ts` | Catalog & source field synchronization |
| `tests/integration/02-index-operations.test.ts` | Index creation, bulk indexing, installation |
| `tests/integration/03-search.test.ts` | Search queries, pagination, aggregations |
| `tests/integration/04-full-lifecycle.test.ts` | Complete end-to-end lifecycle in one test |

Tests are automatically **skipped** if the Gally instance is not reachable.

## License

[OSL-3.0](https://opensource.org/license/osl-3-0-php)
