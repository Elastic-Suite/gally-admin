import { useDataLoader } from '../../../hooks'
import {
  selectApi,
  selectBundles,
  selectConfiguration,
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

  // Load data in the store
  useDataLoader()

  if (!api || !bundles || !configurations) {
    return null
  }

  return children
}

export default DataProvider
