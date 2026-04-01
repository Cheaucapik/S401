import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function SvgComponent() {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
    >
      <G
        clipPath="url(#clip0_380_461)"
        stroke="#fff"
        strokeWidth={2.56}
        strokeMiterlimit={10}
      >
        <Path d="M7.64 18.573a.64.64 0 100-1.28.64.64 0 000 1.28zM10.2 24.96a.64.64 0 100-1.28.64.64 0 000 1.28zM8.92 12.174a.64.64 0 100-1.28.64.64 0 000 1.28zM14.027 8.346a.64.64 0 100-1.28.64.64 0 000 1.28zM20.427 9.627a.64.64 0 100-1.28.64.64 0 000 1.28zM24.267 14.733a.64.64 0 100-1.28.64.64 0 000 1.28z" />
        <Path d="M30.013 15.814a6.495 6.495 0 01-6.48 6.6h-1.96a5.707 5.707 0 00-4.76 2.546l-1.533 2.294a6.32 6.32 0 01-5.333 2.826 6.147 6.147 0 01-5.16-2.666 17.427 17.427 0 01-2.907-9.68V16a14.067 14.067 0 0128.133-.2v.014z" />
      </G>
      <Defs>
        <ClipPath id="clip0_380_461">
          <Path fill="#fff" d="M0 0H32V32H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default SvgComponent