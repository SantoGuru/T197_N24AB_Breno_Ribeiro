import { Input, Label, YStack } from "tamagui";

type InputsProps = {
    name: string,
    id?: string,
    placeholder?: string,
    password?: boolean
}

export default function TextInput({name, id, placeholder, password}: InputsProps) {
  const nameLabel = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  let idProp: string;
  if(id === undefined){
    idProp = name.replace(/\s+/g, '');
  } else {
    idProp = id;
  }

  return (
    <YStack>
      <Label htmlFor={idProp} fontSize="$7">
        {nameLabel}
      </Label>
      <Input
        id={idProp}
        size="$6"
        width="100%"
        placeholder={placeholder}
        secureTextEntry={password}
      />
    </YStack>
  );
}
