import { Catalog, Configuration, LocalizedCatalog, Metadata, Request, SearchManager } from '@gally/sdk'

const configuration = new Configuration({
  baseUri: 'http://gally.localhost/api',
  checkSSL: false,
  user: '',
  password: '',
});

const searchManager = new SearchManager(configuration);

const sampleCatalog = new Catalog('sdk_test_shop', 'SDK Test Shop');

const sampleLocalizedCatalogFr = new LocalizedCatalog(
  sampleCatalog,
  'sdk_test_shop_fr',
  'SDK Test Shop FR',
  'fr_FR',
  'EUR',
);

async function performSearch() {
  try {
    console.log('Starting search...');

    const request = new Request({
      localizedCatalog: sampleLocalizedCatalogFr,
      metadata: new Metadata('product'),
      isAutocomplete: false,
      selectedFields: ['id', 'sku', 'name'],
      currentPage: 1,
      pageSize: 10,
      filters: [],
    });

    console.log('Request created:', request);

    const results = await searchManager.search(request);

    console.log('Search results:');
    console.log(JSON.stringify(results, null, 2));

    if (results && results.collection && results.collection.length > 0) {
      console.log(`\n✓ Found ${results.collection.length} results`);
      results.collection.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.name || item.title || 'Unknown'}`);
      });
    } else {
      console.log('No results found');
    }
  } catch (error) {
    console.error('Error during search:', error.message);
    console.error(error);
  }
}

// Run the search
performSearch();
