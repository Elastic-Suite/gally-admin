import React from 'react'
import { styled } from '@mui/system'

import { IImage, imageIconLabels } from '@elastic-suite/gally-admin-shared'

import IonIcon from '../IonIcon/IonIcon'
import { useTranslation } from 'next-i18next'

interface IProps {
  image: IImage
}

const ImageContainer = styled('div')({
  display: 'flex',
})

const ImageTag = styled('img')({
  height: 80,
  width: 80,
})

const Icons = styled('div')({
  height: '80px',
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '5px',
  gap: '5px',
  flexWrap: 'wrap',
})

function Image(props: IProps): JSX.Element {
  const { image } = props
  const { t } = useTranslation('common')

  return (
    <ImageContainer>
      <ImageTag alt={t('field.productImage')} src={image.path as string} />
      <Icons>
        {image.icons
          ? image.icons.map((iconName) => (
              <IonIcon
                key={iconName}
                name={iconName}
                tooltip
                title={t(imageIconLabels[iconName])}
                style={{
                  color: '#151A47',
                  fontSize: '18px',
                  border: '1px solid #B5B9D9',
                  borderRadius: '8px',
                  padding: '3px',
                }}
              />
            ))
          : null}
      </Icons>
    </ImageContainer>
  )
}

export default Image
