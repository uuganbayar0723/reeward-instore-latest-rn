import colors from '@constants/colors'
import React from 'react'
import { ActivityIndicator } from 'react-native'

export default function LoadingView() {
  return (
    <ActivityIndicator color={colors.primary} />
  )
}
