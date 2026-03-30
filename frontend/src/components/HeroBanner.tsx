import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HeroBanner({ movie }: { movie: any }) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (movie) setTimeout(() => setLoaded(true), 100);
  }, [movie]);

  if (!movie) return (
    <div className="spinner-container">
      <div className="spinner" />
    </div>
  );

  return (
    <div className="hero">
      <img
        src={movie.backdrop_path || movie.poster_path}
        alt={movie.title}
        style={{ opacity: loaded ? 1 : 0 }}
      />
      <div className="hero-gradient-left" />
      <div className="hero-gradient-bottom" />
      <div className="hero-content">
        <div className="hero-badge">
          <span className="n">N</span>
          <span className="label">Series</span>
        </div>
        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-desc">{movie.overview}</p>
        <div className="hero-buttons">
          <button className="btn btn-white" onClick={() => navigate(`/movie/${movie.id}`)}>
            ▶ Play
          </button>
          <button className="btn btn-gray" onClick={() => navigate(`/movie/${movie.id}`)}>
            ℹ More Info
          </button>
        </div>
      </div>
    </div>
  );
}