export enum LLMProvider {
  OPENAI,
  AZURE_OPENAI,
  HUGGINGFACE,
}

export enum LLMModel {
  GPT_3_5_TURBO_16K_0613,
  GPT_3_5_TURBO_0613,
  GPT_3_5_TURBO_1106,
  GPT_4_0613,
  GPT_4_32K_0613,
  GPT_4_1106_PREVIEW,
  MISTRAL_7B_INSTRUCT_V01,
}

export enum DatasourceType {
  TXT,
  PDF,
  CSV,
  PPTX,
  XLSX,
  DOCX,
  GOOGLE_DOC,
  YOUTUBE,
  GITHUB_REPOSITORY,
  MARKDOWN,
  WEBPAGE,
  AIRTABLE,
  STRIPE,
  NOTION,
  SITEMAP,
  URL,
  FUNCTION,
}

export enum DatasourceStatus {
  IN_PROGRESS,
  DONE,
  FAILED,
}

export enum ToolType {
  ALGOLIA,
  BROWSER,
  BING_SEARCH,
  REPLICATE,
  WOLFRAM_ALPHA,
  ZAPIER_NLA,
  AGENT,
  OPENAPI,
  CHATGPT_PLUGIN,
  METAPHOR,
  PUBMED,
  CODE_EXECUTOR,
  OPENBB,
  GPT_VISION,
  TTS_1,
  HAND_OFF,
  FUNCTION,
}

export class ApiUser {
  id: string
  token?: string
  email?: string
  createdAt: Date
  updatedAt: Date
  agents: Agent[]
  llms: LLM[]
  datasources: Datasource[]
  tools: Tool[]
  workflows: Workflow[]

  constructor(obj: any) {
    this.id = obj.id || ""
    this.token = obj.token || ""
    this.email = obj.email || ""
    this.createdAt = obj.createdAt || new Date()
    this.updatedAt = obj.updatedAt || new Date()
    this.agents = obj.agents || []
    this.llms = obj.llms || []
    this.datasources = obj.datasources || []
    this.tools = obj.tools || []
    this.workflows = obj.workflows || []
  }
}

export class Agent {
  id: string
  name: string
  avatar?: string
  initialMessage?: string
  description: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  llms: AgentLLM[]
  llmModel: LLMModel
  prompt?: string
  apiUserId: string
  apiUser: ApiUser
  datasources: AgentDatasource[]
  tools: AgentTool[]
  workflowSteps: WorkflowStep[]

  constructor(obj: any) {
    this.id = obj.id || ""
    this.name = obj.name || ""
    this.avatar = obj.avatar || ""
    this.initialMessage = obj.initialMessage || ""
    this.description = obj.description || "Add a agent description..."
    this.isActive = obj.isActive || false
    this.createdAt = obj.createdAt || new Date()
    this.updatedAt = obj.updatedAt || new Date()
    this.llms = obj.llms || []
    this.llmModel = obj.llmModel || LLMModel.GPT_3_5_TURBO_16K_0613
    this.prompt = obj.prompt || ""
    this.apiUserId = obj.apiUserId || ""
    this.apiUser = obj.apiUser || null
    this.datasources = obj.datasources || []
    this.tools = obj.tools || []
    this.workflowSteps = obj.workflowSteps || []
  }
}

export class Datasource {
  id: string
  name: string
  content?: string
  description?: string
  url?: string
  type: DatasourceType
  apiUserId: string
  apiUser: ApiUser
  createdAt: Date
  updatedAt: Date
  metadata?: string
  status: DatasourceStatus
  datasources: AgentDatasource[]

  constructor(obj: any) {
    this.id = obj.id || ""
    this.name = obj.name || ""
    this.content = obj.content || ""
    this.description = obj.description || ""
    this.url = obj.url || ""
    this.type = obj.type || DatasourceType
    this.apiUserId = obj.apiUserId || ""
    this.apiUser = obj.apiUser || null
    this.createdAt = obj.createdAt || new Date()
    this.updatedAt = obj.updatedAt || new Date()
    this.metadata = obj.metadata || ""
    this.status = obj.status || DatasourceStatus.IN_PROGRESS
    this.datasources = obj.datasources || []
  }
}

