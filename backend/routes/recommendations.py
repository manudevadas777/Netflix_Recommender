from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from recommender.engine import get_hybrid_recommendations, get_content_recommendations, get_popular_movies
import models

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

def movie_to_dict(m: models.Movie):
    return {
        "id": m.id, "tmdb_id": m.tmdb_id, "title": m.title,
        "overview": m.overview, "poster_path": m.poster_path,
        "backdrop_path": m.backdrop_path,
        "genres": m.genres.split(",") if m.genres else [],
        "release_date": m.release_date,
        "vote_average": m.vote_average, "popularity": m.popularity,
    }

@router.get("/for-you")
def for_you(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    movies = get_hybrid_recommendations(current_user.id, db)
    return [movie_to_dict(m) for m in movies]

@router.get("/similar/{movie_id}")
def similar(movie_id: int, db: Session = Depends(get_db)):
    movies = get_content_recommendations(movie_id, db)
    return [movie_to_dict(m) for m in movies]

@router.get("/popular")
def popular(db: Session = Depends(get_db)):
    movies = get_popular_movies(db)
    return [movie_to_dict(m) for m in movies]