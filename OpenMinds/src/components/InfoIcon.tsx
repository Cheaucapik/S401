import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg"

function InfoFilledIcon({ color = "#5955B3", size = 40 }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
    

      {/* Le "i" en blanc */}
      <Path
        d="M12 16v-4"
        stroke="#5955B3"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <Path
        d="M12 8h.01"
        stroke="#5955B3"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  )
}

export default InfoFilledIcon