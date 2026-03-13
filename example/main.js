import {
  Catalog,
  Configuration,
  LocalizedCatalog,
  Metadata,
  Request,
  SearchManager,
  TrackingEventManager,
  TrackingEventType
} from '@gally/sdk/browser'

const configuration = new Configuration({
  baseUri: 'http://gally.localhost/api',
  checkSSL: false,
})
const searchManager = new SearchManager(configuration);

// Initialize TrackingEventManager with large debounce to queue events
const trackingManager = new TrackingEventManager(configuration, {
  debounceMs: 5000,
  throttleMs: 5000,
  batchSize: 10,
});

// Get DOM elements
const searchInput = document.getElementById('searchInput');
const suggestionsContainer = document.getElementById('suggestions');
const output = document.getElementById('output');

// Debounce function to limit API calls
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

const sampleCatalog = new Catalog('sdk_test_shop', 'SDK Test Shop');

const sampleLocalizedCatalogFr = new LocalizedCatalog(
  sampleCatalog,
  'sdk_test_shop_fr',
  'SDK Test Shop FR',
  'fr_FR',
  'EUR',
);

// Generate session identifiers for tracking
const sessionUid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const sessionVid = `visitor_${Math.random().toString(36).substr(2, 9)}`;

// Fetch autocomplete suggestions
async function fetchSuggestions(query) {
  if (!query || query.trim().length < 2) {
    suggestionsContainer.style.display = 'none';
    return;
  }

  try {
    output.innerHTML = '<p>Loading suggestions...</p>';

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
    // Use SearchManager to get autocomplete suggestions
    const results = await searchManager.search(request);

    displaySuggestions(results);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    output.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    suggestionsContainer.style.display = 'none';
  }
}

// Display suggestions in the dropdown
function displaySuggestions(results) {
  suggestionsContainer.innerHTML = '';

  if (!results || results?.collection.length === 0) {
    suggestionsContainer.style.display = 'none';
    output.innerHTML = '<p>No results found</p>';
    return;
  }

  results.collection.forEach((item) => {
    // Skip items that don't have a name or title
    if (!item.name && !item.title) {
      return;
    }

    const suggestionDiv = document.createElement('div');
    suggestionDiv.className = 'suggestion-item';
    suggestionDiv.textContent = item.name || item.title;

    suggestionDiv.addEventListener('click', () => {
      selectSuggestion(item);
    });

    suggestionsContainer.appendChild(suggestionDiv);
  });

  suggestionsContainer.style.display = 'block';
  output.innerHTML = `<p>Found ${results.collection.length} results</p>`;
}

// Push product view tracking event
async function trackProductView(item) {
  try {
    const trackingPromise = trackingManager.pushViewEvent({
      metadataCode: 'product',
      localizedCatalogCode: sampleLocalizedCatalogFr.getCode(),
      entityCode: item.sku || item.id,
      sourceEventType: TrackingEventType.SEARCH,
      sourceMetadataCode: 'product',
      contextType: 'search',
      contextCode: searchInput.value,
      sessionUid,
      sessionVid,
    });

    // Show tracking status
    trackingPromise
      .then((result) => {
        console.log('Tracking event sent:', result);
        const statusEl = output.querySelector('em');
        if (statusEl) {
          statusEl.textContent = `✓ Tracking event sent (ID: ${result.id})`;
          statusEl.style.color = 'green';
        }
      })
      .catch((error) => {
        console.error('Error sending tracking event:', error);
        const statusEl = output.querySelector('em');
        if (statusEl) {
          statusEl.textContent = `✗ Tracking event failed: ${error.message}`;
          statusEl.style.color = 'red';
        }
      });
  } catch (error) {
    console.error('Error queuing tracking event:', error);
  }
}

// Handle suggestion selection and push tracking event
function selectSuggestion(item) {
  searchInput.value = item.name || item.title || '';
  suggestionsContainer.style.display = 'none';
  output.innerHTML = `
    <h3>Selected Item:</h3>
    <pre>${JSON.stringify(item, null, 2)}</pre>
    <p><em>Tracking event queued...</em></p>
  `;

  trackProductView(item);
}

// Add input listener with debounce
searchInput.addEventListener('input', debounce((e) => {
  fetchSuggestions(e.target.value);
}, 300));

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (e.target !== searchInput) {
    suggestionsContainer.style.display = 'none';
  }
});

// Show suggestions on focus if input has value
searchInput.addEventListener('focus', () => {
  if (searchInput.value && suggestionsContainer.children.length > 0) {
    suggestionsContainer.style.display = 'block';
  }
});

// Flush pending tracking events before page unload
window.addEventListener('beforeunload', async () => {
  await trackingManager.flushPending();
});
