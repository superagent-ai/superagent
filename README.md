# SuperAgent 🥷

<p>
<img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/homanp/superagent" />
<img alt="GitHub Last Commit" src="https://img.shields.io/github/last-commit/homanp/superagent" />
<img alt="" src="https://img.shields.io/github/repo-size/homanp/superagent" />
<img alt="GitHub Issues" src="https://img.shields.io/github/issues/homanp/superagent" />
<img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/homanp/superagent" />
<img alt="Github License" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
<img alt="Discord" src="https://img.shields.io/discord/1110910277110743103?label=Discord&logo=discord&logoColor=white&style=plastic&color=d7b023)](https://discord.gg/e8j7mgjDUK" />
</p>

SuperAgent is a powerful tool that simplifies the configuration and deployment of LLM (Large Language Model) Agents to production. It provides a range of features and functionalities to make it easier for developers to build, manage and deploy AI agents to production including features such as built in memory and document retrieval via vector dbs.

## Documentation

Checkout the [full documentation here](https://superagent.mintlify.app/).

## Roadmap

Here's an overview of the roadmap for SuperAgent:

- [x] **Bring your own DB:** SuperAgent allows you to use your own database to store agent-related data.
- [x] **Authentication:** Authentication mechanisms are implemented to secure the SuperAgent application.
- [x] **ChatGPT clone:** SuperAgent supports chatGPT-like conversational AI.
- [x] **Built-in memory:** SuperAgent has a built-in memory to give context and history to the LLM.
- [x] **REST API:** All functionality is exposed by a REST API.
- [x] **Support for multiple LLMs:** SuperAgent supports multiple Language Models, allowing you to choose the most suitable one for your needs.
- [x] **Streaming support:** SuperAgent supports streaming conversations for real-time communication.
- [x] **Built-in vectorstore:** SuperAgent includes a built-in vector store for efficient vector-based search and retrieval.
- [x] **Built-in document retrieval:** SuperAgent offers document retrieval capabilities.
- [x] **Q&A Agents:** SuperAgent supports the creation of Q&A agents for question answering over documents.
- [x] **Prompt management:** SuperAgent includes features for managing and configuring prompts for the agents.
- [ ] **Tools:** SuperAgent will include a wide variety of tools that enable the LLM to access the outside world.
- [ ] **ReAct Agents with Tools:** SuperAgent enables the creation of reactive agents with the help of provided tools.
- [ ] **Plan-solve Agents with Tools:** SuperAgent supports the creation of plan-solve agents with the help of provided tools.
- [ ] **Bring your own LLM:** SuperAgent allows you to bring your own Language Model to use with the platform.
- [ ] **Usage quotas and tracking:** SuperAgent provides usage quotas and tracking mechanisms for better resource management.
- [ ] **Python SDK:** SuperAgent offers a Python Software Development Kit (SDK) for easier integration and development.
- [ ] **Javascript SDK:** SuperAgent provides a Javascript SDK for developers who prefer using Javascript.
- [ ] **NodeJS SDK:** SuperAgent provides a NodeJS SDK for developers who prefer using Node.
- [ ] **SuperAgent CLI:** SuperAgent includes a command-line interface (CLI) for managing and deploying agents.
- [ ] **One-click deploy (GCP, Amazon, DigitalOcean):** SuperAgent aims to provide a one-click deploy feature for popular cloud platforms like GCP, Amazon, and DigitalOcean.

## Stack

SuperAgent is built on the following technologies and frameworks:

- [FastAPI](https://fastapi.tiangolo.com/): A modern, fast (high-performance) web framework for building APIs with Python.
- [Supabase](https://supabase.com/): An open-source alternative to Firebase that provides a suite of tools for building scalable applications.
- [LangChain](https://python.langchain.com/en/latest/): A Python library for natural language processing and understanding.
- [Prisma](https://www.prisma.io/): A modern database toolkit that simplifies database access and management.
- [Pinecone](https://www.pinecone.io/): A vector database that enables fast similarity search and retrieval.

## Getting Started

To get started with SuperAgent, follow these steps:

1. Clone the SuperAgent repository into a public GitHub repository or fork it from [https://github.com/homanp/superagent/fork](https://github.com/homanp/superagent/fork). If you plan to distribute the code, keep the source code public.

   ```sh
   git clone https://github.com/homanp/superagent.git
   ```

2. To run the script, simply execute it using:
   ```sh
   bash setup.sh
   ```

## Deployment

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/homanp/superagent/tree/main)

## Contributions

SuperAgent is an open-source project, and contributions are welcome. If you would like to contribute, you can create new features, fix bugs, or improve the infrastructure. Please refer to the [CONTRIBUTING.md](https://github.com/homanp/superagent/blob/main/.github/CONTRIBUTING.md) file in the repository for more information on how to contribute.

We appreciate your contributions and aim to make it easy for anyone to create and run LLM Agents in production using SuperAgent.
