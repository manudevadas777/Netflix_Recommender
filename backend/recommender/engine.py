import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
from sqlalchemy.orm import Session
import models

# ─── Content-Based Filtering ─────────────────────────────────────────────────

def build_content_features(movies: list) -> pd.DataFrame:
    data = []
    for m in movies:
        genres = m.genres or ""
        overview = m.overview or ""
        combined = f"{genres} {overview}"
        data.append({"id": m.id, "tmdb_id": m.tmdb_id, "title": m.title, "features": combined})
    return pd.DataFrame(data)

def get_content_recommendations(movie_id: int, db: Session, top_n=10):
    movies = db.query(models.Movie).all()
    if len(movies) < 2:
        return []
    df = build_content_features(movies)
    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(df["features"])
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    idx_list = df.index[df["id"] == movie_id].tolist()
    if not idx_list:
        return []
    idx = idx_list[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = [s for s in sim_scores if s[0] != idx][:top_n]
    movie_indices = [s[0] for s in sim_scores]
    recommended_ids = df.iloc[movie_indices]["id"].tolist()
    return db.query(models.Movie).filter(models.Movie.id.in_(recommended_ids)).all()

# ─── Collaborative Filtering using sklearn SVD ───────────────────────────────

def get_collaborative_recommendations(user_id: int, db: Session, top_n=10):
    ratings = db.query(models.Rating).all()
    if len(ratings) < 10:
        return get_popular_movies(db, top_n)

    # Build user-movie matrix
    data_list = [{"user_id": r.user_id, "movie_id": r.movie_id, "rating": r.rating} for r in ratings]
    df = pd.DataFrame(data_list)

    user_movie_matrix = df.pivot_table(index="user_id", columns="movie_id", values="rating", fill_value=0)

    # Apply SVD
    n_components = min(10, min(user_movie_matrix.shape) - 1)
    svd = TruncatedSVD(n_components=n_components)
    matrix_reduced = svd.fit_transform(user_movie_matrix)
    matrix_reconstructed = np.dot(matrix_reduced, svd.components_)
    predicted_df = pd.DataFrame(matrix_reconstructed, index=user_movie_matrix.index, columns=user_movie_matrix.columns)

    if user_id not in predicted_df.index:
        return get_popular_movies(db, top_n)

    user_predictions = predicted_df.loc[user_id]
    rated_movie_ids = set(df[df["user_id"] == user_id]["movie_id"].tolist())
    unrated = user_predictions.drop(index=[m for m in rated_movie_ids if m in user_predictions.index], errors="ignore")
    top_movie_ids = unrated.nlargest(top_n).index.tolist()

    movies = db.query(models.Movie).filter(models.Movie.id.in_(top_movie_ids)).all()
    return movies if movies else get_popular_movies(db, top_n)

# ─── Hybrid ──────────────────────────────────────────────────────────────────

def get_hybrid_recommendations(user_id: int, db: Session, top_n=10):
    collab = get_collaborative_recommendations(user_id, db, top_n)
    if not collab:
        return get_popular_movies(db, top_n)
    seed_movie = collab[0]
    content = get_content_recommendations(seed_movie.id, db, top_n)
    seen = set()
    merged = []
    for m in collab + content:
        if m.id not in seen:
            seen.add(m.id)
            merged.append(m)
    return merged[:top_n]

# ─── Fallback ────────────────────────────────────────────────────────────────

def get_popular_movies(db: Session, top_n=10):
    return db.query(models.Movie).order_by(models.Movie.popularity.desc()).limit(top_n).all()