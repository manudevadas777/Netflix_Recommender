from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from auth import get_current_user
import models

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])

def movie_to_dict(m: models.Movie):
    GENRE_MAP = {
        28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
        80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
        14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
        9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
        10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
    }
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

class WatchlistRequest(BaseModel):
    movie_id: int

@router.post("/add")
def add_to_watchlist(req: WatchlistRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    existing = db.query(models.Watchlist).filter_by(user_id=current_user.id, movie_id=req.movie_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already in watchlist")
    item = models.Watchlist(user_id=current_user.id, movie_id=req.movie_id)
    db.add(item)
    db.commit()
    return {"message": "Added to watchlist"}

@router.delete("/remove/{movie_id}")
def remove_from_watchlist(movie_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    item = db.query(models.Watchlist).filter_by(user_id=current_user.id, movie_id=movie_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not in watchlist")
    db.delete(item)
    db.commit()
    return {"message": "Removed from watchlist"}

@router.get("/")
def get_watchlist(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    items = db.query(models.Watchlist).filter_by(user_id=current_user.id).all()
    movies = [item.movie for item in items if item.movie]
    return [movie_to_dict(m) for m in movies]

@router.get("/ids")
def get_watchlist_ids(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    items = db.query(models.Watchlist).filter_by(user_id=current_user.id).all()
    return [item.movie_id for item in items]