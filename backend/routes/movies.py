from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from recommender.tmdb import (
    fetch_popular_movies, fetch_trending_movies,
    fetch_movies_by_genre, search_movies, fetch_genres, get_image_url
)
import models

router = APIRouter(prefix="/movies", tags=["Movies"])

def save_movies_to_db(movies_data: list, db: Session):
    saved = []
    for m in movies_data:
        existing = db.query(models.Movie).filter_by(tmdb_id=m["id"]).first()
        if not existing:
            # genre_ids is a list of ints from TMDB, just convert to string
            genre_ids = m.get("genre_ids", [])
            if isinstance(genre_ids, list) and len(genre_ids) > 0 and isinstance(genre_ids[0], int):
                genres = ",".join(str(g) for g in genre_ids)
            else:
                # already full genre objects
                genres = ",".join([g.get("name", "") for g in m.get("genres", [])])

            movie = models.Movie(
                tmdb_id=m["id"],
                title=m.get("title", ""),
                overview=m.get("overview", ""),
                poster_path=get_image_url(m.get("poster_path")),
                backdrop_path=get_image_url(m.get("backdrop_path")),
                genres=genres,
                release_date=m.get("release_date", ""),
                vote_average=m.get("vote_average", 0),
                popularity=m.get("popularity", 0),
            )
            db.add(movie)
            saved.append(movie)
    db.commit()
    return saved

# Genre ID to name mapping from TMDB
GENRE_MAP = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
}

def movie_to_dict(m: models.Movie):
    # Convert genre IDs or names to list
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
        "id": m.id,
        "tmdb_id": m.tmdb_id,
        "title": m.title,
        "overview": m.overview,
        "poster_path": m.poster_path,
        "backdrop_path": m.backdrop_path,
        "genres": genres,
        "release_date": m.release_date,
        "vote_average": m.vote_average,
        "popularity": m.popularity,
    }

@router.get("/popular")
def popular_movies(page: int = 1, db: Session = Depends(get_db)):
    data = fetch_popular_movies(page)
    save_movies_to_db(data, db)
    movies = db.query(models.Movie).order_by(models.Movie.popularity.desc()).offset((page-1)*20).limit(20).all()
    return [movie_to_dict(m) for m in movies]

@router.get("/trending")
def trending_movies(db: Session = Depends(get_db)):
    data = fetch_trending_movies()
    save_movies_to_db(data, db)
    movies = db.query(models.Movie).order_by(models.Movie.popularity.desc()).limit(20).all()
    return [movie_to_dict(m) for m in movies]

@router.get("/search")
def search(q: str = Query(...), db: Session = Depends(get_db)):
    data = search_movies(q)
    save_movies_to_db(data, db)
    movies = db.query(models.Movie).filter(models.Movie.title.ilike(f"%{q}%")).limit(20).all()
    return [movie_to_dict(m) for m in movies]

@router.get("/genres")
def genres():
    return fetch_genres()

@router.get("/{movie_id}")
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    movie = db.query(models.Movie).filter_by(id=movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie_to_dict(movie)