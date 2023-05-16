import { useDataLoader } from '../../../hooks'
import {
  selectApi,
  selectBundles,
  selectConfiguration,
  selectMetadata,
  useAppSelector,
} from '../../../store'

interface IProps {
  children: JSX.Element
}

function DataProvider(props: IProps): JSX.Element {
  const { children } = props
  const api = useAppSelector(selectApi)
  const bundles = useAppSelector(selectBundles)
  const configurations = useAppSelector(selectConfiguration)
  const metadatas = useAppSelector(selectMetadata)

  // Load data in the store
  useDataLoader()

  if (!api || !bundles || !configurations || !metadatas) {
    return null
  }

  return children
}

export default DataProvider
