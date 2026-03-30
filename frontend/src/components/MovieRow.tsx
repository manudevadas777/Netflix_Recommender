import { useRef, useState } from "react";
import MovieCard from "./MovieCard";

interface Props {
  title: string;
  movies: any[];
}

export default function MovieRow({ title, movies }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);

  const scroll = (dir: "left" | "right") => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir === "right" ? 500 : -500, behavior: "smooth" });
      setTimeout(() => {
        if (rowRef.current) setShowLeft(rowRef.current.scrollLeft > 0);
      }, 300);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-section">
      <h2 className="row-title">
        {title} <span className="explore">Explore All ›</span>
      </h2>
      <div className="row-wrapper">
        {showLeft && (
          <button className="scroll-btn left" onClick={() => scroll("left")}>‹</button>
        )}
        <div className="movies-row" ref={rowRef}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <button className="scroll-btn right" onClick={() => scroll("right")}>›</button>
      </div>
    </div>
  );
}