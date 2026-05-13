import { TrackingEventContextStorage } from './TrackingEventContextStorage'

class TrackingEventContextLocalStorage extends TrackingEventContextStorage {
  protected get storage(): Storage {
    return localStorage
  }
}

export { TrackingEventContextLocalStorage }
