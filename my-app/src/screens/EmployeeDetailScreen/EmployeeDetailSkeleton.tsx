import { Skeleton } from "@/components/Skeleton";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";

export function EmployeeDetailSkeleton() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView f={1} px="$4" py="$10">
        <YStack gap="$4">
          <YStack gap="$2">
            <Skeleton width={200} height={20} borderRadius={8} />
            <Text color="$gray10">
              Horas Trabalhadas:{" "}
              <Skeleton width={10} height={14} borderRadius={6} />
            </Text>
            <Text color="$gray10">
              Horas Mensais:{" "}
              <Skeleton width={10} height={14} borderRadius={6} />
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" mb="$2">
              Frequência
            </Text>
            <Skeleton width="100%" height={20} borderRadius={10} />
            <Skeleton width="100%" height={20} borderRadius={10} />
            <XStack justifyContent="space-between" mt="$2">
              <Text color="$gray10">
                Presenças: <Skeleton width={10} height={16} borderRadius={6} />
              </Text>
              <Text color="$gray10">
                Faltas: <Skeleton width={10} height={16} borderRadius={6} />
              </Text>
            </XStack>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" mb="$2">
              Calendário
            </Text>
            <Skeleton width="100%" height={300} borderRadius={10} />
          </YStack>
        </YStack>
      </ScrollView>
    </View>
  );
}