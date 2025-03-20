import { Dimensions } from "react-native";
import useKeyboardHeight from "./useKeyboardHeight";

export default function useKeyboardRemainingheight(scale: number) {
  const keyboardHeight = useKeyboardHeight();
  return (Dimensions.get("window").height - keyboardHeight) * scale;
}
