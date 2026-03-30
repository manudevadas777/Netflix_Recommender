import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import MovieRow from "../components/MovieRow";
import Navbar from "../components/Navbar";
import WatchlistButton from "../components/WatchlistButton";
import TrailerModal from "../components/TrailerModal";
import { useAuthStore } from "../store/authStore";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [similar, setSimilar] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    api.get(`/movies/${id}`).then((r: any) => setMovie(r.data));
    api.get(`/recommendations/similar/${id}`).then((r: any) => setSimilar(r.data));
    if (token) {
      api.get("/users/me/ratings").then((r: any) => {
        const found = r.data.find((x: any) => x.movie_id === Number(id));
        if (found) setUserRating(found.rating);
      }).catch(() => {});
    }
  }, [id, token]);

  const handleRate = async (rating: number) => {
    if (!token) return alert("Please login to rate");
    await api.post("/users/rate", { movie_id: Number(id), rating });
    setUserRating(rating);
  };

  if (!movie) return (
    <div className="spinner-container"><div className="spinner" /></div>
  );

  return (
    <div className="detail-page">
      <Navbar />

      {/* Trailer Modal */}
      {showTrailer && (
        <TrailerModal
          movieId={movie.id}
          movieTitle={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}

      {/* Backdrop */}
      <div className="detail-backdrop">
        <img src={movie.backdrop_path || movie.poster_path} alt={movie.title} />
        <div className="detail-backdrop-gradient" />
      </div>

      {/* Content */}
      <div className="detail-content">
        <img className="detail-poster" src={movie.poster_path} alt={movie.title} />
        <div className="detail-info">
          <h1 className="detail-title">{movie.title}</h1>
          <div className="detail-meta">
            <span className="detail-rating">✓ {movie.vote_average?.toFixed(1)} Match</span>
            <span className="detail-year">{movie.release_date?.split("-")[0]}</span>
            <span style={{
              border: "1px solid rgba(255,255,255,0.4)",
              color: "rgba(255,255,255,0.7)",
              fontSize: "11px", padding: "2px 6px",
              borderRadius: "3px", fontWeight: 600,
            }}>HD</span>
          </div>
          <div className="detail-genres">
            {movie.genres?.map((g: string) => (
              <span key={g} className="detail-genre">{g}</span>
            ))}
          </div>
          <p className="detail-overview">{movie.overview}</p>

          {/* Star rating */}
          <div className="star-rating">
            <span className="star-label">Your Rating:</span>
            {[1,2,3,4,5].map((star) => (
              <span
                key={star}
                className={`star ${star <= userRating ? "active" : ""}`}
                onClick={() => handleRate(star)}
              >★</span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="detail-actions">
            <button className="btn btn-white" onClick={() => setShowTrailer(true)}>
              ▶ Watch Trailer
            </button>
            <WatchlistButton movieId={movie.id} />
            <button className="btn btn-gray">+ My List</button>
          </div>
        </div>
      </div>

      {/* Similar movies */}
      {(similar as any[]).length > 0 && (
        <MovieRow title="More Like This" movies={similar} />
      )}
    </div>
  );
}