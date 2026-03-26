import * as React from "react"
import Svg, { Path } from "react-native-svg"

function MascotteExplorer({ style }: { style: any }) {
  return (
    <Svg
      width={156}
      height={115}
      viewBox="0 0 156 115"
      fill="none"
      style={style}
    >
      <Path
        d="M10 73C10 32.683 42.683 0 83 0s73 32.683 73 73v42H10V73z"
        fill="#E0A0E1"
      />
      <Path
        d="M10 0h146H10m146 115H10h146M0 115V83C0 37.16 37.16 0 83 0 48.206 0 20 32.683 20 73v42H0zM156 0v115V0"
        fill="#B96ABA"
      />
      <Path
        d="M45 65c0-10.493 8.507-19 19-19h2c10.493 0 19 8.507 19 19H45z"
        fill="#fff"
      />
      <Path
        d="M59.737 65c0-6.627 5.372-12 12-12H73c6.627 0 12 5.373 12 12H59.737z"
        fill="#000"
      />
      <Path
        d="M100 65c0-10.493 8.507-19 19-19h2c10.493 0 19 8.507 19 19h-40z"
        fill="#fff"
      />
      <Path
        d="M115 65c0-6.627 5.373-12 12-12h1.263c6.628 0 12 5.373 12 12H115z"
        fill="#000"
      />
    </Svg>
  )
}

export default MascotteExplorer
