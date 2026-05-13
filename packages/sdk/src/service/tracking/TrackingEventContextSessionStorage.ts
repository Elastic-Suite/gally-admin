import { TrackingEventContextStorage } from './TrackingEventContextStorage'

class TrackingEventContextSessionStorage extends TrackingEventContextStorage {
  protected get storage(): Storage {
    return sessionStorage
  }
}

export { TrackingEventContextSessionStorage }
