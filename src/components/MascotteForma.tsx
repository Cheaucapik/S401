import * as React from "react"
import Svg, { Path } from "react-native-svg"

function MasCotteFormat({ style }: { style: any }) {
  return (
    <Svg
      width={97}
      height={45}
      viewBox="0 0 97 45"
      fill="none"
      style={style}
    >
      <Path
        d="M0 45C0 20.147 20.147 0 45 0h7c24.853 0 45 20.147 45 45H0z"
        fill="#9692E3"
      />
      <Path
        d="M45 37.725C45 29.593 38.407 23 30.275 23h-1.55C20.593 23 14 29.593 14 37.725h31zM83 37.725C83 29.593 76.407 23 68.275 23h-1.55C58.593 23 52 29.593 52 37.725h31z"
        fill="#fff"
      />
      <Path
        d="M38.474 38.3a8.3 8.3 0 00-8.3-8.3H29.3a8.3 8.3 0 00-8.3 8.3h17.474zM76.474 38.3a8.3 8.3 0 00-8.3-8.3H67.3a8.3 8.3 0 00-8.3 8.3h17.474z"
        fill="#000"
      />
    </Svg>
  )
}

export default MasCotteFormat
