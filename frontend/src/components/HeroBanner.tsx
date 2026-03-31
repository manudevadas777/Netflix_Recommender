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
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Loading...</p>
    </div>
  );

  const year = movie.release_date?.split("-")[0] || "";
  const match = Math.round(movie.vote_average * 10);

  return (
    <div className="hero">
      <img
        src={movie.backdrop_path || movie.poster_path}
        alt={movie.title}
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 1.2s ease" }}
      />
      <div className="hero-gradient-left" />
      <div className="hero-gradient-bottom" />

      <div className="hero-content">
        {/* Badge */}
        <div className="hero-badge">
          <span className="n">N</span>
          <span className="label">Series</span>
        </div>

        {/* Title */}
        <h1 className="hero-title">{movie.title}</h1>

        {/* Meta */}
        <div className="hero-meta">
          <span className="hero-meta-item" style={{ color: "#46d369", fontWeight: 700 }}>
            {match}% Match
          </span>
          <span className="hero-meta-dot" />
          {year && <span className="hero-meta-item">{year}</span>}
          <span className="hero-meta-dot" />
          <span className="hero-meta-item" style={{
            border: "1px solid rgba(255,255,255,0.4)",
            padding: "1px 6px", borderRadius: "3px",
            fontSize: "11px", fontWeight: 700,
          }}>HD</span>
          {movie.genres?.slice(0, 2).map((g: string) => (
            <span key={g} className="hero-meta-item">
              <span className="hero-meta-dot" style={{ marginRight: 0 }} />
              {g}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="hero-desc">{movie.overview}</p>

        {/* Buttons */}
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