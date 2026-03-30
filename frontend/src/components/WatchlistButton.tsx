import { useState, useEffect } from "react";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";

interface Props {
  movieId: number;
  onToggle?: (inList: boolean) => void;
}

export default function WatchlistButton({ movieId, onToggle }: Props) {
  const [inList, setInList] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;
    api.get("/watchlist/ids").then((r: any) => {
      setInList(r.data.includes(movieId));
    }).catch(() => {});
  }, [movieId, token]);

  const toggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return alert("Please login first");
    setLoading(true);
    try {
      if (inList) {
        await api.delete(`/watchlist/remove/${movieId}`);
        setInList(false);
        onToggle?.(false);
      } else {
        await api.post("/watchlist/add", { movie_id: movieId });
        setInList(true);
        onToggle?.(true);
      }
    } catch (e) {}
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        width: "42px", height: "42px",
        borderRadius: "50%",
        border: `2px solid ${inList ? "#E50914" : "rgba(255,255,255,0.6)"}`,
        background: inList ? "rgba(229,9,20,0.2)" : "transparent",
        color: inList ? "#E50914" : "white",
        fontSize: "20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        transform: loading ? "scale(0.9)" : "scale(1)",
      }}
      title={inList ? "Remove from My List" : "Add to My List"}
    >
      {inList ? "✓" : "+"}
    </button>
  );
}