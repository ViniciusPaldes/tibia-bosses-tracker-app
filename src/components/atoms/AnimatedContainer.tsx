import React, { useEffect } from 'react'
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import { styled } from 'styled-components/native'

export enum ANIM_TYPES {
  FADE_IN = 'fadeIn',
  SLIDE_UP = 'slideUp',
  SLIDE_DOWN = 'slideDown',
}

type AnimatedContainerProps = {
  /**
   * The children to display in the container.
   */
  children: React.ReactNode
  /**
   * The type of animation to use.
   */
  type?: ANIM_TYPES
  /**
   * The duration of the animation.
   */
  duration?: number
  /**
   * The delay of the animation.
   */
  delay?: number
}

export function AnimatedContainer({
  children,
  type = ANIM_TYPES.FADE_IN,
  duration = 300,
  delay = 0,
}: AnimatedContainerProps) {
  // 0 => start, 1 => fully shown
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withTiming(1, { duration, easing: Easing.out(Easing.cubic), delay })
  }, [delay, duration, progress])

  const animatedStyle = useAnimatedStyle(() => {
    // opacity always fades in with progress
    const opacity = progress.value

    // translateY depends on animation type
    let translateY = 0
    if (type === ANIM_TYPES.SLIDE_UP) {
      // start 20px down, move to 0
      translateY = (1 - progress.value) * 20
    } else if (type === ANIM_TYPES.SLIDE_DOWN) {
      // start 20px up, move to 0
      translateY = (1 - progress.value) * -20
    }

    return {
      opacity,
      transform: [{ translateY }],
    }
  }, [type])

  return <Container style={animatedStyle}>{children}</Container>
}

const Container = styled(Animated.View)({
  flex: 1,
  padding: 24,
  justifyContent: 'center',
})
