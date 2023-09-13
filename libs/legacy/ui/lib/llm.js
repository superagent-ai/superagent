export const LLMS = [
  {
    id: "openai",
    name: "OpenAI",
    models: [
      "text-davinci-003",
      "text-curie-001",
      "text-ada-001",
      "text-babbage-001",
    ],
  },
  {
    id: "openai-chat",
    name: "OpenAI Chat",
    models: [
      "gpt-3.5-turbo",
      "gpt-3.5-turbo-16k",
      "gpt-4",
      "gpt-4-0613",
      "gpt-3.5-turbo-16k-0613",
      "gpt-3.5-turbo-0613",
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: ["claude-v1", "claude-2"],
  },
  {
    id: "cohere",
    name: "Cohere",
    models: [
      "command",
      "command-nightly",
      "command-light",
      "command-light-nightly",
    ],
  },
  {
    id: "huggingface",
    name: "Hugging Face Hub",
    models: null,
  },
];
