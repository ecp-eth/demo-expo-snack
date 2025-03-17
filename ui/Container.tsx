import { PropsWithChildren } from "react";
import { View } from "react-native";

export default function Container({ children }: PropsWithChildren) {
  return (
    <View
      style={{
        padding: 30,
        gap: 20,
      }}
    >
      {children}
    </View>
  );
}
