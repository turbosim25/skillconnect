from pydantic import BaseModel
from typing import List, Optional

class UserProfile(BaseModel):
    email: str
    name: str
    tags: List[str]
    links: List[str]
    active: bool
