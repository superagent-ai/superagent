import os
from superagent.client import Superagent

client = Superagent(
    base_url="http://localhost:8000",
    token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfdXNlcl9pZCI6ImViZmE1OTcwLWZhMjEtNDNjNC05NDA2LTJlMmJmNDBiNmU5ZSJ9.BEyAzLFoffQwC2gym30oknYWcZ6E4hsjpNxZa8kpjQ4'
)

# llm = client.llm.create(request={
#     "provider": "OPENAI",
#     "apiKey": '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'
# })

# agent e7c4df46-59aa-4092-b0ac-26161f0c02bc
# User ID ebfa5970-fa21-43c4-9406-2e2bf40b6e9e
# llm 054704a4-37f6-4e88-8560-70626fed56bc
llm = client.llm.get('81227ea0-38dc-41a3-959b-1829c995bfa4')



# {
#   "isActive": true,
#   "name": "Chat Assistant",
#   "initialMessage": "Hi there! How can I help you?",
#   "prompt": "You are an helpful AI Assistant",
#   "llmModel": "GPT_3_5_TURBO_16K_0613",
#   "description": "My first Assistant",
#   "avatar": "My first Assistant"
# }

agent = client.agent.create(request={
    "name": "Chat Assistant",
    "description": "My first Assistant",
    "avatar": "https://myavatar.com/homanp.png",
    "isActive": True,
    "initialMessage": "Hi there! How can I help you?",
    "llmModel": "GPT_3_5_TURBO_16K_0613",
    "prompt": "You are an helpful AI Assistant",
})


client.agent.add_llm(agent_id=agent.data.id, llm_id=llm.data.id)


# {
#   "input": "Hi there",
#   "sessionId": "string",
#   "enableStreaming": true
# }
prediction = client.agent.invoke(
    agent_id=agent.data.id,
    input="Hi there!",
    enable_streaming=False,
    session_id="my_session"  # Best practice is to create a unique session per user
)

print(prediction.data.get("output"))
