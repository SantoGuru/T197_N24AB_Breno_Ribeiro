import { Input, Label, YStack } from "tamagui";

type InputsProps = {
    name: string,
    placeholder?: string,
    password?: boolean
}

export default function TextInput({name, placeholder, password}: InputsProps) {
  const nameLabel = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const idName = name.replace(/\s+/g, '');

  return (
    <YStack>
      <Label htmlFor={idName} fontSize="$7">
        {nameLabel}
      </Label>
      <Input
        id={idName}
        size="$6"
        width="100%"
        placeholder={placeholder}
        secureTextEntry={password}
      />
    </YStack>
  );
}
