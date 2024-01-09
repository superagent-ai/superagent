import aiohttp
from aiohttp import ClientSession

from os import getenv

CHATWOOT_API_URL = getenv("CHATWOOT") + "accounts/"
SUBSCRIPTION = getenv("SUBSCRIPTION")


async def enviar_respuesta_chatwoot(conversation_id, respuesta, token, account_id, es_respuesta_de_bot=True):
    str_account_id = str(account_id)
    str_conversation_id = str(conversation_id)
    url = f"{CHATWOOT_API_URL}{str_account_id}/conversations/{str_conversation_id}/messages"

    headers = {"Content-Type": "application/json", "api_access_token": token, 'Ocp-Apim-Subscription-Key': SUBSCRIPTION}

    data = {"content": respuesta, "message_type": "outgoing", "private": False}
    # No incluir el sender si la respuesta es del bot
    if not es_respuesta_de_bot:
        data["sender"] = {"name": "John", "available_name": "John"}

    async with ClientSession() as session:
        async with session.post(url, headers=headers, json=data) as response:
            if response.status != 200:
                error_message = f"Failed to send message, status: {response.status}"
                return {"error": error_message}
            return await response.json()
