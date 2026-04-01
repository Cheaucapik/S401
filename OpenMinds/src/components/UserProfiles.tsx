import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent({ color, size }: { color: string, size: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
    >
      <Path
        d="M13.5 16.5a6 6 0 100-12 6 6 0 000 12zM3 31.5v-6a3 3 0 013-3h15a3 3 0 013 3v6M24 4.5a6 6 0 010 11.625M28.5 22.5H30a3 3 0 013 3v6"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default SvgComponent
