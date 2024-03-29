import { ICatalog, ILocalizedCatalog } from '../types'

export function getDefaultCatalog(catalogsData: ICatalog[]): ICatalog | null {
  const defaultCatalog = catalogsData
    ? catalogsData.filter((catalog) =>
        catalog.localizedCatalogs.find((localizedCtl) => localizedCtl.isDefault)
      )[0]
    : null

  if (defaultCatalog) {
    return {
      ...defaultCatalog,
      localizedCatalogs: defaultCatalog.localizedCatalogs.filter(
        (localizedCtl) => localizedCtl.isDefault
      ),
    }
  }
  return null
}

export function getDefaultLocalizedCatalog(
  catalogsData: ICatalog[]
): ILocalizedCatalog {
  const defaultCatalog = getDefaultCatalog(catalogsData)
  return defaultCatalog?.localizedCatalogs?.[0]
}

export function getLocalizedCatalog(
  catalogsData: ICatalog[],
  catalog?: ICatalog,
  localizedCatalog?: ILocalizedCatalog
): ILocalizedCatalog {
  if (!catalog) {
    return getDefaultLocalizedCatalog(catalogsData)
  } else if (catalog && !localizedCatalog) {
    return catalogsData
      .filter((ctl) => ctl.id === catalog.id)
      .map((ctl) => ctl.localizedCatalogs[0])
      .flat()[0]
  }
  return localizedCatalog
}

export function getLocalizedCatalogFromCatalogs(
  catalogs: ICatalog[],
  localizedCatalogId: string | number
): ILocalizedCatalog | undefined {
  let localizedCatalog

  catalogs.some((catalog) => {
    localizedCatalog = catalog?.localizedCatalogs.find(
      (localizedCatalog) =>
        String(localizedCatalog.id) === String(localizedCatalogId)
    )
    return localizedCatalog !== undefined
  })

  return localizedCatalog
}
