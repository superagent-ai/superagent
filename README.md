# 🥷 SuperAgent

SuperAgent makes it easy to configure and deploy LLM Agents to production.

<p>
<img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/homanp/superagent" />
<img alt="GitHub Last Commit" src="https://img.shields.io/github/last-commit/homanp/superagent" />
<img alt="" src="https://img.shields.io/github/repo-size/homanp/superagent" />
<img alt="GitHub Issues" src="https://img.shields.io/github/issues/homanp/superagent" />
<img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/homanp/superagent" />
<img alt="Github License" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
</p>

## Roadmap

NOTE: The roadmap is ordered based on prios.

- [x] Bring you own DB
- [x] Authentication
- [x] ChatGPT clone
- [x] Built-in memory
- [x] REST API
- [x] Support for multiplpe LLMs
- [x] Streaming support
- [x] Built-in vectorstore
- [x] Built-in document retrieval
- [x] Q&A Agents
- [ ] Tools
- [ ] ReAct Agents with Tools
- [ ] Plan-solve Agents with Tools
- [ ] Prompt management
- [ ] Bring you own LLM
- [ ] Usage quotas and tracking
- [ ] Python SDK
- [ ] Typescript SDK
- [ ] SuperAgent CLI
- [ ] One-click deploy (GCP, Amazon, Digitalocean)

## Stack

- [FastAPI](https://fastapi.tiangolo.com/)
- [Supabase](https://supabase.com/)
- [LangChain](https://python.langchain.com/en/latest/)
- [Prisma](https://www.prisma.io/)
- [Pinecone](https://www.pinecone.io/)

## Getting started

1. Clone the repo into a public GitHub repository (or fork https://github.com/homanp/superagent/fork). If you plan to distribute the code, keep the source code public.

   ```sh
   git clone https://github.com/homanp/superagent.git
   ```

1. Create and activate a virtual environmet.

   ```sh
   virtualenv venv
   source venv/bin/activate
   ```

1. Install dependencies with `Poetry`

   ```sh
   poetry install
   ```

1. Set up your .env file

   - Duplicate `.env.example` to `.env`

1. Run the project

   ```sh
   uvicorn app.main:app --reload
   ```

## Deployment

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/homanp/superagent/tree/main)

## Contributions

Our mission is to make it easy for anyone to create and run LLM Agents in production. We are super happy for any contributions you would like to make. Create new features, fix bugs or improve on infra.

You can read more on how to contribute [here](https://github.com/homanp/superagent/blob/main/.github/CONTRIBUTING.md).
