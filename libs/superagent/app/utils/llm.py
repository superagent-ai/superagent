from litellm import get_llm_provider as litellm_get_llm_provider

LLM_MAPPING = {
    "GPT_3_5_TURBO_16K_0613": "gpt-3.5-turbo-16k-0613",
    "GPT_3_5_TURBO_0613": "gpt-3.5-turbo-0613",
    "GPT_3_5_TURBO_1106": "gpt-3.5-turbo-1106",
    "GPT_4_0613": "gpt-4-0613",
    "GPT_4_32K_0613": "gpt-4-32k-0613",
    "GPT_4_1106_PREVIEW": "gpt-4-1106-preview",
    "GPT_4_TURBO_PREVIEW": "gpt-4-turbo-preview",
    "GPT_3_5_TURBO_0125": "gpt-3.5-turbo-0125",
}

LLM_REVERSE_MAPPING = {v: k for k, v in LLM_MAPPING.items()}


LLM_PROVIDER_MAPPING = {
    "OPENAI": [
        "GPT_3_5_TURBO_16K_0613",
        "GPT_3_5_TURBO_0613",
        "GPT_3_5_TURBO_1106",
        "GPT_3_5_TURBO_0125",
        "GPT_4_0613",
        "GPT_4_32K_0613",
        "GPT_4_1106_PREVIEW",
        "GPT_4_TURBO_PREVIEW",
    ]
}


def get_llm_provider(model: str):
    _, provider, _, _ = litellm_get_llm_provider(model)
    provider = provider.upper()

    return provider
