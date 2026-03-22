import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { Colors } from "../constants/Colors"

function SvgComponent() {
  return (
    <Svg
      width="22"
      height="22"
      viewBox="0 0 16 16"
    >
      <Path
      fill={Colors.gray}
        d="M12.027 9.92L16 13.95 14 16l-4.075-3.976A6.465 6.465 0 016.5 13C2.91 13 0 10.083 0 6.5 0 2.91 2.917 0 6.5 0 10.09 0 13 2.917 13 6.5a6.463 6.463 0 01-.973 3.42zM1.997 6.452c0 2.48 2.014 4.5 4.5 4.5 2.48 0 4.5-2.015 4.5-4.5 0-2.48-2.015-4.5-4.5-4.5-2.48 0-4.5 2.014-4.5 4.5z"
        fillRule="evenodd"
      />
    </Svg>
  )
}

export default SvgComponent
