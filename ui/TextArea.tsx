import { TextInput, TextInputProps } from "react-native";

export default function TextArea({
  error,
  style,
  ...props
}: TextInputProps & { error?: string | boolean }) {
  return (
    <TextInput
      {...props}
      style={[
        {
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 5,
          minHeight: 80,
          borderColor: !!error ? "red" : "#000000",
        },
        style,
      ]}
      multiline={true}
    />
  );
}
