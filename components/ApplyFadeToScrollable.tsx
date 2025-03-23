import React, { PropsWithChildren, useCallback } from "react";
import {
  View,
  NativeScrollEvent,
  ViewStyle,
  ScrollViewProps,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

type ScrollableWithFadeProps = PropsWithChildren<{
  style?: ViewStyle;
  fadingPercentage?: number;
}>;

export default function ApplyFadeToScrollable({
  children,
  style,
  fadingPercentage = 0.95,
}: ScrollableWithFadeProps) {
  const topFadeOpacity = useSharedValue(0);
  const bottomFadeOpacity = useSharedValue(1);

  const animatedTopFadeStyle = useAnimatedStyle(() => ({
    opacity: topFadeOpacity.value,
  }));

  const animatedBottomFadeStyle = useAnimatedStyle(() => ({
    opacity: bottomFadeOpacity.value,
  }));

  const handleScroll = useCallback((event: NativeScrollEvent) => {
    const { contentOffset, contentSize, layoutMeasurement } = event;

    // Calculate scroll positions
    const scrollTop = contentOffset.y;
    const scrollBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;

    // Update fade opacities with smooth animation
    topFadeOpacity.value = withTiming(scrollTop > 0 ? 1 : 0, {
      duration: 150,
    });

    bottomFadeOpacity.value = withTiming(scrollBottom > 0 ? 1 : 0, {
      duration: 150,
    });
  }, []);

  const childElement = React.isValidElement(children)
    ? children
    : Array.isArray(children) && React.isValidElement(children[0])
    ? children[0]
    : null;

  return (
    <View
      style={[
        {
          position: "relative",
        },
        style,
      ]}
    >
      {!!childElement
        ? React.createElement<ScrollViewProps>(childElement.type, {
            ...childElement.props,
            onScroll: ({ nativeEvent }) => handleScroll(nativeEvent),
            scrollEventThrottle: 16,
          })
        : null}

      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            bottom: `${fadingPercentage * 100}%`,
            width: "100%",
            pointerEvents: "none",
          },
          animatedTopFadeStyle,
        ]}
      >
        <Svg
          style={{
            flex: 1,
          }}
        >
          <Defs>
            <LinearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFF" stopOpacity="1" />
              <Stop offset="0.3" stopColor="#FFF" stopOpacity="0.9" />
              <Stop offset="0.9" stopColor="#FFF" stopOpacity="0.3" />
              <Stop offset="1" stopColor="#FFF" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#topFade)" />
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            top: `${fadingPercentage * 100}%`,
            width: "100%",
            pointerEvents: "none",
          },
          animatedBottomFadeStyle,
        ]}
      >
        <Svg>
          <Defs>
            <LinearGradient id="bottomFade" x1="0" y1="1" x2="0" y2="0">
              <Stop offset="0" stopColor="#FFF" stopOpacity="1" />
              <Stop offset="0.3" stopColor="#FFF" stopOpacity="0.9" />
              <Stop offset="0.9" stopColor="#FFF" stopOpacity="0.3" />
              <Stop offset="1" stopColor="#FFF" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#bottomFade)"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
