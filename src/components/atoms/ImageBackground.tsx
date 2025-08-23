import { ImageBackground as ExpoImageBackground } from 'expo-image'
import React, { Fragment } from 'react'
import { ImageSourcePropType } from 'react-native'
import { styled } from 'styled-components/native'

type ImageBackgroundProp = {
  /**
   * The image to display in the background.
   */
  source: ImageSourcePropType
  /**
   * The opacity of the backdrop color.
   * 0.45 is the default opacity.
   */
  dimOpacity?: number
  /**
   * The children to display on top of the background.
   */
  children: React.ReactNode
}

export function ImageBackground({ source, dimOpacity = 0.45, children }: ImageBackgroundProp) {
  return (
    <Fragment>
      <Image source={source} contentFit="cover" transition={250} pointerEvents="none">
        <Backdrop dimOpacity={dimOpacity} pointerEvents="none" />
        {children}
      </Image>
    </Fragment>
  )
}

const Image = styled(ExpoImageBackground)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
})

const Backdrop = styled.View<{ dimOpacity: number }>(({ dimOpacity }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: `rgba(0,0,0,${dimOpacity})`,
}))
