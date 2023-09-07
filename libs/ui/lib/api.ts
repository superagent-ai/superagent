export class Api {
  private apiKey?: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey
  }

  async fetchFromApi(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}${endpoint}`,
      {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          authorization: `Bearer ${this.apiKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  async createAgent(payload: any) {
    return this.fetchFromApi("/agents", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async createAgentLLM(agentId: string, llmId: string) {
    return this.fetchFromApi(`/agents/${agentId}/llms`, {
      method: "POST",
      body: JSON.stringify({ llmId }),
    })
  }

  async createApiKey() {
    return this.fetchFromApi("/api-users", { method: "POST" })
  }

  async createLLM(payload: any) {
    return this.fetchFromApi("/llms", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async deleteAgentById(id: string) {
    return this.fetchFromApi(`/agents/${id}`, { method: "DELETE" })
  }

  async getAgents() {
    return this.fetchFromApi("/agents")
  }

  async getAgentById(id: string) {
    return this.fetchFromApi(`/agents/${id}`)
  }

  async getLLMs() {
    return this.fetchFromApi(`/llms`)
  }

  async patchLLM(id: string, payload: any) {
    return this.fetchFromApi(`/llms/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  }
}
