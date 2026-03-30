import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?q=${search}`);
      setSearch(""); setShowSearch(false);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : "top"}`}>
      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        <span className="navbar-logo" onClick={() => navigate("/")}>NETFIX</span>
        <div className="navbar-links">
          <span className="navbar-link" onClick={() => navigate("/")}>Home</span>
          <span className="navbar-link" onClick={() => navigate("/watchlist")}>My List</span>
          <span className="navbar-link" onClick={() => navigate("/social")}>Friends</span>
          <span className="navbar-link">Movies</span>
        </div>
      </div>
      <div className="navbar-right">
        {showSearch ? (
          <div className="search-box">
            <span>🔍</span>
            <input
              autoFocus value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Titles, people, genres"
            />
            <span style={{ cursor: "pointer", color: "rgba(255,255,255,0.5)" }} onClick={() => setShowSearch(false)}>✕</span>
          </div>
        ) : (
          <span style={{ cursor: "pointer", fontSize: "18px" }} onClick={() => setShowSearch(true)}>🔍</span>
        )}
        <span style={{ fontSize: "18px", cursor: "pointer" }}>🔔</span>
        {username ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="avatar" onClick={() => navigate("/watchlist")}>
              {username[0].toUpperCase()}
            </div>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>{username}</span>
            <button className="btn btn-outline" onClick={logout}>Sign Out</button>
          </div>
        ) : (
          <button className="btn btn-red" onClick={() => navigate("/login")}>Sign In</button>
        )}
      </div>
    </nav>
  );
}