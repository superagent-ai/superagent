from pathlib import Path

from langchain_community.tools import BaseTool
from openai import AsyncOpenAI, OpenAI


class TTS1(BaseTool):
    name = "text-to-speech"
    description = "useful for generation voice audio from text"
    return_direct = False

    def _run(self, input: dict) -> str:
        client = OpenAI(api_key=self.metadata["openaiApiKey"])
        speech_file_path = Path(__file__).parent / "speech.mp3"
        response = client.audio.speech.create(
            model="tts-1",
            voice=input["voice"] or "alloy",
            input=input["text"],
        )
        output = response.stream_to_file(speech_file_path)
        return output

    async def _arun(self, input: dict) -> str:
        client = AsyncOpenAI(api_key=self.metadata["openaiApiKey"])
        speech_file_path = Path(__file__).parent / "speech.mp3"
        response = await client.audio.speech.create(
            model="tts-1",
            voice=input["voice"] or "alloy",
            input=input["text"],
        )
        output = response.stream_to_file(speech_file_path)
        return output
