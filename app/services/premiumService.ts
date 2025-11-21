const GITHUB_JSON_URL = "https://augusto280.github.io/rork-lumina-ai-sa-de-premium/assinaturas.json";

export interface AssinaturaData {
  status: string;
  plano: string;
  atualizadoEm: number;
  expiraEm: number;
}

export interface AssinaturasResponse {
  assinaturas: {
    [email: string]: AssinaturaData;
  };
}

export interface VerificacaoResult {
  isPremium: boolean;
  mensagem?: string;
  erro?: string;
}

export async function verificarAssinatura(email: string): Promise<VerificacaoResult> {
  try {
    console.log(`[PremiumService] Verificando assinatura para: ${email}`);
    console.log(`[PremiumService] Buscando de: ${GITHUB_JSON_URL}`);

    const response = await fetch(GITHUB_JSON_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      console.error(`[PremiumService] Erro HTTP: ${response.status}`);
      return {
        isPremium: false,
        erro: "Erro ao validar assinatura. Tente novamente em alguns minutos.",
      };
    }

    const data: AssinaturasResponse = await response.json();
    console.log("[PremiumService] Dados recebidos:", JSON.stringify(data, null, 2));

    if (!data.assinaturas) {
      console.error("[PremiumService] Formato de JSON inválido");
      return {
        isPremium: false,
        erro: "Erro ao validar assinatura. Tente novamente em alguns minutos.",
      };
    }

    const assinatura = data.assinaturas[email];

    if (!assinatura) {
      console.log(`[PremiumService] E-mail não encontrado: ${email}`);
      return {
        isPremium: false,
        mensagem: "Não encontramos pagamento para este e-mail. Aguarde alguns minutos e tente novamente.",
      };
    }

    console.log("[PremiumService] Assinatura encontrada:", assinatura);

    if (assinatura.status !== "ativo") {
      console.log(`[PremiumService] Status inválido: ${assinatura.status}`);
      return {
        isPremium: false,
        mensagem: "Sua assinatura não está ativa.",
      };
    }

    if (assinatura.plano !== "premium") {
      console.log(`[PremiumService] Plano inválido: ${assinatura.plano}`);
      return {
        isPremium: false,
        mensagem: "Plano não é Premium.",
      };
    }

    const agora = Date.now();
    console.log(`[PremiumService] Timestamp atual: ${agora}`);
    console.log(`[PremiumService] Expira em: ${assinatura.expiraEm}`);

    if (assinatura.expiraEm && assinatura.expiraEm < agora) {
      console.log("[PremiumService] Assinatura expirada");
      return {
        isPremium: false,
        mensagem: "Sua assinatura expirou.",
      };
    }

    console.log("[PremiumService] ✅ Assinatura válida!");
    return {
      isPremium: true,
      mensagem: "Premium ativado com sucesso!",
    };

  } catch (error) {
    console.error("[PremiumService] Erro ao verificar assinatura:", error);
    return {
      isPremium: false,
      erro: "Erro ao validar assinatura. Tente novamente em alguns minutos.",
    };
  }
}
