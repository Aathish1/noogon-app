const API_BASE_URL = __DEV__
  ? 'http://localhost:3001'
  : 'https://api.forge-app.com'; // Production URL (placeholder)

interface QuestionResponse {
  id: number;
  type: string;
  text: string;
}

interface HealthResponse {
  status: string;
  name: string;
  version: string;
  timestamp: string;
}

/**
 * API client for the Forge Express backend.
 * Used for fetching disconnect prompt questions.
 */
class ForgeAPIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /** Health check */
  async health(): Promise<HealthResponse> {
    return this.fetch<HealthResponse>('/api/health');
  }

  /** Get a random disconnect challenge question */
  async getRandomQuestion(): Promise<QuestionResponse> {
    return this.fetch<QuestionResponse>('/api/questions/random');
  }

  /** Get a random question by type */
  async getQuestionByType(type: string): Promise<QuestionResponse> {
    return this.fetch<QuestionResponse>(`/api/questions/type/${type}`);
  }
}

// Singleton
export const apiClient = new ForgeAPIClient(API_BASE_URL);
