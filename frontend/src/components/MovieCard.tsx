import { useNavigate } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  genres: string[];
  overview: string;
  release_date?: string;
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate();
  const year = movie.release_date?.split("-")[0] || "";
  const match = Math.round(movie.vote_average * 10);

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <img
        src={movie.poster_path || "https://via.placeholder.com/300x450/1a1a1a/666?text=No+Image"}
        alt={movie.title}
        loading="lazy"
      />
      <div className="card-info">
        <div>
          <button className="card-play-btn" onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.id}`); }}>▶</button>
          <button className="card-add-btn" onClick={(e) => e.stopPropagation()}>+</button>
        </div>
        <div className="card-title">{movie.title}</div>
        <div className="card-meta">
          <span className="card-match">{match}% Match</span>
          {year && <span className="card-year">{year}</span>}
          <span className="card-hd">HD</span>
        </div>
        <div className="card-genres">
          {movie.genres?.slice(0, 3).map((g) => (
            <span key={g} className="card-genre-dot">{g}</span>
          ))}
        </div>
      </div>
    </div>
  );
}