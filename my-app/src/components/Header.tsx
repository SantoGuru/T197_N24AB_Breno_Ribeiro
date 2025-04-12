// Dentro de LoginScreen.tsx
import { View, Button, XStack, Image } from "tamagui";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";

export default function Header({ title }: { title?: string }) {
  const navigation = useNavigation();

  const rotaAtual = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  let onLoginScreen = rotaAtual == "Login";

  return (
    <XStack
      p="$3"
      pt="$9"
      bg="$blue10"
      alignItems="center"
      justifyContent="space-between"
      zIndex={10}
    >
      {onLoginScreen ? (
        <View width={40} />
      ) : (
        <Button
          icon={ArrowLeft}
          onPress={() => navigation.goBack()}
          size="$3"
          circular
        />
      )}
      <Image
        source={require("../assets/logo.png")}
        width={50}
        height={50}
        objectFit="contain"
      />

      <View width={40} />
    </XStack>
  );
}
