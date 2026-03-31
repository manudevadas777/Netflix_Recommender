from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from recommender.engine import get_hybrid_recommendations, get_content_recommendations, get_popular_movies
import models
from recommender.tmdb import fetch_trending_movies, fetch_popular_movies as fetch_pop, get_image_url

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

GENRE_MAP = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
}

def movie_to_dict(m: models.Movie):
    if m.genres:
        parts = m.genres.split(",")
        genres = []
        for p in parts:
            p = p.strip()
            try:
                genres.append(GENRE_MAP.get(int(p), p))
            except ValueError:
                genres.append(p)
    else:
        genres = []
    return {
        "id": m.id, "tmdb_id": m.tmdb_id, "title": m.title,
        "overview": m.overview, "poster_path": m.poster_path,
        "backdrop_path": m.backdrop_path, "genres": genres,
        "release_date": m.release_date, "vote_average": m.vote_average,
        "popularity": m.popularity,
    }

@router.get("/for-you")
def for_you(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Get hybrid recommendations
    movies = get_hybrid_recommendations(current_user.id, db, top_n=20)
    result = [movie_to_dict(m) for m in movies]

    # If less than 10 results, fill with high rated movies
    if len(result) < 10:
        rated_ids = {r.movie_id for r in db.query(models.Rating).filter_by(user_id=current_user.id).all()}
        extra = db.query(models.Movie).filter(
            models.Movie.vote_average >= 7.0,
            ~models.Movie.id.in_(rated_ids)
        ).order_by(models.Movie.vote_average.desc()).limit(20).all()
        seen_ids = {m["id"] for m in result}
        for m in extra:
            if m.id not in seen_ids:
                result.append(movie_to_dict(m))
    return result[:20]

@router.get("/similar/{movie_id}")
def similar(movie_id: int, db: Session = Depends(get_db)):
    movies = get_content_recommendations(movie_id, db)
    return [movie_to_dict(m) for m in movies]

@router.get("/popular")
def popular(db: Session = Depends(get_db)):
    movies = get_popular_movies(db)
    return [movie_to_dict(m) for m in movies]

@router.get("/top-rated")
def top_rated(db: Session = Depends(get_db)):
    movies = db.query(models.Movie).filter(
        models.Movie.vote_average >= 7.5
    ).order_by(models.Movie.vote_average.desc()).limit(20).all()
    return [movie_to_dict(m) for m in movies]
@router.get("/top-rated")
def top_rated(db: Session = Depends(get_db)):
    movies = db.query(models.Movie).filter(
        models.Movie.vote_average >= 7.5,
        models.Movie.popularity < 500  # exclude mega-popular ones already in trending
    ).order_by(models.Movie.vote_average.desc()).limit(20).all()
    return [movie_to_dict(m) for m in movies]