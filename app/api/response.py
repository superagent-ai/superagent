from typing import Generic, TypeVar

from pydantic import BaseModel

DataT = TypeVar('DataT')

class Response(BaseModel, Generic[DataT]):
    data: DataT
    success: bool

