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
import {
  Configuration,
  IndexOperation,
  StructureSynchronizer,
  SearchManager,
  TrackingEventManager,
} from '@gally/sdk'

const config = new Configuration({
  baseUri: 'https://your-gally-instance.com/api/',
  user: 'admin@example.com',
  password: 'your-password',
  checkSSL: true,
})
```

### Browser Usage

For browser-only applications, use the browser export to reduce bundle size:

```typescript
import { SearchManager, Configuration } from '@gally/sdk/browser'
```

This export contains only modules compatible with browser environments (SearchManager, Request, Response, and related entities).

### Node Usage

For full SDK functionality including catalog synchronization and indexing, use the main export:
```typescript
import { StructureSynchronizer, IndexOperation } from '@gally/sdk'
```

### Sync Catalog Structure

```typescript
import {
  Catalog,
  LocalizedCatalog,
  Metadata,
  SourceField,
  Label,
} from '@gally/sdk'

const synchronizer = new StructureSynchronizer(config)

// Create catalogs and localized catalogs
const catalog = new Catalog('my_shop', 'My Shop')
const localizedCatalogFr = new LocalizedCatalog(
  catalog,
  'my_shop_fr',
  'My Shop FR',
  'fr_FR',
  'EUR',
)
const localizedCatalogEn = new LocalizedCatalog(
  catalog,
  'my_shop_en',
  'My Shop EN',
  'en_US',
  'USD',
)

await synchronizer.syncAllLocalizedCatalogs([
  localizedCatalogFr,
  localizedCatalogEn,
])

// Sync source fields
const metadata = new Metadata('product')
const nameField = new SourceField(metadata, 'name', 'text', 'Name', [
  new Label(localizedCatalogFr, 'Nom'),
  new Label(localizedCatalogEn, 'Name'),
])

await synchronizer.syncAllSourceFields([nameField])
```

### Index Documents

```typescript
const indexOp = new IndexOperation(config)
const metadata = new Metadata('product')

// Create index
const index = await indexOp.createIndex(metadata, localizedCatalogFr)

// Bulk documents
await indexOp.executeBulk(index, [
  {
    id: '1',
    sku: 'PROD-001',
    name: 'Product 1',
    price: [{ price: 29.99, group_id: 0 }],
  },
  {
    id: '2',
    sku: 'PROD-002',
    name: 'Product 2',
    price: [{ price: 49.99, group_id: 0 }],
  },
])

// Install the index (make it live)
await indexOp.installIndex(index)
```

### Search

```typescript
import { Request, SearchManager } from '@gally/sdk'

const searchManager = new SearchManager(config)

const request = new Request({
  localizedCatalog: localizedCatalogFr,
  metadata: new Metadata('product'),
  isAutocomplete: false,
  selectedFields: ['id', 'sku', 'name'],
  currentPage: 1,
  pageSize: 10,
  searchQuery: 'shoes',
  filters: [],
})

const response = await searchManager.search(request)

console.log(`Total: ${response.getTotalCount()}`)
for (const product of response.getCollection()) {
  console.log(product)
}
```

### Track Events

Track user interactions such as product views, searches, add-to-cart, and orders:

```typescript
import { TrackingEventManager, TrackingEventType } from '@gally/sdk'

const trackingManager = new TrackingEventManager(config)

// Track a product view
const viewResult = await trackingManager.pushViewEvent({
  metadataCode: 'product',
  localizedCatalogCode: 'my_shop_fr',
  entityCode: 'PROD-001',
  sessionUid: 'user-session-id',
  sessionVid: 'visitor-id',
})

// Track a search
const searchResult = await trackingManager.pushSearchEvent({
  metadataCode: 'product',
  localizedCatalogCode: 'my_shop_fr',
  sessionUid: 'user-session-id',
  sessionVid: 'visitor-id',
  payload: JSON.stringify({ query: 'shoes', results: 42 }),
})

// Track add to cart
const cartResult = await trackingManager.pushAddToCartEvent({
  metadataCode: 'product',
  localizedCatalogCode: 'my_shop_fr',
  entityCode: 'PROD-001',
  sessionUid: 'user-session-id',
  sessionVid: 'visitor-id',
})

// Track an order
const orderResult = await trackingManager.pushOrderEvent({
  metadataCode: 'product',
  localizedCatalogCode: 'my_shop_fr',
  sessionUid: 'user-session-id',
  sessionVid: 'visitor-id',
  payload: JSON.stringify({ orderId: 'ORD-12345', total: 99.99 }),
})

