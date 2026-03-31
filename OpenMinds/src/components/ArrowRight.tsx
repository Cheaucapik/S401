import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent() {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 14 14"
      fill="none"
    >
      <Path
        d="M2.875 6.9h8.05m0 0L6.9 2.875M10.925 6.9L6.9 10.925"
        stroke="#fff"
        strokeWidth={1.4375}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default SvgComponent
