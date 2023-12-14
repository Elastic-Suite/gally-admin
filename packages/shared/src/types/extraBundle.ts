export enum Bundle {
  VIRTUAL_CATEGORY = 'GallyVirtualCategoryBundle',
  BOOST = 'GallyBoostBundle',
  THESAURUS = 'GallyThesaurusBundle',
  VECTOR_SEARCH = 'GallyVectorSearchBundle',
}

export interface IExtraBundle {
  id: Bundle
  name: Bundle
}
