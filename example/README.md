# Gally TypeScript SDK Test

This project demonstrates how to use the Gally TypeScript SDK for product search and autocomplete functionality in both browser and Node.js environments.

## Prerequisites

### 1. Gally Instance
You need a running Gally instance. If you don't have one, you can set it up using Docker:

```bash
docker run -d \
  --name gally \
  -p 80:80 \
  -e GALLY_API_URL=http://gally.localhost/api \
  elasticsuite/gally:latest
```

Ensure Gally is accessible at `http://gally.localhost/api`

### 2. Node.js
- Node.js >= 18.0.0
- npm >= 8.0.0

Check your versions:
```bash
node --version
npm --version
```

## Installation

### 1. Clone or navigate to the project directory
```bash
cd gally-ts-sdk/example
```

### 2. Install dependencies
```bash
npm install
```

This will install:
- `@gally/sdk` - The Gally TypeScript SDK
- `vite` - Build tool for browser development

### 3. Configure Gally Connection

Edit the configuration in both `main.js` and `main_node.js`:

```javascript
const configuration = new Configuration({
  baseUri: 'http://gally.localhost/api',  // Update if your Gally instance is elsewhere
  checkSSL: false,                          // Set to true in production
  user: '',                                 // Add credentials if required
  password: '',                             // Add credentials if required
});
```

## Usage

### Browser Usage

#### 1. Start the development server
```bash
npm run dev
```

The server will start at `http://localhost:5173` (or another available port).

#### 2. Open in browser
Navigate to `http://localhost:5173` in your web browser.

#### 3. Using the search interface

The browser interface provides:
- **Search Input**: Type at least 2 characters to trigger autocomplete
- **Suggestions Dropdown**: Shows matching products as you type
- **Results Display**: Shows selected item details

**Features:**
- Real-time autocomplete suggestions
- Click on a suggestion to select it
- Debounced search (300ms delay) to limit API calls
- Click outside to hide suggestions
- Focus on input to show suggestions again

**Example workflow:**
1. Type "shirt" in the search input
2. See autocomplete suggestions appear
3. Click on a suggestion to select it
4. View the selected product details below

#### 4. Build for production
```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

---

### Node.js Usage

#### 1. Run the Node.js example
```bash
node main_node.js
```

#### 2. What it does

The Node.js script (`main_node.js`) demonstrates:
- Creating a Gally configuration
- Setting up a catalog and localized catalog
- Performing a product search
- Displaying results in the console

**Example output:**
```
Starting search...
Request created: Request { ... }
Search results:
{
  "collection": [
    {
      "id": "1",
      "sku": "SHIRT-001",
      "name": "Blue Cotton Shirt"
    },
    {
      "id": "2",
      "sku": "SHIRT-002",
      "name": "Red Wool Shirt"
    }
  ]
}

✓ Found 2 results
  1. Blue Cotton Shirt
  2. Red Wool Shirt
```

#### 3. Customize the search

Edit `main_node.js` to modify the search parameters:

```javascript
const request = new Request({
  localizedCatalog: sampleLocalizedCatalogFr,
  metadata: new Metadata('product'),
  isAutocomplete: false,                    // Set to true for autocomplete
  selectedFields: ['id', 'sku', 'name'],   // Add more fields as needed
  currentPage: 1,                           // Change page number
  pageSize: 10,                             // Change results per page
  filters: [],                              // Add filters
  searchQuery: 'your search term',          // Add search query
});
```

---

## Project Structure

```
test-gally-ts-sdk/
├── index.html              # Browser UI
├── main.js                 # Browser implementation
├── main_node.js            # Node.js implementation
├── package.json            # Project dependencies
├── package-lock.json       # Locked dependency versions
└── README.md              # This file
```

---

## Configuration Details

### Catalog Setup

**Browser (`main.js`):**
```javascript
const sampleCatalog = new Catalog('sdk_test_shop', 'SDK Test Shop');

const sampleLocalizedCatalogFr = new LocalizedCatalog(
  sampleCatalog,
  'sdk_test_shop_fr',
  'SDK Test Shop FR',
  'fr_FR',
  'EUR',
);
```

**Node.js (`main_node.js`):**
Same setup as browser - create a catalog and localized catalog for your store.

### Request Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `localizedCatalog` | LocalizedCatalog | The catalog to search in |
| `metadata` | Metadata | Entity type (e.g., 'product') |
| `isAutocomplete` | boolean | Enable autocomplete mode |
| `selectedFields` | string[] | Fields to return in results |
| `currentPage` | number | Page number (1-based) |
| `pageSize` | number | Results per page |
| `filters` | Filter[] | Search filters |
| `searchQuery` | string | Search term |

---

## Troubleshooting

### "Cannot find module '@gally/sdk'"
```bash
npm install
```

### "Connection refused" error
- Ensure Gally instance is running
- Check the `baseUri` in configuration
- Verify network connectivity

### No results found
- Check that your Gally instance has product data
- Verify the catalog code matches your Gally setup
- Try searching with different terms

### CORS errors in browser
- Ensure Gally API has CORS enabled
- Check browser console for specific error messages

---

## API Reference

### Configuration
```javascript
new Configuration({
  baseUri: string,      // Gally API URL
  checkSSL: boolean,    // SSL verification
  user: string,         // API username
  password: string,     // API password
})
```

### Catalog
```javascript
new Catalog(code: string, name: string)
```

### LocalizedCatalog
```javascript
new LocalizedCatalog(
  catalog: Catalog,
  code: string,
  name: string,
  locale: string,       // e.g., 'fr_FR', 'en_US'
  currency: string      // e.g., 'EUR', 'USD'
)
```

### Request
```javascript
new Request({
  localizedCatalog: LocalizedCatalog,
  metadata: Metadata,
  isAutocomplete: boolean,
  selectedFields: string[],
  currentPage: number,
  pageSize: number,
  filters: Filter[],
  searchQuery?: string,
})
```

### SearchManager
```javascript
const searchManager = new SearchManager(configuration);
const results = await searchManager.search(request);
```

---

## Examples

### Example 1: Simple Product Search (Node.js)
```javascript
const request = new Request({
  localizedCatalog: sampleLocalizedCatalogFr,
  metadata: new Metadata('product'),
  isAutocomplete: false,
  selectedFields: ['id', 'sku', 'name', 'price'],
  currentPage: 1,
  pageSize: 20,
  filters: [],
  searchQuery: 'shirt',
});

const results = await searchManager.search(request);
console.log(results.collection);
```

### Example 2: Autocomplete (Browser)
```javascript
async function fetchSuggestions(query) {
  const request = new Request({
    localizedCatalog: sampleLocalizedCatalogFr,
    metadata: new Metadata('product'),
    isAutocomplete: true,
    selectedFields: ['id', 'sku', 'name'],
    currentPage: 1,
    pageSize: 10,
    filters: [],
    searchQuery: query,
  });

  const results = await searchManager.search(request);
  displaySuggestions(results);
}
```

## Support

For issues or questions:
1. Check the [Gally Documentation](https://gally.io/docs)
2. Review the [SDK Repository](https://github.com/Elastic-Suite/gally-ts-sdk)
3. Check browser console for error messages
4. Verify Gally instance is running and accessible

---

## License

ISC
```
