from sqlalchemy.orm import Session
from . import models, schemas

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, preferred_topics=user.preferred_topics)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()



def get_preferred_topics(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        return user.preferred_topics.split(",")  # Split the comma-separated string into a list of topics
    return None


def get_users(db: Session):
    return db.query(models.User).all()   



def get_articles_by_topics(db: Session, topics: str):
    topic_list = topics.split(",")
    return db.query(models.Article).filter(models.Article.topic.in_(topic_list)).all()
