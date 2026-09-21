export type AiProviderType = 'gemini' | 'openai' | 'anthropic' | 'local';

export interface AiModelDefinition {
  id: string;
  name: string;
  provider: AiProviderType;
  contextWindow: number;
  supportsVision: boolean;
  supportsTools: boolean;
  supportsEmbeddings: boolean;
  description: string;
}

export const SUPPORTED_AI_MODELS: Record<string, AiModelDefinition> = {
  'gemini-2.0-flash': {
    id: 'gemini-2.0-flash',
    name: 'Google Gemini 2.0 Flash',
    provider: 'gemini',
    contextWindow: 1048576,
    supportsVision: true,
    supportsTools: true,
    supportsEmbeddings: true,
    description: 'Ultra-fast multimodal shopping intelligence with massive context and native tool calling.',
  },
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    provider: 'openai',
    contextWindow: 128000,
    supportsVision: true,
    supportsTools: true,
    supportsEmbeddings: true,
    description: 'High-intelligence multimodal reasoning for product comparisons and deal evaluation.',
  },
  'claude-3-5-sonnet': {
    id: 'claude-3-5-sonnet',
    name: 'Anthropic Claude 3.5 Sonnet',
    provider: 'anthropic',
    contextWindow: 200000,
    supportsVision: true,
    supportsTools: true,
    supportsEmbeddings: false,
    description: 'Nuanced consumer review analysis and complex multi-product tradeoff evaluation.',
  },
  'pricewise-local-agent': {
    id: 'pricewise-local-agent',
    name: 'PriceWise Deterministic Local Agent',
    provider: 'local',
    contextWindow: 32000,
    supportsVision: true,
    supportsTools: true,
    supportsEmbeddings: true,
    description: 'High-performance offline rule-based and heuristics engine grounded strictly in real verified data.',
  },
};

export const DEFAULT_MODEL_ID = 'gemini-2.0-flash';
