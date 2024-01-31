export const defaultYaml = `workflows:
  - superagent: 
      name: Earnings assistant
      llm: gpt-4-1106-preview
      prompt: Use the earnings report to answer any questions
      intro: 👋 Hi there! How can I help you?
      data: # This is for structured and unstructured data
        use_for: Answering questions about earning reports
        urls:
          - https://s2.q4cdn.com/299287126/files/doc_financials/2023/q3/AMZN-Q3-2023-Earnings-Release.pdf`

export const yamlSchema = {
  workflows: [
    {
      superagent: {
        name: "My assistant",
        llm: "gpt-4-1106-preview",
        prompt: "You are a helpful AI assitant.",
        intro: "👋 Hi there! How can I help you?",
        data: {
          use_for: "Querying internal data",
          urls: [
            "https://acme.inc/test.pdf",
            "https://acme.inc/transactions.csv",
          ],
        },
        tools: [
          {
            browser: {
              name: "Browser",
              use_for: "Finding information on the internet",
            },
          },
          {
            code_interpreter: {
              name: "Code interpreter",
              use_for: "Writing and executing code",
            },
          },
          {
            human_handoff: {
              name: "Human hand-off",
            },
          },
          {
            http: {
              name: "My custom api",
              use_for: "Use for making http requests",
              metadata: {
                headers: {
                  Authorization: "Bearer <token>",
                },
                url: "<url>",
                method: "post",
                body: {
                  title: "string",
                },
              },
            },
          },
          {
            bing_search: {
              name: "Bing search",
              use_for: "Use for accessing Bing Search",
              metadata: {
                bingSearchUrl: "<bing_search_url>",
                bingSubscriptionKey: "<bing_subscription_key>",
              },
            },
          },
          {
            replicate: {
              name: "SDXL Image generator",
              use_for: "Use for generating something with a model on Replicate",
              metadata: {
                model: "<model>",
                apiKey: "<api_key>",
                arguments: {
                  key: "value",
                },
              },
            },
          },
          {
            algolia: {
              name: "My index",
              use_for: "Querying an index",
              metadata: {
                apiId: "<api_key>",
                apiKey: "<api_key>",
                index: "<index>",
              },
            },
          },
          {
            metaphor: {
              name: "Metaphor Search",
              use_for: "Search the internet",
              metadata: {
                metaphorApiKey: "<api_key>",
              },
            },
          },
          {
            function: {
              name: "my_function",
              use_for: "Call my custom function",
              arguments: {
                name: "string",
                title: "string",
              },
            },
          },
        ],
      },
    },
  ],
}
