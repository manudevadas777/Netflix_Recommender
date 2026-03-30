import { useEffect, useState } from "react";
import api from "../lib/api";

interface Props {
  movieId: number;
  movieTitle: string;
  onClose: () => void;
}

export default function TrailerModal({ movieId, movieTitle, onClose }: Props) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/mood/trailer/${movieId}`).then((r: any) => {
      setTrailerKey(r.data.trailer_key);
      setLoading(false);
    }).catch(() => setLoading(false));

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [movieId]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.3s ease",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(900px, 95vw)",
          background: "#1a1a1a",
          borderRadius: "12px",
          overflow: "hidden",
          animation: "zoomIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.9)",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>
            🎬 {movieTitle}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none", color: "white",
              width: "32px", height: "32px",
              borderRadius: "50%", cursor: "pointer",
              fontSize: "16px", transition: "background 0.2s",
            }}
          >✕</button>
        </div>

        {/* Video */}
        <div style={{ aspectRatio: "16/9", background: "#000" }}>
          {loading ? (
            <div style={{
              height: "100%", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <div className="spinner" />
            </div>
          ) : trailerKey ? (
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title={movieTitle}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ display: "block" }}
            />
          ) : (
            <div style={{
              height: "100%", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "12px",
            }}>
              <span style={{ fontSize: "48px" }}>🎬</span>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
                No trailer available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}