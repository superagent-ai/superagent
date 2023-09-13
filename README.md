<div align="center">

# Superagent 🥷

**The agent framework for large language models**

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
<br />

[![Discord](https://img.shields.io/discord/837692625737613362.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/mhmJUTjW4b)
[![Twitter Follow](https://img.shields.io/twitter/follow/pelaseyed?style=social)](https://twitter.com/pelaseyed)

<br/>
<br/>

[Superagent.sh](https://Superagent.sh)

<br/>

<img alt="Superagent UI" src=".//superagent.png" />

</div>

## Superagent
Superagent is an open source agent framework that enables any developer to integrate production ready AI Agents to their applications in a matter of minutes.


## Documentation
For full documentation, visit [docs.superagent.sh](https://docs.superagent.sh)

To see how to contribute, visit [Contribution guidelines](https://github.com/homanp/Superagent/blob/main/.github/CONTRIBUTING.md)

## Getting started

<details>
<summary>Superagent API</summary>
Follow below steps to run the Superagent API. 

**Prerequisites**
Make sure you have setup a database, we recommend running PostgreSQL on Supabase.

1. Clone the Superagent repository into a public GitHub repository or fork it from [https://github.com/homanp/superagent/fork](https://github.com/homanp/superagent/fork). If you plan to distribute the code, keep the source code public.

   ```sh
   git clone https://github.com/homanp/superagent.git
   ```

2. Rename the `env.example` to `.env`  and make sure you have all mandatory values set:

3. Create a virtual environment

    ```sh
    virtualenv venv
    source venv/bin/activate
    ```

4. Install dependencies

    ```sh
    poetry install
    ```

5. Run database migrations

    ```sh
    poetry run prisma migrate dev
    ```

6. Start the server

    ```sh
    uvicorn app.main:app --reload
    ```
</details>

<details>
<summary>Superagent UI</summary>

<!-- The content under the dropdown goes here -->

</details>

<details>
<summary>Superagent legacy</summary>

<!-- The content under the dropdown goes here -->

</details>


## Use cases

## Acknowledgements
We want to give a big shout out to following open source projects, without which Superagent wouldn't be possible.

- [FastAPI](https://github.com/tiangolo/fastapi)
- [Prefect](https://github.com/PrefectHQ/prefect)
- [Supabase](https://github.com/supabase/supabase)
- [next.js](https://github.com/vercel/next.js)
- [Vercel](https://github.com/vercel)
- [Fern](https://github.com/fern-api/fern)
- [Langchain](https://github.com/langchain-ai/langchain)
- [LlamaIndex](https://github.com/jerryjliu/llama_index)
- [Prisma](https://github.com/prisma/prisma)
- [Motorhead](https://github.com/getmetal/motorhead)