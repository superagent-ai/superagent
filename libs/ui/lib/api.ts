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

  async createAgentTool(agentId: string, toolId: string) {
    return this.fetchFromApi(`/agents/${agentId}/tools`, {
      method: "POST",
      body: JSON.stringify({ toolId }),
    })
  }

  async createApiKey(email: string) {
    return this.fetchFromApi("/api-users", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async createDatasource(payload: any) {
    return this.fetchFromApi("/datasources", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async createAgentDatasource(agentId: string, datasourceId: string) {
    return this.fetchFromApi(`/agents/${agentId}/datasources`, {
      method: "POST",
      body: JSON.stringify({ datasourceId }),
    })
  }

  async createLLM(payload: any) {
    return this.fetchFromApi("/llms", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async createTool(payload: any) {
    return this.fetchFromApi("/tools", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async deleteAgentById(id: string) {
    return this.fetchFromApi(`/agents/${id}`, { method: "DELETE" })
  }

  async deleteAgentTool(id: string, toolId: string) {
    return this.fetchFromApi(`/agents/${id}/tools/${toolId}`, {
      method: "DELETE",
    })
  }

  async deleteAgentDatasource(id: string, datasourceId: string) {
    return this.fetchFromApi(`/agents/${id}/datasources/${datasourceId}`, {
      method: "DELETE",
    })
  }

  async deleteAgentLLM(agentId: string, llmId: string) {
    return this.fetchFromApi(`/agents/${agentId}/llms/${llmId}`, {
      method: "DELETE",
    })
  }

  async deleteDatasource(id: string) {
    return this.fetchFromApi(`/datasources/${id}`, { method: "DELETE" })
  }

  async deleteTool(id: string) {
    return this.fetchFromApi(`/tools/${id}`, { method: "DELETE" })
  }

  async getAgents() {
    return this.fetchFromApi("/agents")
  }

  async getAgentById(id: string) {
    return this.fetchFromApi(`/agents/${id}`)
  }

  async getAgentRuns(id: string) {
    return this.fetchFromApi(`/agents/${id}/runs`)
  }

  async getDatasources() {
    return this.fetchFromApi(`/datasources`)
  }

  async getLLMs() {
    return this.fetchFromApi(`/llms`)
  }

  async getTools() {
    return this.fetchFromApi("/tools")
  }

  async patchAgent(id: string, payload: any) {
    return this.fetchFromApi(`/agents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  }

  async patchDatasource(id: string, payload: any) {
    return this.fetchFromApi(`/datasources/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  }

  async patchLLM(id: string, payload: any) {
    return this.fetchFromApi(`/llms/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  }

  async patchTool(id: string, payload: any) {
    return this.fetchFromApi(`/tools/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  }
}
