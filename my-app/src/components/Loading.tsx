import { ReactNode } from "react";
import { Spinner, YStack, Text } from "tamagui";

export default function Loading({children}: { children: ReactNode}){
        return (
          <YStack f={1} jc="center" ai="center">
            <Spinner size="large" />
            <Text mt="$2">{children}</Text>
          </YStack>
        )
}