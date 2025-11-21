import { useQuery } from "@tanstack/react-query";
import { verificarAssinatura } from "./premiumService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

const STORAGE_KEY = "@lumina_user_email";

export function usePremium() {
  const [email, setEmail] = useState<string | null>(null);
  const [loadingEmail, setLoadingEmail] = useState<boolean>(true);

  useEffect(() => {
    async function loadEmail() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        console.log("[usePremium] E-mail armazenado:", stored);
        setEmail(stored);
      } catch (e) {
        console.error("[usePremium] Erro ao carregar e-mail:", e);
      } finally {
        setLoadingEmail(false);
      }
    }
    loadEmail();
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["premium", email],
    queryFn: async () => {
      if (!email) {
        console.log("[usePremium] Sem e-mail, retornando isPremium=false");
        return { isPremium: false };
      }
      console.log("[usePremium] Verificando assinatura para:", email);
      return await verificarAssinatura(email);
    },
    enabled: !loadingEmail,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const premium = data?.isPremium === true;
  const loading = loadingEmail || isLoading;

  return { 
    premium, 
    loading, 
    error, 
    refetch,
    email,
    mensagem: data?.mensagem,
    erro: data?.erro,
  };
}

export async function saveUserEmail(email: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, email);
}

export async function clearUserEmail(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
