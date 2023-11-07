import io

from langchain.tools import BaseTool
from openai import AsyncOpenAI, OpenAI
from pydub import AudioSegment
from pydub.playback import play


class TTS1(BaseTool):
    name = "text-to-speech"
    description = "useful for generation voice audio from text"
    return_direct = False

    def _run(self, input: dict) -> str:
        client = OpenAI(api_key=self.metadata["openaiApiKey"])
        response = client.audio.speech.create(
            model="tts-1",
            voice=input["voice"],
            input=input["text"],
        )

        # Convert the binary response content to a byte stream
        byte_stream = io.BytesIO(response.content)

        # Read the audio data from the byte stream
        audio = AudioSegment.from_file(byte_stream, format="mp3")

        # Play the audio
        play(audio)

    async def _arun(self, input: dict) -> str:
        client = AsyncOpenAI(api_key=self.metadata["openaiApiKey"])
        response = await client.audio.speech.create(
            model="tts-1",
            voice=input["voice"],
            input=input["text"],
        )

        # Convert the binary response content to a byte stream
        byte_stream = io.BytesIO(response.content)

        # Read the audio data from the byte stream
        audio = AudioSegment.from_file(byte_stream, format="mp3")

        # Play the audio
        play(audio)
