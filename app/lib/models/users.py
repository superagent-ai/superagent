from pydantic import BaseModel

from app.lib.models.response import User


class UserOutput(BaseModel):
    success: bool
    data: User = None
