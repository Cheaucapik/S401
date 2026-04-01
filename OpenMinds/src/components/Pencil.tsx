import * as React from "react"
import Svg, { Path } from "react-native-svg"

// On ajoute "color" en paramètre pour pouvoir la changer dans Settings.tsx
function Pencil({ color = "#5955B3", size = 25 }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default Pencil