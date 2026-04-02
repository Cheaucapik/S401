import * as React from "react"
import Svg, { Path } from "react-native-svg"

import { Colors } from '../constants/Colors'

const Trash = ({ size = 15, color = Colors.primary_blue, style }: { size?: number; color?: string; style?: any }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style as any}
    >
      <Path d="M4 7h16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />

      <Path d="M9 7V5h6v2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />

      <Path
        d="M6 7l1 13h10l1-13"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path
        d="M10 11v6M14 11v6"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"

      />
    </Svg>
  )
}
export default Trash
