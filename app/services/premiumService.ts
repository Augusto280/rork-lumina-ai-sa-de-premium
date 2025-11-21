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

    const timestamp = Date.now();
    const urlComCache = `${GITHUB_JSON_URL}?t=${timestamp}`;
    console.log(`[PremiumService] URL completa: ${urlComCache}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(urlComCache, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

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

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("[PremiumService] Erro no fetch:", fetchError);
      
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          console.error("[PremiumService] Timeout na requisição");
          return {
            isPremium: false,
            erro: "Timeout ao conectar. Verifique sua conexão com a internet.",
          };
        }
        console.error("[PremiumService] Detalhes do erro:", fetchError.message);
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error("[PremiumService] Erro ao verificar assinatura:", error);
    
    let mensagemErro = "Erro ao validar assinatura. Verifique sua conexão com a internet e tente novamente.";
    
    if (error instanceof Error) {
      console.error("[PremiumService] Tipo de erro:", error.name);
      console.error("[PremiumService] Mensagem de erro:", error.message);
      
      if (error.message.includes("Network") || error.message.includes("Failed to fetch")) {
        mensagemErro = "Erro de conexão. Verifique se você está conectado à internet.";
      }
    }
    
    return {
      isPremium: false,
      erro: mensagemErro,
    };
  }
}
