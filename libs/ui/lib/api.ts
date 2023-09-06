export class Api {
  private apiKey?: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey
  }

  async createApiKey() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/api-users`,
      { method: "POST" }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  async getData(endpoint: string) {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }
}
