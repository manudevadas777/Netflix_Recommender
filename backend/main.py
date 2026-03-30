from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routes import movies, users, recommendations
from routes import watchlist, social, mood

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Netflix Recommender API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movies.router)
app.include_router(users.router)
app.include_router(recommendations.router)
app.include_router(watchlist.router)
app.include_router(social.router)
app.include_router(mood.router)

@app.get("/")
def root():
    return {"message": "Netflix Recommender API is running"}