import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";

export default function Search() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const q = searchParams.get("q") || "";

  useEffect(() => {
    if (q) api.get(`/movies/search?q=${q}`).then((r: any) => setResults(r.data));
  }, [q]);

  return (
    <div className="search-page">
      <Navbar />
      <h2 className="search-title">Results for "{q}"</h2>
      <div className="search-grid">
        {(results as any[]).map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}