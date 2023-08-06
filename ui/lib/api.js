class API {
  constructor(session) {
    this.token = session.user.token || `oauth_${session.oauthToken}`;
    this.user = session.user.user || session.user;
  }

  getHeaders() {
    return {
      authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  async getApiTokens() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/api-tokens`,
      {
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async getAgents() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents`,
      {
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async getLibrary() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents/library`,
      {
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async getAgentById(id) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents/${id}`,
      {
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async getAgentDocuments(agentId) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agent-documents?filter[agentId]=${agentId}&expand=true`,
      {
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async getAgentTools(agentId) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agent-tools?filter[agentId]=${agentId}&expand=true`,
      {
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async getDocuments() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/documents`,
      {
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async getLogs() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/traces`,
      {
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async getPrompts() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/prompts`,
      {
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async getTags() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/tags`,
      {
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async getTools() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/tools`,
      {
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async createApiToken({ description }) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/api-tokens`,
      {
        method: "POST",
        body: JSON.stringify({ description }),
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async createAgent(payload) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents`,
      {
        method: "POST",
        body: JSON.stringify({ ...payload }),
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async createAgentTool(payload) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agent-tools`,
      {
        method: "POST",
        body: JSON.stringify({ ...payload }),
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async createAgentDocument(payload) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agent-documents`,
      {
        method: "POST",
        body: JSON.stringify({ ...payload }),
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async createDocument(payload) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/documents`,
      {
        method: "POST",
        body: JSON.stringify({ ...payload }),
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async createPrompt(payload) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/prompts`,
      {
        method: "POST",
        body: JSON.stringify({ ...payload }),
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async createTag(payload) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/tags`,
      {
        method: "POST",
        body: JSON.stringify({ ...payload }),
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async createTool(payload) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/tools`,
      {
        method: "POST",
        body: JSON.stringify({ ...payload }),
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async deleteApiToken({ id }) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/api-tokens/${id}`,
      {
        method: "DELETE",
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async deleteAgent({ id }) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents/${id}`,
      {
        method: "DELETE",
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async deleteDocument({ id }) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/documents/${id}`,
      {
        method: "DELETE",
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async deleteAgentDocument({ id }) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agent-documents/${id}`,
      {
        method: "DELETE",
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async deleteAgentTool({ id }) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agent-tools/${id}`,
      {
        method: "DELETE",
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async deletePrompt({ id }) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/prompts/${id}`,
      {
        method: "DELETE",
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async deleteTag({ id }) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/tags/${id}`,
      {
        method: "DELETE",
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async deleteTool({ id }) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/tools/${id}`,
      {
        method: "DELETE",
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async patchAgent(id, payload) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents/${id}`,
      {
        method: "PATCH",
        headers: {
          ...this.getHeaders(),
        },
        body: JSON.stringify(payload),
      }
    );
    const { data } = await response.json();

    return data;
  }

  async patchPrompt(id, payload) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/prompts/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ ...payload }),
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async patchDocument(id, payload) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/documents/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ ...payload }),
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }

  async patchTool(id, payload) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/tools/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ ...payload }),
        headers: {
          ...this.getHeaders(),
        },
      }
    );
    const { data } = await response.json();

    return data;
  }
}

module.exports = API;
