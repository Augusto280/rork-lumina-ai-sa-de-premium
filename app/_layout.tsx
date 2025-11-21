import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000,
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="premium" 
        options={{ 
          title: "Ativar Premium",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff"
        }} 
      />
      <Stack.Screen 
        name="home" 
        options={{ 
          title: "Lumina AI Premium",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerShown: true
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}
