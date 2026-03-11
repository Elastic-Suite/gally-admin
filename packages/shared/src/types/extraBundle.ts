export enum Bundle {
  VIRTUAL_CATEGORY = 'GallyVirtualCategoryBundle',
  BOOST = 'GallyBoostBundle',
  THESAURUS = 'GallyThesaurusBundle',
  VECTOR_SEARCH = 'GallyVectorSearchBundle',
  SEARCH_USAGE = 'GallySearchUsageBundle',
}

export interface IExtraBundle {
  id: Bundle
  name: Bundle
}
