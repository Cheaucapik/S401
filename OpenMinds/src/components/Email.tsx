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
        d="M3 15c-.413 0-.766-.147-1.06-.44a1.445 1.445 0 01-.44-1.06v-9c0-.412.147-.766.44-1.06C2.235 3.148 2.588 3 3 3h12c.412 0 .766.147 1.06.44.293.294.44.648.44 1.06v9c0 .412-.147.766-.44 1.06-.294.293-.647.44-1.06.44H3zm6-5.25L3 6v7.5h12V6L9 9.75zm0-1.5l6-3.75H3l6 3.75zM3 6V4.5v9V6z"
        fill="#6750A4"
      />
    </Svg>
  )
}

export default SvgComponent
