import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SaveIcon({ color = "#5955B3", size = 24 }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Corps de la disquette */}
      <Path
        d="M4 4h12l4 4v12H4V4z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Partie haute (zone métallique) */}
      <Path
        d="M8 4v6h8V4"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Petit carré en bas */}
      <Path
        d="M8 14h8v4H8z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default SaveIcon