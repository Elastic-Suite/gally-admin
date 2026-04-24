import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  TrackingEventContextSessionStorage,
  TrackingEventContextLocalStorage,
} from '../../src/service/tracking/TrackingEventContextStorage'
import { TrackingEventType } from '../../src/validator'

describe('TrackingEventContextStorage', () => {
  const mockStorage = (): Storage => {
    let store: Record<string, string> = {}
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key]
      }),
      clear: vi.fn(() => {
        store = {}
      }),
      length: 0,
      key: vi.fn(() => null),
    }
  }

  describe('TrackingEventContextSessionStorage', () => {
    it('should use sessionStorage', () => {
      const storageMock = mockStorage()
      vi.stubGlobal('sessionStorage', storageMock)

      const service = new TrackingEventContextSessionStorage()
      const input = {
        eventType: TrackingEventType.VIEW,
        metadataCode: 'category',
        entityCode: 'cat-1',
        localizedCatalogCode: 'fr',
      }

      service.checkAndUpdateContext(input)
      expect(storageMock.setItem).toHaveBeenCalledWith(
        'gally-tracking-context',
        expect.stringContaining('cat-1'),
      )
    })
  })

  describe('TrackingEventContextLocalStorage', () => {
    it('should use localStorage', () => {
      const storageMock = mockStorage()
      vi.stubGlobal('localStorage', storageMock)

      const service = new TrackingEventContextLocalStorage()
      const input = {
        eventType: TrackingEventType.SEARCH,
        metadataCode: 'search',
        payload: JSON.stringify({
          search_query: { query_text: 'phone' },
        }),
        localizedCatalogCode: 'fr',
      }

      service.checkAndUpdateContext(input)
      expect(storageMock.setItem).toHaveBeenCalledWith(
        'gally-tracking-context',
        expect.stringContaining('phone'),
      )
    })
  })
})
