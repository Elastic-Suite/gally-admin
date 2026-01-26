import { IExpandedHydraSupportedClass, IHydraSupportedClass } from './hydra'
import { IJsonldBase, IJsonldString } from './jsonld'

export interface IDocsJsonldContext {
  '@vocab': string
  domain: IJsonldBase
  expects: IJsonldBase
  hydra: string
  owl: string
  range: IJsonldBase
  rdf: string
  rdfs: string
  returns: IJsonldBase
  schema: string
  subClassOf: IJsonldBase
  xmls: string
}

export interface IDocsJsonld extends IJsonldBase {
  '@context': IDocsJsonldContext
  entrypoint: string
  supportedClass: IHydraSupportedClass[]
  title: string
}

export interface IExpandedDocsJsonld extends IJsonldBase {
  'http://www.w3.org/ns/hydra/core#entrypoint': [IJsonldString]
  'http://www.w3.org/ns/hydra/core#supportedClass': IExpandedHydraSupportedClass[]
  'http://www.w3.org/ns/hydra/core#title': [IJsonldString]
}
