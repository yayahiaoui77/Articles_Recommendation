from pydantic import BaseModel
from typing import List

class User(BaseModel):
    preferred_topics: List[str]  # Garde-le sous forme de liste




class UserBase(BaseModel):
    name: str
    preferred_topics: str  # Comma-separated topics


# Schéma de création d'un utilisateur
class UserCreate(BaseModel):
    name: str
    preferred_topics: List[str]  # Garde-le sous forme de liste

    class Config:
        orm_mode = True


class UserResponse(BaseModel):
    id: int
    name: str
    preferred_topics: List[str]

    class Config:
        orm_mode = True


class RecommendationRequest(BaseModel):
    preferred_topics: List[str]  # This will match the key from frontend (preferred_topics)
    
    class Config:
        orm_mode = True

class Article(BaseModel):
    author: str
    title: str
    content: str
    tags: List[str]




class ArticleBase(BaseModel):
    author:str
    title: str
    topic: str
    url: str


class ArticleResponse(ArticleBase):
    id: int

    class Config:
        orm_mode = True


class PreferredTopicsResponse(BaseModel):
    preferred_topics: List[str]

    class Config:
        orm_mode = True
