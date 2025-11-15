import { GoogleGenAI, Type } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";
import { Timeframe } from "../App";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const createPrompt = (timeframe: Timeframe) => `
Você é um assistente especialista em análise técnica de gráficos de preços. Sua função é analisar uma imagem de um gráfico financeiro e retornar uma análise E uma sugestão baseada nos padrões visuais. A análise deve ser feita considerando o timeframe de ${timeframe}.

REGRAS ESTRITAS DE ANÁLISE:
1. Sua análise deve ser puramente descritiva e baseada nos seguintes elementos técnicos visuais: Tendência Predominante (identificando claramente se é de alta, baixa ou lateral, e se há uma LTA - Linha de Tendência de Alta ou LTB - Linha de Tendência de Baixa visível), Topos e Fundos, Volatilidade, Candles de Força, Suporte e Resistência, Movimento Recente. A análise deve ser relevante para o timeframe de ${timeframe}.
2. Adicionalmente, identifique a presença de padrões gráficos clássicos, se existirem. Os padrões a serem procurados incluem: Cabeça e Ombros (e suas variações, como o Invertido), Topo Duplo, Fundo Duplo, Fundo Arredondado, Copo e Alça, Cunhas, Flâmulas, Bandeiras, Triângulo Ascendente, Triângulo Descendente e Triângulo Simétrico. Descreva o padrão identificado e o que ele normalmente sinaliza no contexto da análise técnica.
3. NUNCA, em hipótese alguma, preveja o futuro do preço com certeza. Não use frases como "o preço vai subir", "o preço vai descer", etc.
4. Use uma linguagem neutra e técnica. Em vez de prever, use frases como: "O padrão visual sugere uma força compradora.", "Observa-se uma pressão vendedora nas últimas velas."

REGRAS DE SUGESTÃO:
1. Com base na sua análise do timeframe ${timeframe}, você deve fornecer uma sugestão.
2. A sugestão deve ser estritamente uma das três opções: 'CALL', 'PUT', ou 'NEUTRAL'.
3. 'CALL' se os padrões visuais indicam predominantemente força compradora.
4. 'PUT' se os padrões visuais indicam predominantemente força vendedora.
5. 'NEUTRAL' se os sinais são mistos, pouco claros, ou o mercado parece lateralizado sem um viés claro.

O formato da sua resposta DEVE ser um JSON.
`;

export interface AnalysisResult {
  analysis: string;
  suggestion: 'CALL' | 'PUT' | 'NEUTRAL';
}

export const analyzeChartImage = async (file: File, timeframe: Timeframe): Promise<AnalysisResult> => {
  const base64Image = await fileToBase64(file);

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: file.type,
    },
  };

  const textPart = {
    text: createPrompt(timeframe),
  };
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: 'A análise técnica detalhada baseada nos padrões visuais do gráfico, incluindo padrões clássicos.',
            },
            suggestion: {
              type: Type.STRING,
              description: "A sugestão baseada na análise, que deve ser 'CALL', 'PUT', ou 'NEUTRAL'.",
            },
          },
          required: ["analysis", "suggestion"],
        },
      },
    });
    
    const resultJson = JSON.parse(response.text);

    if (!['CALL', 'PUT', 'NEUTRAL'].includes(resultJson.suggestion)) {
      console.warn(`Received invalid suggestion: ${resultJson.suggestion}. Defaulting to NEUTRAL.`);
      resultJson.suggestion = 'NEUTRAL';
    }

    return resultJson as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    throw new Error("Falha na comunicação ou no processamento da resposta do serviço de IA.");
  }
};