console.log(`Event tracked with ID: ${viewResult.id}`)
```

#### Tracking Event Types

| Event Type    | Description                                      |
| ------------- | ------------------------------------------------ |
| `view`        | Product page view                                |
| `display`     | Product displayed in search results or listing   |
| `search`      | Search query performed                           |
| `add_to_cart` | Product added to shopping cart                   |
| `order`       | Order completed                                  |

#### Tracking Event Result

Each tracking event returns a `TrackingEventResult` with the following properties:

```typescript
interface TrackingEventResult {
  id: string                          // Unique event identifier
  eventType: TrackingEventType         // Type of event
  metadataCode: string                // Entity metadata code
  localizedCatalogCode: string        // Catalog code
  entityCode?: string                 // Entity identifier (e.g., product SKU)
  sourceEventType?: TrackingEventType // Source event type
  sourceMetadataCode?: string         // Source metadata code
  contextType?: string                // Context type (e.g., 'search')
  contextCode?: string                // Context code
  sessionUid: string                  // User session identifier
  sessionVid: string                  // Visitor identifier
  payload?: string                    // Custom event payload (JSON string)
  createdAt: string                   // Server timestamp (ISO 8601)
  '@context': string                  // JSON-LD context
  '@id': string                       // JSON-LD identifier
  '@type': string                     // JSON-LD type
}
```

#### Event Batching, Debouncing & Throttling

The `TrackingEventManager` automatically optimizes event submission by:

- **Batching**: Multiple events are combined into a single GraphQL request (default batch size: 10)
- **Debouncing**: Rapid event submissions are delayed to allow batching (default: 300ms)
- **Throttling**: Requests are rate-limited to prevent overwhelming the API (default: 1000ms minimum between flushes)

You can customize these behaviors when creating the manager:

```typescript
const trackingManager = new TrackingEventManager(config, {
  debounceMs: 500,    // Wait 500ms before flushing queued events
  throttleMs: 2000,   // Minimum 2000ms between API requests
  batchSize: 20,      // Send up to 20 events per request
})
```

For cleanup before page unload, flush any pending events:

```typescript
window.addEventListener('beforeunload', async () => {
  await trackingManager.flushPending()
})
```

## Architecture

The SDK mirrors the PHP SDK structure:

| Module        | Description                                                                |
| ------------- | -------------------------------------------------------------------------- |
| `client/`     | HTTP client, configuration, and token management                           |
| `entity/`     | Data models (Catalog, LocalizedCatalog, Metadata, SourceField, etc.)       |
| `graphql/`    | GraphQL request builder and response parser                                |
| `repository/` | CRUD repositories with caching and bulk operations                         |
| `service/`    | High-level services (IndexOperation, SearchManager, StructureSynchronizer) |

## Source Field Types

| Type        | Description                          |
| ----------- | ------------------------------------ |
| `text`      | Text fields (name, description)      |
| `keyword`   | Non-analyzed text (identifiers)      |
| `select`    | Closed list of values (brand, color) |
| `int`       | Integer fields                       |
| `boolean`   | True/false fields                    |
| `float`     | Floating numbers                     |
| `price`     | Price fields with group support      |
| `stock`     | Stock status & quantity              |
| `category`  | Category relations                   |
| `reference` | Unique identifiers (SKU)             |
| `image`     | Image URLs                           |
| `object`    | Complex nested objects               |
| `date`      | Date fields                          |
| `location`  | Geo-location fields                  |

## Token Cache Manager

You can implement custom token caching by providing a `TokenCacheManager`:

```typescript
import { TokenCacheManager } from '@gally/sdk'

const tokenCache: TokenCacheManager = {
  async getToken(getToken, useCache = true) {
    if (useCache) {
      const cached = await myCache.get('gally_token')
      if (cached) return cached
    }
    const token = await getToken()
    await myCache.set('gally_token', token)
    return token
  },
}

const indexOp = new IndexOperation(config, tokenCache)
const trackingManager = new TrackingEventManager(config, tokenCache)
```

## Requirements

- Node.js >= 18.0.0 (uses native `fetch`)
- TypeScript >= 5.3 (for development)

## Integration Tests

The SDK includes integration tests that run against a real Gally instance. They test the complete lifecycle: catalog sync → indexation → search → tracking.

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

| File                                            | Description                                  |
| ----------------------------------------------- | -------------------------------------------- |
| `tests/fixtures/sample-data.ts`                 | Sample catalogs, source fields, and products |
| `tests/integration/01-structure-sync.test.ts`   | Catalog & source field synchronization       |
| `tests/integration/02-index-operations.test.ts` | Index creation, bulk indexing, installation  |
| `tests/integration/03-search.test.ts`           | Search queries, pagination, aggregations     |
| `tests/integration/04-tracking.test.ts`         | Event tracking (view, search, add-to-cart, order) |
| `tests/integration/05-full-lifecycle.test.ts`   | Complete end-to-end lifecycle in one test    |

Tests are automatically **skipped** if the Gally instance is not reachable.

## License

[OSL-3.0](https://opensource.org/license/osl-3-0-php)
