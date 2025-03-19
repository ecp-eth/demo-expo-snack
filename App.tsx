import React from "react";
import { View } from "react-native";
import Providers from "./Providers";
import SideBarLayout from "./components/SideBarLayout";
import Home from "./screens/Home";

export default function App() {
  return (
    <Providers>
      <View
        style={{
          flex: 1,
          backgroundColor: "#ecf0f1",
        }}
      >
        <SideBarLayout>
          <Home />
        </SideBarLayout>
      </View>
    </Providers>
  );
}
