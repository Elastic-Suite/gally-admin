import categories from '../mocks/static/categories.json'
import { ITreeItem } from '../types'

import { flatTree, getCategoryPathLabel } from './category'

describe('Category service', () => {
  describe('flatTree', () => {
    it('should return the flat array of categories', () => {
      const flat: ITreeItem[] = []
      flatTree(categories.categories, flat)
      expect(flat).toEqual([
        expect.objectContaining({
          id: 'one',
          name: 'Catégorie Une',
          level: 1,
          path: 'one',
          isVirtual: false,
        }),
        expect.objectContaining({
          id: 'three',
          name: 'Catégorie Trois',
          level: 2,
          path: 'one/three',
          isVirtual: false,
        }),
        {
          id: 'five',
          name: 'Catégorie Cinq',
          level: 4,
          path: 'one/three/five',
          isVirtual: true,
        },
        {
          id: 'four',
          name: 'Catégorie Quatre',
          level: 3,
          path: 'one/four',
          isVirtual: true,
        },
        {
          id: 'two',
          name: 'Catégorie Deux',
          level: 1,
          path: 'two',
          isVirtual: false,
        },
      ])
    })
  })

  describe('getCategoryPathLabel', () => {
    it('should replace category path with ids by category path with names (category level 2)', () => {
      const pathLabel: string = getCategoryPathLabel(
        ['one', 'three'],
        categories.categories
      )
      expect(pathLabel).toEqual('Catégorie Trois')
    })
    it('should replace category path with ids by category path with names (category level 3)', () => {
      const pathLabel: string = getCategoryPathLabel(
        ['one', 'three', 'five'],
        categories.categories
      )
      expect(pathLabel).toEqual('Catégorie Trois / Catégorie Cinq')
    })
    it('should replace category path with ids by category path with names (category level 3 + "@" separator)', () => {
      const pathLabel: string = getCategoryPathLabel(
        ['one', 'three', 'five'],
        categories.categories,
        ' @ '
      )
      expect(pathLabel).toEqual('Catégorie Trois @ Catégorie Cinq')
    })
  })
})
