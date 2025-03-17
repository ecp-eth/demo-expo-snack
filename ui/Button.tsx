import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type ButtonProps = React.PropsWithChildren<{
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}>;

export default function Button({
  children,
  disabled,
  onPress,
  loading = false,
  iconStart,
  iconEnd,
}: ButtonProps) {
  const greyOut = disabled || loading;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: greyOut ? "#CDCDCD" : "#000",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: "auto",
      }}
    >
      {iconStart ? <View style={{ marginEnd: 10 }}>{iconStart}</View> : null}
      {loading ? (
        <ActivityIndicator
          style={{
            marginRight: 10,
          }}
        />
      ) : null}
      <Text
        style={{
          color: greyOut ? "#EFEFEF" : "#fff",
          textAlign: "center",
        }}
        disabled={disabled}
      >
        {children}
      </Text>
      {iconEnd ? <View style={{ marginStart: 10 }}>{iconEnd}</View> : null}
    </TouchableOpacity>
  );
}
