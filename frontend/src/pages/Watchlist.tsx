import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { useAuthStore } from "../store/authStore";

export default function Watchlist() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    api.get("/watchlist/").then((r: any) => {
      setMovies(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  const removeMovie = async (movieId: number) => {
    await api.delete(`/watchlist/remove/${movieId}`);
    setMovies(movies.filter((m) => m.id !== movieId));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#141414" }}>
      <Navbar />
      <div style={{ padding: "100px 60px 60px" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{
            fontSize: "42px", fontWeight: 900,
            letterSpacing: "-1px", marginBottom: "8px",
            background: "linear-gradient(135deg, #fff 60%, rgba(255,255,255,0.6))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            My List
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
            {movies.length} {movies.length === 1 ? "title" : "titles"} saved
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
            <div className="spinner" />
          </div>
        )}

        {/* Empty state */}
        {!loading && movies.length === 0 && (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            paddingTop: "100px", gap: "16px",
            animation: "fadeInUp 0.6s ease",
          }}>
            <span style={{ fontSize: "64px" }}>📋</span>
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "white" }}>
              Your list is empty
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
              Add movies by clicking the + button on any movie card
            </p>
            <button
              className="btn btn-red"
              onClick={() => navigate("/")}
              style={{ marginTop: "8px" }}
            >
              Browse Movies
            </button>
          </div>
        )}

        {/* Movies grid */}
        {!loading && movies.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
            gap: "16px",
            animation: "fadeInUp 0.6s ease",
          }}>
            {movies.map((movie) => (
              <div key={movie.id} style={{ position: "relative" }}>
                <MovieCard movie={movie} />
                <button
                  onClick={() => removeMovie(movie.id)}
                  style={{
                    position: "absolute", top: "8px", right: "8px",
                    width: "28px", height: "28px",
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white", fontSize: "14px",
                    cursor: "pointer", zIndex: 10,
                    display: "flex", alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                  title="Remove from list"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}