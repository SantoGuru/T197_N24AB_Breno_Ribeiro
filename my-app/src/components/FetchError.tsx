import { ReactNode } from "react";
import { YStack, Text } from "tamagui";

export default function FetchError({ children }: { children: ReactNode }) {
  return (
    <YStack f={1} jc="center" ai="center">
      <Text color="red">{children}</Text>
    </YStack>
  );
}
