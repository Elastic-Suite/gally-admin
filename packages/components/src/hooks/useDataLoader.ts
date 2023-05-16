import { useEffect } from 'react'
import {
  IConfigurations,
  IExtraBundle,
  IHydraResponse,
  IMetadata,
  LoadStatus,
  useSchemaLoader,
} from '@elastic-suite/gally-admin-shared'

import { setData, useAppDispatch } from '../store'

import { useFetchApi } from './useApi'
import { useLog } from './useLog'

export function useDataLoader(): void {
  const dispatch = useAppDispatch()
  const log = useLog()

  const api = useSchemaLoader()
  const [bundles] = useFetchApi<IHydraResponse<IExtraBundle>>('extra_bundles')
  const [configurations] =
    useFetchApi<IHydraResponse<IConfigurations>>('configurations')

  const [metadata] = useFetchApi<IHydraResponse<IMetadata>>('metadata')

  useEffect(() => {
    if (api.status === LoadStatus.FAILED) {
      log(api.error)
    }
    if (bundles.status === LoadStatus.FAILED) {
      log(bundles.error)
    }
    if (configurations.status === LoadStatus.FAILED) {
      log(configurations.error)
    }

    if (metadata.status === LoadStatus.FAILED) {
      log(metadata.error)
    }
    if (api.data && bundles.data && configurations.data && metadata.data) {
      dispatch(
        setData({
          api: api.data,
          bundles: bundles.data['hydra:member'].map((bundle) => bundle.name),
          configurations: Object.fromEntries(
            configurations.data['hydra:member'].map((configuration) => [
              configuration.id,
              configuration.value,
            ])
          ),
          metadata: metadata.data['hydra:member'],
        })
      )
    }
  }, [api, bundles, configurations, metadata, dispatch, log])
}
