<div align="center">

# Superagent 🥷

**Build, deploy, and manage LLM-powered agents**
[Superagent.sh](https://Superagent.sh)

<p>
<img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/homanp/Superagent" />
<img alt="GitHub Last Commit" src="https://img.shields.io/github/last-commit/homanp/Superagent" />
<img alt="" src="https://img.shields.io/github/repo-size/homanp/Superagent" />
<img alt="GitHub Issues" src="https://img.shields.io/github/issues/homanp/Superagent" />
<img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/homanp/Superagent" />
<img alt="Github License" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
<img alt="Discord" src="https://img.shields.io/discord/1110910277110743103?label=Discord&logo=discord&logoColor=white&style=plastic&color=d7b023)](https://discord.gg/e8j7mgjDUK" />
</p>

<br />

<img alt="Superagent UI" src="./ui/public/superagent.png" />

</div>

## 🧐 What is this?

Superagent is a powerful tool that simplifies the configuration and deployment of LLM (Large Language Model) Agents to production. It provides a range of features and functionalities to make it easier for developers to build, manage and deploy AI agents to production including features such as built in memory and document retrieval via vector dbs, powerful tools, webhooks, cron jobs etc.

## 🥷 Superagent Cloud

If you are looking for a plug-n-play way getting started be sure to checkout [Superagent.sh](https://Superagent.sh).

## 🔎 Documentation

Checkout the [full documentation here](https://docs.Superagent.sh/).

## 🚧 Roadmap

You can follow the [roadmap here](https://github.com/users/homanp/projects/4)

## 🛠️ Getting Started

<div align="center">
<img alt="Getting started" src="https://cdn.loom.com/sessions/thumbnails/7869ed5dc7614205b62249bedfbc49e0-1688459140526-with-play.gif" />
</div>

To get started with Superagent, follow these steps:

1. Clone the Superagent repository into a public GitHub repository or fork it from [https://github.com/homanp/Superagent/fork](https://github.com/homanp/Superagent/fork). If you plan to distribute the code, keep the source code public.

   ```sh
   git clone https://github.com/homanp/Superagent.git
   ```

2. To run the script, simply execute it using:

   ```sh
   bash setup.sh
   ```

3. See the setup instructions for the UI in the `ui` folder.

## 📦 Run locally with docker and docker compose

In the `.docker` folder there are multiple docker-compose files.

The main `docker-conpose.yml` file will start up the API and a Postgres DB in docker. You can optionally also run the UI in docker too.

The other docker compose files can be used individually, or in combination to start up just the bits you need.

> follow the guide in [.docker/README.md](.docker/README.md) file to get started

## 🌎 Environment variables

To run this project, you will need to add the following environment variables to your .env file

**Mandatory variables**

`DATABASE_URL` - A database connection string (with pooling)

`DATABASE_MIGRATION_URL` - A database connection (without pooling), used when creating/applying migrations.

`OPENAI_API_KEY` - An OpenAI API key

`JWT_SECRET` - A secret key/string

`VECTORSTORE` - Change this if you plan on supporting other vector databases.

`PINECONE_ENVIRONMENT` - Pinecone environment (found in the pinecone dashboard)

`PINECONE_API_KEY` - Pinecone API key (found in the pinecone dashboard)

`PINECONE_INDEX` - The name of the Pinecone index you would like to use

`SUPERAGENT_TRACING` - If you want to enable agent tracing

**Optional variables**

`PSYCHIC_API_KEY` - [Psychic.dev](https://psychic.dev) API key

`BING_SUBSCRIPTION_KEY` - Bing Search subscription key (found in the Azure dashboard)

`BING_SEARCH_URL` - Bing Search url (found in the Azure dashboard)

`WOLFRAM_ALPHA_APPID` - Wolfram Alpha App ID (found in your Wolfram Alpha dashboard)

`REPLICATE_API_TOKEN` - Replicate API token (found in uour [replicate](https://replication.com) dashboard)

**If you plan on using other Language Models**

`ANTHROPIC_API_KEY`

`COHERE_API_KEY`

`HUGGINGFACEHUB_API_TOKEN`

`AZURE_API_KEY`

`AZURE_API_TYPE`

`AZURE_API_BASE`

`AZURE_API_VERSION`

## 💡 Examples

- Running Superagent with [NextJS](https://github.com/homanp/nextjs-Superagent)

## 👨🏽‍💻 SDKs

- [Javascript](https://github.com/homanp/superagent-js)
- [Python](https://github.com/homanp/superagent-py)
- [Swift](https://github.com/simonweniger/superagent-swift) (community)

## 🫶 Contributions

Superagent is an open-source project, and contributions are welcome. If you would like to contribute, you can create new features, fix bugs, or improve the infrastructure. Please refer to the [CONTRIBUTING.md](https://github.com/homanp/Superagent/blob/main/.github/CONTRIBUTING.md) file in the repository for more information on how to contribute.

We appreciate your contributions and aim to make it easy for anyone to create and run LLM Agents in production using Superagent.

## ⭐ Partners

A big thanks to all partners that support the development of **Superagent**!

**🌿 [Fern](https://buildwithfern.com/)**:
Fern helps create SDKs and client libraries from OpenAPI specs. Superagent uses Fern for all of the client libraries and SDKs we provide. A big shout out for the support!

## 🙏 Support

We appreciate all the support you can give us, either with contributions, feedback, bug reports or feature requests. Drop a star and share Superagent to the world!
