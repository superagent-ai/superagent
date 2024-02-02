import { JSONSchema7 } from "json-schema"

export const initialSamlValue = `# 👋 Welcome! Start creating your workflows using example yaml below.
# More info in our docs: https://docs.superagent.sh

workflows:
  - superagent: 
      name: Earnings assistant
      llm: gpt-4-1106-preview
      prompt: Use the earnings report to answer any questions
      intro: 👋 Hi there! How can I help you?
      data: # This is for structured and unstructured data
        use_for: Answering questions about earning reports
        urls:
          - "https://s2.q4cdn.com/299287126/files/doc_financials/2023/q3/AMZN-Q3-2023-Earnings-Release.pdf"
`
// TODO: get this from the backend after migrating to pydantic version 2
export const yamlJsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",

  type: "object",
  properties: {
    workflows: {
      type: "array",
      items: {
        type: "object",
        properties: {
          superagent: {
            $ref: "#/definitions/assistant",
          },
          opeani_assistants: {
            $ref: "#/definitions/assistant",
          },
        },
      },
    },
  },
  definitions: {
    assistant: {
      type: "object",
      properties: {
        name: { type: "string" },
        llm: { type: "string" },
        prompt: { type: "string" },
        intro: { type: "string" },
        data: {
          type: "object",
          properties: {
            use_for: { type: "string" },
            urls: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        tools: {
          type: "array",
          items: {
            type: "object",
            properties: {
              browser: {
                $ref: "#/definitions/tool",
              },
              code_executor: {
                $ref: "#/definitions/tool",
              },
              hand_off: {
                $ref: "#/definitions/tool",
              },
              http: {
                $ref: "#/definitions/tool",
              },
              bing_search: {
                $ref: "#/definitions/tool",
              },
              replicate: {
                $ref: "#/definitions/tool",
              },
              algolia: {
                $ref: "#/definitions/tool",
              },
              metaphor: {
                $ref: "#/definitions/tool",
              },
              function: {
                $ref: "#/definitions/tool",
              },
            },
          },
        },
      },
    },
    tool: {
      type: "object",
      properties: {
        name: { type: "string" },
        use_for: { type: "string" },
        metadata: {
          type: "object",
          properties: {
            headers: {
              type: "object",
              additionalProperties: { type: "string" },
            },
            url: { type: "string" },
            method: { type: "string" },
            body: { type: "object" },
          },
        },
      },
    },
  },
  required: ["workflows"],
} satisfies JSONSchema7
