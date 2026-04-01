import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Structure en fonction simple avec valeurs par défaut
function KeyVariant2({ color = "#5955B3", size = 25 }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        // On garde le dessin de la tête carrée/trapue que tu as choisi
        d="M17 2H7a3 3 0 00-3 3v14a3 3 0 003 3h10a3 3 0 003-3V5a3 3 0 00-3-3zM8 7h8a1 1 0 010 2H8a1 1 0 110-2zm0 4h8a1 1 0 010 2H8a1 1 0 110-2zm0 4h4a1 1 0 010 2H8a1 1 0 010-2z"
        fill={color}
      />
    </Svg>
  )
}

export default KeyVariant2