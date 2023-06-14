import React, { useContext, useEffect, useState } from 'react'
import { withAuth, withOptions } from '../../../../hocs'
import { PageTitle, ResourceForm } from '../../../../components'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../contexts'
import { useTranslation } from 'next-i18next'

const categories = [
  {
    id: 'cat_2',
    name: 'Default Category',
    level: 1,
    path: 'cat_2',
    isVirtual: false,
    children: [
      {
        id: 'cat_11',
        name: 'Bas',
        level: 2,
        path: 'cat_2/cat_11',
        isVirtual: false,
        children: [
          {
            id: 'cat_12',
            name: 'Pantalons \u0026 Shorts',
            level: 3,
            path: 'cat_2/cat_11/cat_12',
            isVirtual: false,
          },
          {
            id: 'cat_13',
            name: 'Jupes',
            level: 3,
            path: 'cat_2/cat_11/cat_13',
            isVirtual: false,
          },
        ],
      },
      {
        id: 'cat_14',
        name: 'Robes',
        level: 2,
        path: 'cat_2/cat_14',
        isVirtual: false,
      },
      {
        id: 'cat_15',
        name: 'Shop The Look',
        level: 2,
        path: 'cat_2/cat_15',
        isVirtual: false,
        children: [
          {
            id: 'cat_16',
            name: 'Minimalist Sensibility',
            level: 3,
            path: 'cat_2/cat_15/cat_16',
            isVirtual: false,
          },
          {
            id: 'cat_17',
            name: 'Outside the Lines',
            level: 3,
            path: 'cat_2/cat_15/cat_17',
            isVirtual: false,
          },
          {
            id: 'cat_18',
            name: 'Carefree Days',
            level: 3,
            path: 'cat_2/cat_15/cat_18',
            isVirtual: false,
          },
          {
            id: 'cat_19',
            name: 'Perfectly Beachy',
            level: 3,
            path: 'cat_2/cat_15/cat_19',
            isVirtual: false,
          },
          {
            id: 'cat_20',
            name: 'Retire your LBD',
            level: 3,
            path: 'cat_2/cat_15/cat_20',
            isVirtual: false,
          },
          {
            id: 'cat_21',
            name: 'Timeless Sophistication',
            level: 3,
            path: 'cat_2/cat_15/cat_21',
            isVirtual: false,
          },
        ],
      },
      {
        id: 'cat_3',
        name: 'Accessoires',
        level: 2,
        path: 'cat_2/cat_3',
        isVirtual: false,
        children: [
          {
            id: 'cat_4',
            name: 'Ceintures',
            level: 3,
            path: 'cat_2/cat_3/cat_4',
            isVirtual: false,
          },
          {
            id: 'cat_5',
            name: 'Bijoux',
            level: 3,
            path: 'cat_2/cat_3/cat_5',
            isVirtual: false,
          },
          {
            id: 'cat_6',
            name: 'Écharpes',
            level: 3,
            path: 'cat_2/cat_3/cat_6',
            isVirtual: false,
          },
        ],
      },
      {
        id: 'cat_7',
        name: 'New Products',
        level: 2,
        path: 'cat_2/cat_7',
        isVirtual: false,
      },
      {
        id: 'cat_8',
        name: 'Hauts',
        level: 2,
        path: 'cat_2/cat_8',
        isVirtual: false,
        children: [
          {
            id: 'cat_10',
            name: 'Sweats',
            level: 3,
            path: 'cat_2/cat_8/cat_10',
            isVirtual: false,
          },
          {
            id: 'cat_9',
            name: 'Chemisiers et T-shirts',
            level: 3,
            path: 'cat_2/cat_8/cat_9',
            isVirtual: false,
          },
        ],
      },
    ],
  },
  {
    id: 'cat_l_2',
    name: 'Luma',
    level: 1,
    path: 'cat_l_2',
    isVirtual: false,
    children: [
      {
        id: 'cat_l_11',
        name: 'Men',
        level: 2,
        path: 'cat_l_2/cat_l_11',
        isVirtual: false,
        children: [
          {
            id: 'cat_l_12',
            name: 'Tops',
            level: 3,
            path: 'cat_l_2/cat_l_11/cat_l_12',
            isVirtual: false,
            children: [
              {
                id: 'cat_l_14',
                name: 'Vestes',
                level: 4,
                path: 'cat_l_2/cat_l_11/cat_l_12/cat_l_14',
                isVirtual: false,
              },
              {
                id: 'cat_l_15',
                name: 'Pull',
                level: 4,
                path: 'cat_l_2/cat_l_11/cat_l_12/cat_l_15',
                isVirtual: false,
              },
              {
                id: 'cat_l_16',
                name: 'Tees',
                level: 4,
                path: 'cat_l_2/cat_l_11/cat_l_12/cat_l_16',
                isVirtual: false,
              },
              {
                id: 'cat_l_17',
                name: 'Tanks',
                level: 4,
                path: 'cat_l_2/cat_l_11/cat_l_12/cat_l_17',
                isVirtual: false,
              },
            ],
          },
          {
            id: 'cat_l_13',
            name: 'Bottoms',
            level: 3,
            path: 'cat_l_2/cat_l_11/cat_l_13',
            isVirtual: false,
            children: [
              {
                id: 'cat_l_18',
                name: 'Pants',
                level: 4,
                path: 'cat_l_2/cat_l_11/cat_l_13/cat_l_18',
                isVirtual: false,
              },
              {
                id: 'cat_l_19',
                name: 'Shorts',
                level: 4,
                path: 'cat_l_2/cat_l_11/cat_l_13/cat_l_19',
                isVirtual: false,
              },
            ],
          },
        ],
      },
      {
        id: 'cat_l_20',
        name: 'Women',
        level: 2,
        path: 'cat_l_2/cat_l_20',
        isVirtual: false,
        children: [
          {
            id: 'cat_l_21',
            name: 'Tops',
            level: 3,
            path: 'cat_l_2/cat_l_20/cat_l_21',
            isVirtual: false,
            children: [
              {
                id: 'cat_l_23',
                name: 'Vestes',
                level: 4,
                path: 'cat_l_2/cat_l_20/cat_l_21/cat_l_23',
                isVirtual: false,
              },
              {
                id: 'cat_l_24',
                name: 'Pull',
                level: 4,
                path: 'cat_l_2/cat_l_20/cat_l_21/cat_l_24',
                isVirtual: false,
              },
              {
                id: 'cat_l_25',
                name: 'Tees',
                level: 4,
                path: 'cat_l_2/cat_l_20/cat_l_21/cat_l_25',
                isVirtual: false,
              },
              {
                id: 'cat_l_26',
                name: 'Débardeur et soutien gorge',
                level: 4,
                path: 'cat_l_2/cat_l_20/cat_l_21/cat_l_26',
                isVirtual: false,
              },
            ],
          },
          {
            id: 'cat_l_22',
            name: 'Bottoms',
            level: 3,
            path: 'cat_l_2/cat_l_20/cat_l_22',
            isVirtual: false,
            children: [
              {
                id: 'cat_l_27',
                name: 'Pants',
                level: 4,
                path: 'cat_l_2/cat_l_20/cat_l_22/cat_l_27',
                isVirtual: false,
              },
              {
                id: 'cat_l_28',
                name: 'Shorts',
                level: 4,
                path: 'cat_l_2/cat_l_20/cat_l_22/cat_l_28',
                isVirtual: false,
              },
            ],
          },
        ],
      },
      {
        id: 'cat_l_3',
        name: 'Gear',
        level: 2,
        path: 'cat_l_2/cat_l_3',
        isVirtual: false,
        children: [
          {
            id: 'cat_l_4',
            name: 'Sacs',
            level: 3,
            path: 'cat_l_2/cat_l_3/cat_l_4',
            isVirtual: false,
          },
          {
            id: 'cat_l_5',
            name: 'Fitness Equipment',
            level: 3,
            path: 'cat_l_2/cat_l_3/cat_l_5',
            isVirtual: false,
          },
          {
            id: 'cat_l_6',
            name: 'Watches',
            level: 3,
            path: 'cat_l_2/cat_l_3/cat_l_6',
            isVirtual: false,
          },
        ],
      },
      {
        id: 'cat_l_37',
        name: 'Sale',
        level: 2,
        path: 'cat_l_2/cat_l_37',
        isVirtual: false,
      },
      {
        id: 'cat_l_38',
        name: 'What\u0027s New',
        level: 2,
        path: 'cat_l_2/cat_l_38',
        isVirtual: false,
      },
      {
        id: 'cat_l_41',
        name: 'Gift Cards',
        level: 2,
        path: 'cat_l_2/cat_l_41',
        isVirtual: false,
      },
      {
        id: 'cat_l_9',
        name: 'Training',
        level: 2,
        path: 'cat_l_2/cat_l_9',
        isVirtual: false,
        children: [
          {
            id: 'cat_l_10',
            name: 'Video Download',
            level: 3,
            path: 'cat_l_2/cat_l_9/cat_l_10',
            isVirtual: false,
          },
        ],
      },
    ],
  },
]

const pagesSlug = ['merchandize', 'boosts']

function AdminBoostEdit(): JSX.Element {
  const router = useRouter()
  const { t } = useTranslation('boost')
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const [idUpdate, setIdUpdate] = useState<string>('')

  useEffect(() => {
    setBreadcrumb(pagesSlug)
    setIdUpdate(router?.query?.id as string)
  }, [router.query, setBreadcrumb])

  if (!idUpdate) {
    return null
  }

  return (
    <>
      <PageTitle title={t('title.update')} sx={{ marginBottom: '32px' }} />
      <ResourceForm
        resourceName="Boost"
        id={idUpdate}
        categoriesList={categories}
      />
    </>
  )
}

export default withAuth(withOptions(AdminBoostEdit))
