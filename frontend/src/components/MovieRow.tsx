import { useRef, useState } from "react";
import MovieCard from "./MovieCard";

interface Props {
  title: string;
  movies: any[];
  badge?: "trending" | "recommended" | "popular" | "top-rated" | "none";
  ranked?: boolean;
}

export default function MovieRow({ title, movies, badge = "none", ranked = false }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);

  const scroll = (dir: "left" | "right") => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir === "right" ? 520 : -520, behavior: "smooth" });
      setTimeout(() => {
        if (rowRef.current) setShowLeft(rowRef.current.scrollLeft > 0);
      }, 300);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-section">
      <div className="section-header">
        <div className="section-title">
          {title}
          {badge !== "none" && (
            <span className={`section-badge badge-${badge}`}>
              {badge === "trending"
                ? "🔥 Hot"
                : badge === "recommended"
                ? "✨ For You"
                : badge === "top-rated"
                ? "⭐ Top Rated"
                : "⭐ Top"}
            </span>
          )}
        </div>
        <span className="section-explore">View All →</span>
      </div>

      <div className="row-wrapper">
        {showLeft && (
          <button className="scroll-btn left" onClick={() => scroll("left")}>‹</button>
        )}
        <div className="movies-row" ref={rowRef}>
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className={ranked ? "movie-card-ranked" : ""}
              style={{ flexShrink: 0, animationDelay: `${index * 40}ms` }}
            >
              {ranked && (
                <span className="rank-number">{index + 1}</span>
              )}
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
        <button className="scroll-btn right" onClick={() => scroll("right")}>›</button>
      </div>
    </div>
  );
}