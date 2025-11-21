import { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { usePremium } from "./services/usePremium";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function IndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { premium, loading } = usePremium();

  useEffect(() => {
    if (!loading) {
      if (premium) {
        router.replace("/home");
      } else {
        router.replace("/premium");
      }
    }
  }, [loading, premium]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ActivityIndicator size="large" color="#6c5ce7" />
      <Text style={styles.text}>Verificando assinatura...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    gap: 16,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
