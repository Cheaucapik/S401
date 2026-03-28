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
        d="M2.25 7.5h13.5M5.25 2.25v1.5m7.5-1.5v1.5m-8.1 12h8.7c.84 0 1.26 0 1.581-.164a1.5 1.5 0 00.655-.655c.164-.32.164-.74.164-1.581v-7.2c0-.84 0-1.26-.164-1.581a1.5 1.5 0 00-.655-.656c-.32-.163-.74-.163-1.581-.163h-8.7c-.84 0-1.26 0-1.581.163a1.5 1.5 0 00-.656.656c-.163.32-.163.74-.163 1.581v7.2c0 .84 0 1.26.163 1.581a1.5 1.5 0 00.656.655c.32.164.74.164 1.581.164z"
        stroke="#6750A4"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default SvgComponent
