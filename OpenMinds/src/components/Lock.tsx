import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent() {
  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 18 18"
      fill="none"
    >
      <Path
        d="M5.25 8.25v-3a3.75 3.75 0 017.5 0v3m-9 0h10.5a1.5 1.5 0 011.5 1.5V15a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V9.75a1.5 1.5 0 011.5-1.5z"
        stroke="#6750A4"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default SvgComponent