export class AgentDatasource {
  agentId: string
  datasourceId: string
  agent: Agent
  datasource: Datasource
  createdAt: Date
  updatedAt: Date

  constructor(obj: any) {
    this.agentId = obj.agentId || ""
    this.datasourceId = obj.datasourceId || ""
    this.agent = obj.agent || null
    this.datasource = obj.datasource || null
    this.createdAt = obj.createdAt || new Date()
    this.updatedAt = obj.updatedAt || new Date()
  }
}

export class Tool {
  id: string
  name: string
  description: string
  type: ToolType
  returnDirect: boolean
  metadata: string
  createdAt: Date
  updatedAt: Date
  apiUserId: string
  apiUser: ApiUser
  tools: AgentTool[]

  constructor(obj: any) {
    this.id = obj.id || ""
    this.name = obj.name || ""
    this.description = obj.description || ""
    this.type = obj.type || ToolType
    this.returnDirect = obj.returnDirect || false
    this.metadata = obj.metadata || ""
    this.createdAt = obj.createdAt || new Date()
    this.updatedAt = obj.updatedAt || new Date()
    this.apiUserId = obj.apiUserId || ""
    this.apiUser = obj.apiUser || null
    this.tools = obj.tools || []
  }
}

export class AgentTool {
  agentId: string
  toolId: string
  agent: Agent
  tool: Tool
  createdAt: Date
  updatedAt: Date

  constructor(obj: any) {
    this.agentId = obj.agentId || ""
    this.toolId = obj.toolId || ""
    this.agent = obj.agent || null
    this.tool = obj.tool || null
    this.createdAt = obj.createdAt || new Date()
    this.updatedAt = obj.updatedAt || new Date()
  }
}

export class LLM {
  id: string
  provider: LLMProvider
  apiKey: string
  options?: JSON
  agents: AgentLLM[]
  createdAt: Date
  updatedAt: Date
  apiUserId: string
  apiUser: ApiUser

  constructor(obj: any) {
    this.id = obj.id || ""
    this.provider = obj.provider || LLMProvider.OPENAI
    this.apiKey = obj.apiKey || ""
    this.options = obj.options || null
    this.agents = obj.agents || []
    this.createdAt = obj.createdAt || new Date()
    this.updatedAt = obj.updatedAt || new Date()
    this.apiUserId = obj.apiUserId || ""
    this.apiUser = obj.apiUser || null
  }
}

export class AgentLLM {
  agentId: string
  llmId: string
  agent: Agent
  llm: LLM
  createdAt: Date
  updatedAt: Date

  constructor(obj: any) {
    this.agentId = obj.agentId || ""
    this.llmId = obj.llmId || ""
    this.agent = obj.agent || null
    this.llm = obj.llm || null
    this.createdAt = obj.createdAt || new Date()
    this.updatedAt = obj.updatedAt || new Date()
  }
}

export class Workflow {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  steps: WorkflowStep[]
  apiUserId: string
  apiUser: ApiUser

  constructor(obj: any) {
    this.id = obj.id || ""
    this.name = obj.name || ""
    this.description = obj.description || ""
    this.createdAt = obj.createdAt || new Date()
    this.updatedAt = obj.updatedAt || new Date()
    this.steps = obj.steps || []
    this.apiUserId = obj.apiUserId || ""
    this.apiUser = obj.apiUser || null
  }
}

export class WorkflowStep {
  id: string
  order: number
  workflowId: string
  workflow: Workflow
  createdAt: Date
  updatedAt: Date
  input: string
  output: string
  agentId: string
  agent: Agent

  constructor(obj: any) {
    this.id = obj.id || ""
    this.order = obj.order || 0
    this.workflowId = obj.workflowId || ""
    this.workflow = obj.workflow || null
    this.createdAt = obj.createdAt || new Date()
    this.updatedAt = obj.updatedAt || new Date()
    this.input = obj.input || ""
    this.output = obj.output || ""
    this.agentId = obj.agentId || ""
    this.agent = obj.agent || null
  }
}
