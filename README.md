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

## Requirements

- Node.js >= 18.0.0 (uses native `fetch`)
- TypeScript >= 5.3 (for development)

## Installation

```bash
npm install @gally/sdk
```

## Quick Start

📖 **[Configuration Guide](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Configuration)** - Detailed configuration options

### 2. Sync Catalog Structure

📖 **[Catalog Synchronization Guide](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Catalog-Synchronization)** - Complete guide

### 3. Index Documents

📖 **[Index Operations Guide](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Index-Operations)** - Create indexes, bulk indexing, performance tips

### 4. Search

📖 **[Search Guide](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Search)** - Full-text search, filtering, faceting, sorting

### 5. Track Events

📖 **[Tracking Events Guide](https://github.com/Elastic-Suite/gally-ts-sdk/wiki/Tracking-Events)** - Complete guide with examples for all event types

## Documentation

📚 **[Full Documentation Wiki](https://github.com/Elastic-Suite/gally-ts-sdk/wiki)**

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
