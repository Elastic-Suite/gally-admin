import { ICategory, ITreeItem } from '../types'

export function flatTree(tree: ITreeItem[], flat: ITreeItem[]): void {
  tree.forEach((item) => {
    flat.push(item)
    if (item.children) {
      flatTree(item.children, flat)
    }
  })
}

export function getCategoryPathLabel(
  path: string[],
  categories: ICategory[],
  separator = ' / '
): string {
  let label = ''
  if (path.length > 0) {
    const category = categories.find(
      (category: ICategory) => category.id === path[0]
    )

    if (!category) {
      // eslint-disable-next-line no-console
      console.error(`Wrong path ${path.join('/')}`)
      return `/${path.join('/')}`
    }

    if (category.level === 1) {
      const [_parent, ...children] = path
      return getCategoryPathLabel(children, category?.children ?? [], separator)
    }

    path.shift()
    label =
      category?.name +
      (category?.children?.length > 0 && path.length > 0 ? separator : '') +
      getCategoryPathLabel(path, category?.children ?? [], separator)
  }

  return label
}
