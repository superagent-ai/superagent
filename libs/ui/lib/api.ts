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
        headers: { ...options.headers, authorization: `Bearer ${this.apiKey}` },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  async createApiKey() {
    return this.fetchFromApi("/api-users", { method: "POST" })
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
}
