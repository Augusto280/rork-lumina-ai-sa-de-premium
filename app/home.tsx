import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

import { useRouter } from "expo-router";
import { usePremium, clearUserEmail } from "./services/usePremium";
import { Sparkles, Crown, LogOut, RefreshCw } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const router = useRouter();
  const { email, refetch } = usePremium();

  const handleLogout = async () => {
    await clearUserEmail();
    router.replace("/premium");
  };

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000", "#1a0033", "#000"]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.crownContainer}>
              <Crown size={64} color="#FFD700" fill="#FFD700" />
            </View>
            <Text style={styles.title}>Bem-vindo ao Premium!</Text>
            <Text style={styles.subtitle}>Você tem acesso total ao Lumina AI</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Status:</Text>
              <View style={styles.statusBadge}>
                <Sparkles size={16} color="#FFD700" fill="#FFD700" />
                <Text style={styles.statusText}>Premium Ativo</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>E-mail:</Text>
              <Text style={styles.value}>{email}</Text>
            </View>
          </View>

          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>Recursos Desbloqueados</Text>
            <View style={styles.featuresList}>
              {[
                "Acesso ilimitado à IA",
                "Análise avançada de saúde",
                "Recomendações personalizadas",
                "Suporte prioritário",
                "Sem anúncios",
                "Atualizações exclusivas",
              ].map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Sparkles size={16} color="#6c5ce7" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleRefresh}
            >
              <RefreshCw size={20} color="#6c5ce7" />
              <Text style={styles.refreshText}>Atualizar Status</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#ff6b6b" />
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  crownContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 3,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    gap: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  infoRow: {
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#888",
    fontWeight: "600" as const,
  },
  value: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500" as const,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  statusText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  featuresCard: {
    backgroundColor: "rgba(108, 92, 231, 0.1)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(108, 92, 231, 0.3)",
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#6c5ce7",
    marginBottom: 20,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500" as const,
  },
  actions: {
    gap: 12,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(108, 92, 231, 0.2)",
    borderWidth: 2,
    borderColor: "#6c5ce7",
    gap: 8,
  },
  refreshText: {
    color: "#6c5ce7",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderWidth: 2,
    borderColor: "#ff6b6b",
    gap: 8,
  },
  logoutText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
