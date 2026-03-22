import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { Colors } from "../constants/Colors"

function SvgComponent(style:any) {
  return (
    <Svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.53 5.47a.75.75 0 010 1.06l-4.72 4.72H20a.75.75 0 010 1.5H5.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z"
        fill={Colors.white}
      />
    </Svg>
  )
}

export default SvgComponent
