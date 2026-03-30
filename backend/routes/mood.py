from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from recommender.tmdb import fetch_movies_by_mood, get_image_url, fetch_movie_trailer
import models

router = APIRouter(prefix="/mood", tags=["Mood"])

GENRE_MAP = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
}

def save_and_return(movies_data: list, db: Session):
    results = []
    for m in movies_data:
        existing = db.query(models.Movie).filter_by(tmdb_id=m["id"]).first()
        if not existing:
            genre_ids = m.get("genre_ids", [])
            genres = ",".join(str(g) for g in genre_ids) if genre_ids else ""
            movie = models.Movie(
                tmdb_id=m["id"], title=m.get("title", ""),
                overview=m.get("overview", ""),
                poster_path=get_image_url(m.get("poster_path")),
                backdrop_path=get_image_url(m.get("backdrop_path")),
                genres=genres, release_date=m.get("release_date", ""),
                vote_average=m.get("vote_average", 0),
                popularity=m.get("popularity", 0),
            )
            db.add(movie)
            db.commit()
            db.refresh(movie)
            existing = movie
        genre_parts = existing.genres.split(",") if existing.genres else []
        genre_names = []
        for p in genre_parts:
            p = p.strip()
            try:
                genre_names.append(GENRE_MAP.get(int(p), p))
            except ValueError:
                genre_names.append(p)
        results.append({
            "id": existing.id, "tmdb_id": existing.tmdb_id,
            "title": existing.title, "overview": existing.overview,
            "poster_path": existing.poster_path, "backdrop_path": existing.backdrop_path,
            "genres": genre_names, "release_date": existing.release_date,
            "vote_average": existing.vote_average, "popularity": existing.popularity,
        })
    return results

@router.get("/trailer/{movie_id}")
def get_trailer(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(models.Movie).filter_by(id=movie_id).first()
    if not movie:
        return {"trailer_key": None}
    trailer_key = fetch_movie_trailer(movie.tmdb_id)
    return {"trailer_key": trailer_key}

@router.get("/{mood}")
def get_mood_movies(mood: str, db: Session = Depends(get_db)):
    data = fetch_movies_by_mood(mood)
    return save_and_return(data, db)