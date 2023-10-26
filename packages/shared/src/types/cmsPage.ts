import { IGraphqlDocument, IGraphqlSearchDocument } from './documents'

export interface IGraphqlSearchCmsPages {
  cmsPages: IGraphqlSearchDocument
}

export interface ICmsPage extends IGraphqlDocument {
  id: string
  title: string
  content: string
  contentHeading: string
}
