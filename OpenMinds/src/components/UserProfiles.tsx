import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const UsersIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">

    {/* Tête principale */}
    <Circle
      cx="9"
      cy="8"
      r="3"
      stroke={color}
      strokeWidth={2}
    />

    {/* Tête secondaire (demi cercle) */}
    <Path
      d="M16 6.5a2.5 2.5 0 0 1 0 5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />

    {/* Corps principal */}
    <Path
      d="M3 18c0-3 3-5 6-5s6 2 6 5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />

    {/* Corps secondaire */}
    <Path
      d="M14.5 17c0-2 2-3.5 4-3.5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />

  </Svg>
);

export default UsersIcon;