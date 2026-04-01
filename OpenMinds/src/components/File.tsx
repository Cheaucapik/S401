import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function SvgComponent() {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"
    >
      <G clipPath="url(#clip0_380_455)">
        <Path
          d="M28.13 6.094H14.067L11.255 3.28H1.88c-1.036 0-1.875.84-1.875 1.875v4.688h-.009v1.875h.009v13.125c0 1.036.839 1.875 1.875 1.875h26.25c1.036 0 1.875-.84 1.875-1.875V7.969c0-1.035-.84-1.875-1.875-1.875zM1.88 5.156h8.518L12.7 7.42l.59.55h14.84v1.875H1.88L1.88 5.156zm0 19.688V11.719h26.25v13.125H1.88z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_380_455">
          <Path fill="#fff" d="M0 0H30V30H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default SvgComponent