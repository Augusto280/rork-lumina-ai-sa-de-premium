const GITHUB_JSON_URL = "https://raw.githubusercontent.com/Augusto280/rork-lumina-ai-sa-de-premium/main/assinaturas.json";

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
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(urlComCache, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
        },
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeoutId);
      
      console.log(`[PremiumService] Status da resposta: ${response.status}`);
      console.log(`[PremiumService] Content-Type: ${response.headers.get('content-type')}`);
      
      const responseText = await response.text();
      console.log(`[PremiumService] Resposta bruta (primeiros 200 chars): ${responseText.substring(0, 200)}...`);

    if (!response.ok) {
      console.error(`[PremiumService] Erro HTTP: ${response.status}`);
      console.error(`[PremiumService] Resposta bruta: ${responseText}`);
      return {
        isPremium: false,
        erro: `Erro ao validar assinatura (HTTP ${response.status}). Tente novamente em alguns minutos.`,
      };
    }

    let data: AssinaturasResponse;
    try {
      data = JSON.parse(responseText);
      console.log("[PremiumService] Dados recebidos:", JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error("[PremiumService] Erro ao fazer parse do JSON:", parseError);
      console.error("[PremiumService] Resposta bruta completa:", responseText);
      return {
        isPremium: false,
        erro: "Erro ao processar dados de assinatura. Tente novamente.",
      };
    }

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
