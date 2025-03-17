import { View } from "react-native";
import { chain } from "../wagmi.config";
import Base from "./icons/chains/Base";
import Anvil from "./icons/chains/Anvil";

export default function CurrentNetwork() {
  return (
    <View>
      {chain.name === "Base" ? (
        <Base fill="#fff" width={20} height={20} />
      ) : (
        <Anvil width={20} height={20} />
      )}
    </View>
  );
}
