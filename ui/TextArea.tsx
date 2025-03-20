import { forwardRef, Ref } from "react";
import { TextInput, TextInputProps } from "react-native";

export default forwardRef(function TextArea(
  {
    error,
    style,
    editable,
    ...props
  }: TextInputProps & { error?: string | boolean },
  ref: Ref<TextInput>
) {
  return (
    <TextInput
      {...props}
      editable={editable}
      style={[
        {
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 5,
          minHeight: 80,
          borderColor: error ? "red" : "#000000",
          color: editable ? "#000" : "#808080",
        },
        style,
      ]}
      multiline={true}
      ref={ref}
    />
  );
});
