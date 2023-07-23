from pydantic import BaseModel

from prisma.models import User


class SignIn(BaseModel):
    email: str
    password: str


class SignUp(BaseModel):
    email: str
    password: str
    name: str = None
    metadata: dict = None


class SignInOut(BaseModel):
    token: str
    user: User


class OAuth(BaseModel):
    email: str
    name: str
    access_token: str = None
    provider: str = None
