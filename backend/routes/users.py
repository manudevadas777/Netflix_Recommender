from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from database import get_db
import models
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class RatingRequest(BaseModel):
    movie_id: int
    rating: float

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(models.User).filter_by(username=req.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    user = models.User(
        username=req.username,
        email=req.email,
        hashed_password=hash_password(req.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer", "username": user.username}

@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(username=form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer", "username": user.username}

@router.post("/rate")
def rate_movie(req: RatingRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not (1.0 <= req.rating <= 5.0):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    existing = db.query(models.Rating).filter_by(user_id=current_user.id, movie_id=req.movie_id).first()
    if existing:
        existing.rating = req.rating
    else:
        db.add(models.Rating(user_id=current_user.id, movie_id=req.movie_id, rating=req.rating))
    db.commit()
    return {"message": "Rating saved"}

@router.get("/me/ratings")
def my_ratings(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    ratings = db.query(models.Rating).filter_by(user_id=current_user.id).all()
    return [{"movie_id": r.movie_id, "rating": r.rating} for r in ratings]