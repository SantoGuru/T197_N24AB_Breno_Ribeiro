import { TamaguiProvider, Text, View } from "tamagui";
import config from "./tamagui.config";
import Navigation from "./src/navigation/Navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config}>
        <Navigation />
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
