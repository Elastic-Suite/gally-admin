# @gally/sdk

TypeScript SDK for [Gally](https://meetgally.com) - a powerful searchandising solution for e-commerce.

[![npm version](https://img.shields.io/npm/v/@gally/sdk.svg)](https://www.npmjs.com/package/@gally/sdk)
[![License: OSL-3.0](https://img.shields.io/badge/License-OSL--3.0-blue.svg)](https://opensource.org/license/osl-3-0-php)

## Features

✨ **Catalog Management** - Sync catalogs, metadata, and source fields  
🔍 **Advanced Search** - Full-text search, filtering, faceting, and sorting  
📊 **Index Operations** - Create, bulk-index, and manage search indexes  
📈 **Event Tracking** - Track views, searches, add-to-cart, and orders  
🌐 **Multi-locale** - Support for multiple catalogs and languages  
⚡ **Performance** - Built-in caching, batching, and optimization  
🔒 **Type-Safe** - Full TypeScript support with comprehensive type definitions

## Installation

```bash
npm install @gally/sdk
```

## Requirements

- Node.js >= 18.0.0 (uses native `fetch`)
- TypeScript >= 5.3 (for development)

## Quick Start

### 1. Configuration

```typescript
import { Configuration } from '@gally/sdk'

const config = new Configuration({
  baseUri: 'https://your-gally-instance.com/api/',
  user: 'admin@example.com',
  password: 'your-password',
  checkSSL: true,
})
```

📖 **[Configuration Guide](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Configuration)** - Detailed configuration options

### 2. Sync Catalog Structure

```typescript
import { StructureSynchronizer, Catalog, LocalizedCatalog } from '@gally/sdk'

const synchronizer = new StructureSynchronizer(config)
const catalog = new Catalog('my_shop', 'My Shop')
const localizedCatalogFr = new LocalizedCatalog(
  catalog,
  'my_shop_fr',
  'My Shop FR',
  'fr_FR',
  'EUR',
)

await synchronizer.syncAllLocalizedCatalogs([localizedCatalogFr])
```

📖 **[Catalog Synchronization Guide](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Catalog-Synchronization)** - Complete guide

### 3. Index Documents

```typescript
import { IndexOperation, Metadata } from '@gally/sdk'

const indexOp = new IndexOperation(config)
const index = await indexOp.createIndex(
  new Metadata('product'),
  localizedCatalogFr,
)
await indexOp.executeBulk(index, documents)
await indexOp.installIndex(index)
```

📖 **[Index Operations Guide](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Index-Operations)** - Create indexes, bulk indexing, performance tips

### 4. Search

```typescript
import { SearchManager, Request } from '@gally/sdk'

const searchManager = new SearchManager(config)
const request = new Request({
  localizedCatalog: localizedCatalogFr,
  metadata: new Metadata('product'),
  searchQuery: 'shoes',
  currentPage: 1,
  pageSize: 10,
})

const response = await searchManager.search(request)
console.log(`Found ${response.getTotalCount()} products`)
```

📖 **[Search Guide](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Search)** - Full-text search, filtering, faceting, sorting

### 5. Track Events

```typescript
import { TrackingEventManager, TrackingEventType } from '@gally/sdk/browser'

const tracker = TrackingEventManager.init({
  baseUri: 'https://your-gally-instance.com/api',
})

await tracker.push({
  eventType: TrackingEventType.VIEW,
  metadataCode: 'product',
  localizedCatalogCode: 'my_shop_fr',
  entityCode: 'PROD-001',
})
```

📖 **[Tracking Events Guide](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Tracking-Events)** - Complete guide with examples for all event types

## Documentation

📚 **[Full Documentation Wiki](https://github.com/Elastic-Suite/gally-ts-sdk/wiki)**

### Quick Links

- **[Configuration](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Configuration)** - Setup, environment variables, SSL, token caching
- **[Catalog Synchronization](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Catalog-Synchronization)** - Catalogs, metadata, source fields, field options
- **[Index Operations](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Index-Operations)** - Creating, bulk indexing, installing indexes
- **[Search](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Search)** - Full-text search, filtering, faceting, sorting, pagination
- **[Tracking Events](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Tracking-Events)** - Track user interactions and behavior

## Browser vs Node Usage

**Browser** (search and tracking, smaller bundle):

```typescript
import {
  SearchManager,
  TrackingEventManager,
  Configuration,
} from '@gally/sdk/browser'

// No credentials required - search and tracking are public APIs
const config = new Configuration({
  baseUri: 'https://your-gally-instance.com/api/',
})
```

**Node.js** (full SDK including catalog sync and indexing):

```typescript
import {
  StructureSynchronizer,
  IndexOperation,
  Configuration,
} from '@gally/sdk'

// Credentials required for backend operations
const config = new Configuration({
  baseUri: 'https://your-gally-instance.com/api/',
  user: 'admin@example.com',
  password: 'your-password',
})
```

📖 See [Configuration Guide](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Configuration#browser-configuration) for details

## Testing

### Integration Tests

The SDK includes integration tests that run against a real Gally instance.

**Setup:**

```bash
cp .env.test.example .env.test
# Edit .env.test with your Gally instance settings
npm run test
```

## License

[OSL-3.0](https://opensource.org/license/osl-3-0-php)

---

### Need Help?

- 📖 [Documentation Wiki](https://github.com/Elastic-Suite/gally-ts-sdk/wiki) - Detailed guides and examples
- 🐛 [Issues](https://github.com/Elastic-Suite/gally-ts-sdk/issues) - Report bugs or request features
- 💬 [Discussions](https://github.com/Elastic-Suite/gally-ts-sdk/discussions) - Ask questions and share ideas
