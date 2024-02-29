export const initialSamlValue = `# 👋 Welcome! Start creating your workflows using example yaml below.
# More info in our docs: https://docs.superagent.sh/overview/getting-started/super-agent-markup-language

workflows:
  - superagent:
      llm: gpt-4-turbo-preview
      name: Browser assistant 
      intro: |- 
        👋 Hi there! How can I help search for answers on the internet.
      prompt: Use the browser to answer any questions
      tools:
        - browser:
            name: browser
            use_for: searching the internet
`

export const exampleConfigs = {
  browserYaml: `# 🤖 This agent workflow has access to the browser tool and can access the internet in real-time.
# More info in our docs: https://docs.superagent.sh/overview/getting-started/super-agent-markup-language

workflows:
  - superagent: 
      name: Browser assistant
      llm: gpt-3.5-turbo-16k-0613
      prompt: Use the browser to answer all questions
      intro: 👋 Hi there! How can I help you?
      tools:
        - browser:
            name: browser tool
            use_for: searching the internet`,
  ragYaml: `# 🤖 This agent workflow has access to external data.
# More info in our docs: https://docs.superagent.sh/overview/getting-started/super-agent-markup-language
  
workflows:
  - superagent: 
      name: Titanic assistant
      llm: gpt-3.5-turbo-16k-0613
      prompt: Use the excel file to answer all questions.
      intro: 👋 Hi there! How can I help you?
      data:
        urls:
          - https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv
        use_for: Answering questions about the titanic`,
  multiAssistantYaml: `# 🤖 This is an example of a multi-agent workflow.
  # More info in our docs: https://docs.superagent.sh/overview/getting-started/super-agent-markup-language
  
workflows:
  - superagent: 
      name: Code writer
      llm: gpt-4-1106-preview
      prompt: |- 
        You are an expert coder, write code based on the users input.
        Only return the filename and code.
      intro: 👋 Hi there! What code do you want me to write?
  - superagent:
      name: Code reviewer
      llm: gpt-4-1106-preview
      prompt: |- 
        You are an code reviewer. Review the code and write a 
        GitHub comment.`,
}
