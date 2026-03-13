/**
 * Browser-compatible exports for Gally SDK
 *
 * This entry point contains only modules that can be used in browser environments.
 * For server-side usage, import from the main entry point instead.
 */

export { SearchManager } from './service/SearchManager'
export { TrackingEventManager } from './service'
export { TrackingEventValidator, TrackingEventType } from './validators'
export type { TrackingEventInput, TrackingEventResponse } from './service'
export type { BrowserConfigurationOptions as ConfigurationOptions } from './client/Configuration'
export { BrowserConfiguration as Configuration } from './client/Configuration'
export { Client } from './client/Client'
export { Request } from './graphql/Request'
export { Response } from './graphql/Response'
export { Metadata } from './entity/Metadata'
export { SourceField } from './entity/SourceField'
export { LocalizedCatalog } from './entity/LocalizedCatalog'
export { Catalog } from './entity/Catalog'
