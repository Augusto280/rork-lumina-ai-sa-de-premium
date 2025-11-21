import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { usePremium, saveUserEmail } from "./services/usePremium";
import { verificarAssinatura } from "./services/premiumService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sparkles, Mail, CheckCircle, AlertCircle, Wifi } from "lucide-react-native";

export default function PremiumScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { email: savedEmail, refetch } = usePremium();
  const [email, setEmail] = useState<string>(savedEmail || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [testingConnection, setTestingConnection] = useState<boolean>(false);

  const handleAlreadyPaid = async () => {
    if (!email.trim()) {
      Alert.alert("Atenção", "Por favor, insira seu e-mail.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Atenção", "Por favor, insira um e-mail válido.");
      return;
    }

    setLoading(true);
    console.log("[PremiumScreen] Verificando e-mail:", email);

    try {
      await saveUserEmail(email.trim().toLowerCase());
      
      const result = await verificarAssinatura(email.trim().toLowerCase());
      
      console.log("[PremiumScreen] Resultado da verificação:", result);

      if (result.isPremium) {
        Alert.alert("Sucesso! 🎉", result.mensagem || "Seu plano Premium foi ativado!");
        await refetch();
        router.replace("/home");
      } else {
        const mensagem = result.mensagem || result.erro || "Não foi possível verificar sua assinatura.";
        Alert.alert("Ainda não ativo", mensagem);
      }
    } catch (e) {
      console.error("[PremiumScreen] Erro:", e);
      Alert.alert("Erro", "Erro ao verificar assinatura. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDevActivate = async () => {
    if (!email.trim()) {
      Alert.alert("Atenção", "Por favor, insira seu e-mail primeiro.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Atenção", "Por favor, insira um e-mail válido.");
      return;
    }

    setLoading(true);
    console.log("[PremiumScreen] [DEV] Forçando verificação para:", email);

    try {
      await saveUserEmail(email.trim().toLowerCase());
      
      const result = await verificarAssinatura(email.trim().toLowerCase());
      
      console.log("[PremiumScreen] [DEV] Resultado:", result);

      if (result.isPremium) {
        Alert.alert("✅ Premium Ativado (Dev)", "Acesso liberado!");
        await refetch();
        router.replace("/home");
      } else {
        const mensagem = result.mensagem || result.erro || "E-mail não encontrado no sistema.";
        Alert.alert("❌ Não Ativado", `Debug Info:\n\n${mensagem}\n\nVerifique o JSON no GitHub.`);
      }
    } catch (e) {
      console.error("[PremiumScreen] [DEV] Erro:", e);
      Alert.alert("Erro", `Erro ao verificar: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    console.log("[PremiumScreen] Testando conexão...");

    try {
      const url = "https://raw.githubusercontent.com/Augusto280/rork-lumina-ai-sa-de-premium/main/assinaturas.json";
      const response = await fetch(url + "?t=" + Date.now(), {
        method: "GET",
        headers: { "Accept": "application/json" },
      });
      
      console.log("[PremiumScreen] Status:", response.status);
      const text = await response.text();
      console.log("[PremiumScreen] Resposta:", text.substring(0, 200));
      
      if (response.ok) {
        Alert.alert(
          "✅ Conexão OK!",
          `Status: ${response.status}\nDados obtidos com sucesso!\n\nPrimeiros caracteres:\n${text.substring(0, 100)}...`
        );
      } else {
        Alert.alert("⚠️ Erro de Conexão", `Status HTTP: ${response.status}\n\nResposta: ${text}`);
      }
    } catch (e) {
      console.error("[PremiumScreen] Erro no teste:", e);
      Alert.alert("❌ Erro", `Falha na conexão: ${e}`);
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Sparkles size={48} color="#FFD700" fill="#FFD700" />
            </View>
            <Text style={styles.title}>Lumina AI Premium</Text>
            <Text style={styles.subtitle}>
              Desbloqueie todos os recursos premium do aplicativo
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#6c5ce7" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleAlreadyPaid}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <CheckCircle size={20} color="#fff" />
                  <Text style={styles.buttonText}>Já Assinei</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.devButton, loading && styles.buttonDisabled]}
              onPress={handleDevActivate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <AlertCircle size={20} color="#fff" />
                  <Text style={styles.buttonText}>Ativar Premium (Dev)</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.testButton, testingConnection && styles.buttonDisabled]}
              onPress={handleTestConnection}
              disabled={testingConnection}
            >
              {testingConnection ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Wifi size={20} color="#fff" />
                  <Text style={styles.buttonText}>Testar Conexão</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Como funciona?</Text>
            <Text style={styles.infoText}>
              1. Insira o e-mail usado na sua assinatura{"\n"}
              2. Clique em &quot;Já Assinei&quot;{"\n"}
              3. Aguarde a verificação{"\n"}
              4. Aproveite o Premium!{"\n\n"}
              💡 Use &quot;Testar Conexão&quot; se tiver problemas
            </Text>
          </View>

          <Text style={styles.footer}>
            Problemas? Entre em contato com o suporte
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  keyboardView: {
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
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
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
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#333",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: "#fff",
    fontSize: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: "#6c5ce7",
  },
  devButton: {
    backgroundColor: "#ff6b6b",
  },
  testButton: {
    backgroundColor: "#2ecc71",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  infoCard: {
    backgroundColor: "rgba(108, 92, 231, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(108, 92, 231, 0.3)",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#6c5ce7",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 22,
  },
  footer: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
