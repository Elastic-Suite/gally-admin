/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2024-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

export { IndexOperation } from './IndexOperation'
export { SearchManager } from './SearchManager'
export { StructureSynchronizer } from './StructureSynchronizer'
export { TrackingEventManager } from './TrackingEventManager'
export type {
  TrackingEventInput,
  TrackingEventResponse,
} from './TrackingEventManager'
export { SessionInformationStorage } from './tracking/SessionInformationStorage'
export {
  TrackingEventContextStorage,
  TrackingEventContextSessionStorage,
} from './tracking/TrackingEventContextStorage'
export { EventQueueStorage } from './tracking/EventQueueStorage'
