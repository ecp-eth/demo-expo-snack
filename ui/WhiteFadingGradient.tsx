import React from "react";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

export default function WhiteFadingGradient() {
  return (
    <Svg
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 1,
      }}
      height={50}
    >
      <Defs>
        <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFF" stopOpacity="1" />
          <Stop offset="0.1" stopColor="#FFF" stopOpacity="0.9" />
          <Stop offset="0.7" stopColor="#FFF" stopOpacity="0.3" />
          <Stop offset="1" stopColor="#FFF" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#fade)" />
    </Svg>
  );
}
