import requests
import os
from dotenv import load_dotenv

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

def fetch_popular_movies(page=1):
    url = f"{BASE_URL}/movie/popular"
    params = {"api_key": TMDB_API_KEY, "page": page}
    res = requests.get(url, params=params)
    return res.json().get("results", [])

def fetch_trending_movies():
    url = f"{BASE_URL}/trending/movie/week"
    params = {"api_key": TMDB_API_KEY}
    res = requests.get(url, params=params)
    return res.json().get("results", [])

def fetch_movies_by_genre(genre_id: int, page=1):
    url = f"{BASE_URL}/discover/movie"
    params = {"api_key": TMDB_API_KEY, "with_genres": genre_id, "page": page}
    res = requests.get(url, params=params)
    return res.json().get("results", [])

def fetch_movie_details(tmdb_id: int):
    url = f"{BASE_URL}/movie/{tmdb_id}"
    params = {"api_key": TMDB_API_KEY}
    res = requests.get(url, params=params)
    return res.json()

def fetch_movie_trailer(tmdb_id: int):
    url = f"{BASE_URL}/movie/{tmdb_id}/videos"
    params = {"api_key": TMDB_API_KEY}
    res = requests.get(url, params=params)
    videos = res.json().get("results", [])
    for v in videos:
        if v.get("type") == "Trailer" and v.get("site") == "YouTube":
            return v.get("key")
    return None

def search_movies(query: str):
    url = f"{BASE_URL}/search/movie"
    params = {"api_key": TMDB_API_KEY, "query": query}
    res = requests.get(url, params=params)
    return res.json().get("results", [])

def fetch_genres():
    url = f"{BASE_URL}/genre/movie/list"
    params = {"api_key": TMDB_API_KEY}
    res = requests.get(url, params=params)
    return res.json().get("genres", [])

def get_image_url(path: str):
    if not path:
        return None
    return f"{IMAGE_BASE}{path}"

def fetch_movies_by_mood(mood: str, page=1):
    mood_genres = {
        "happy":     [35, 10751, 16],
        "thrilling": [28, 53, 27],
        "emotional": [18, 10749],
        "scifi":     [878, 14, 12],
        "romantic":  [10749, 35],
        "action":    [28, 12, 80],
    }
    genre_ids = mood_genres.get(mood, [28])
    genre_str = ",".join(str(g) for g in genre_ids)
    url = f"{BASE_URL}/discover/movie"
    params = {
        "api_key": TMDB_API_KEY,
        "with_genres": genre_str,
        "sort_by": "popularity.desc",
        "page": page
    }
    res = requests.get(url, params=params)
    return res.json().get("results", [])