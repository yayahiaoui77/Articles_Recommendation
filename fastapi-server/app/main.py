from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from model.apriori import recommend_tags
import pickle
from fastapi import APIRouter, Query



import logging

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
router = APIRouter()
#charger le dataset au démarrage de l'application df = None


df = pd.read_csv('data/prep_dataset.csv')

rules = pd.read_pickle("rules.pkl")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


logging.basicConfig(level=logging.DEBUG)





@app.post("/users/")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        # Convertir la liste des préférences en chaîne de caractères séparée par des virgules
        preferred_topics_str = ",".join(user.preferred_topics)  # Convertir la liste en chaîne

        # Créer un nouvel utilisateur avec la chaîne de sujets
        new_user = models.User(name=user.name, preferred_topics=preferred_topics_str)
        
        # Ajouter l'utilisateur à la base de données
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Retourner l'ID et les sujets convertis en liste
        return {"id": new_user.id, "name": new_user.name, "preferred_topics": user.preferred_topics}
    
    except Exception as e:
        error_message = f"An error occurred: {str(e)}"
        logging.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)



@app.post("/recommendations/")
async def get_recommendations(request: schemas.RecommendationRequest):
    # Extract the topics from the request
    topics = request.preferred_topics
    
    # Assuming recommend_tags is a function that takes in topics and returns recommendations
    recommendations =   recommend_tags(topics, rules)# Process the list of topics
  
    return {"recommended_articles": recommendations}

@app.get("/articles/preferred_topics", response_model=List[schemas.Article])
async def get_articles(preferred_topics: List[str] = Query(...)):
    """
    Retourne une liste d'articles filtrés par les topics préférés.
    :param preferred_topics: Liste des topics (tags) fournis par l'utilisateur.
    :return: Liste des articles contenant au moins un des topics recommandés.
    """
    # Assurez-vous que les topics sont normalisés (par exemple, en minuscules)
    normalized_topics = [topic.strip().lower() for topic in preferred_topics]
    
    filtered_articles = []

    for _, row in df.iterrows():
        # Vérifiez si la colonne 'tags' contient des données valides
        if pd.isna(row['tags']):
            continue  # Ignorez les articles sans tags

        # Splittez les tags et normalisez-les
        article_tags = [tag.strip().lower() for tag in row['tags'].split(",")]

        # Vérifiez si un des topics recommandés est présent dans les tags
        if any(topic in article_tags for topic in normalized_topics):
            filtered_articles.append({
                "author": row["authors"],
                "title": row["title"],
                "content": row["text"],
                "tags": article_tags
            })

    return filtered_articles


@app.get("/articles/recommended", response_model=List[schemas.Article])
async def get_recommended_articles(user_id: int):
    # Assuming you have some logic to fetch recommendations based on user_id
    # In this example, we will just return a subset of the articles
    recommended_articles = []
    
    # For now, let's assume all articles are recommended (replace with actual recommendation logic)
    for _, row in df.iterrows():
        article = {
            "author": row["authors"],
            "title": row["title"],
            "content": row["text"],
            "tags": row["tags"].split(",")  # Assuming tags are a comma-separated string
        }
        recommended_articles.append(article)

    return recommended_articles


@app.get("/users/", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = crud.get_users(db)
    return users



@app.get("/users/{user_id}/articles", response_model=list[schemas.ArticleResponse])
def read_user_articles(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    articles = crud.get_articles_by_topics(db, user.preferred_topics)
    return articles



# Get a user's preferred topics
@app.get("/users/{user_id}/preferred_topics", response_model=schemas.PreferredTopicsResponse)
def get_preferred_topics(user_id: int, db: Session = Depends(get_db)):
    preferred_topics = crud.get_preferred_topics(db, user_id)
    if preferred_topics is None:
        raise HTTPException(status_code=404, detail="User not found")
    return schemas.PreferredTopicsResponse(preferred_topics=preferred_topics)