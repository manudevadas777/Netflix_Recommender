from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from auth import get_current_user
import models

router = APIRouter(prefix="/social", tags=["Social"])

class FriendRequest(BaseModel):
    username: str

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

@router.post("/friend/add")
def add_friend(req: FriendRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    friend = db.query(models.User).filter_by(username=req.username).first()
    if not friend:
        raise HTTPException(status_code=404, detail="User not found")
    if friend.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot add yourself")
    existing = db.query(models.Friendship).filter_by(user_id=current_user.id, friend_id=friend.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already friends or request pending")
    friendship = models.Friendship(user_id=current_user.id, friend_id=friend.id, status="accepted")
    db.add(friendship)
    reverse = models.Friendship(user_id=friend.id, friend_id=current_user.id, status="accepted")
    db.add(reverse)
    db.commit()
    return {"message": f"Now friends with {req.username}"}

@router.get("/friends")
def get_friends(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    friendships = db.query(models.Friendship).filter_by(user_id=current_user.id, status="accepted").all()
    friends = []
    for f in friendships:
        friend_user = db.query(models.User).filter_by(id=f.friend_id).first()
        if friend_user:
            recent_ratings = db.query(models.Rating).filter_by(user_id=friend_user.id).order_by(models.Rating.created_at.desc()).limit(3).all()
            recent_movies = []
            for r in recent_ratings:
                movie = db.query(models.Movie).filter_by(id=r.movie_id).first()
                if movie:
                    recent_movies.append({"title": movie.title, "rating": r.rating, "poster": movie.poster_path})
            friends.append({
                "id": friend_user.id,
                "username": friend_user.username,
                "recent_activity": recent_movies
            })
    return friends

@router.get("/activity")
def get_friend_activity(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    friendships = db.query(models.Friendship).filter_by(user_id=current_user.id, status="accepted").all()
    friend_ids = [f.friend_id for f in friendships]
    activity = []
    for fid in friend_ids:
        friend_user = db.query(models.User).filter_by(id=fid).first()
        ratings = db.query(models.Rating).filter_by(user_id=fid).order_by(models.Rating.created_at.desc()).limit(5).all()
        for r in ratings:
            movie = db.query(models.Movie).filter_by(id=r.movie_id).first()
            if movie:
                activity.append({
                    "username": friend_user.username,
                    "movie_id": movie.id,
                    "movie_title": movie.title,
                    "poster": movie.poster_path,
                    "rating": r.rating,
                    "watched_at": r.created_at.isoformat()
                })
    activity.sort(key=lambda x: x["watched_at"], reverse=True)
    return activity[:20]