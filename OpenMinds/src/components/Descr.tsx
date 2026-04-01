import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent() {
  return (
    <Svg
      width={34}
      height={34}
      viewBox="0 0 34 34"
      fill="none"
    >
      <Path
        d="M2.833 11.333c0-.783.635-1.417 1.417-1.417h25.5a1.417 1.417 0 110 2.834H4.25a1.417 1.417 0 01-1.417-1.417zM2.833 17c0-.782.635-1.416 1.417-1.416h25.5a1.417 1.417 0 010 2.833H4.25A1.417 1.417 0 012.833 17zM4.25 21.25a1.417 1.417 0 100 2.833h17a1.417 1.417 0 100-2.833h-17z"
        fill="#fff"
      />
    </Svg>
  )
}

export default SvgComponent