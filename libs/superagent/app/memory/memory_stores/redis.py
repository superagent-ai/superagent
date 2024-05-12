from asyncio import get_event_loop

from redis import Redis

from app.memory.memory_stores.base import BaseMemoryStore
from app.memory.message import BaseMessage


class RedisMemoryStore(BaseMemoryStore):
    key_prefix: str = "message_history:"

    def __init__(self, uri: str, session_id: str):
        self.redis = Redis.from_url(uri)
        self.session_id = session_id

    @property
    def key(self):
        return self.key_prefix + self.session_id

    def add_message(self, message: BaseMessage):
        self.redis.lpush(self.key, message.json())

    async def aadd_message(self, message: BaseMessage):
        loop = get_event_loop()
        await loop.run_in_executor(None, self.add_message, message)

    def get_messages(self) -> list[BaseMessage]:
        return [BaseMessage.parse_raw(m) for m in self.redis.lrange(self.key, 0, -1)]

    def clear(self):
        self.redis.delete(self.key)
