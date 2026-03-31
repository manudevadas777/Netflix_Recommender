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
        background: "rgba(0,0,0,0.95)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.3s ease",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(900px, 95vw)",
          background: "#141414",
          borderRadius: "16px",
          overflow: "hidden",
          animation: "zoomIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.9), 0 0 60px rgba(229,9,20,0.1)",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "18px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(0,0,0,0.5)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              background: "#E50914",
              color: "white",
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "4px",
              letterSpacing: "1px",
            }}>TRAILER</span>
            <h3 style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.3px",
            }}>
              {movieTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              width: "34px", height: "34px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "16px",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = "rgba(229,9,20,0.3)";
              (e.target as HTMLButtonElement).style.borderColor = "#E50914";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
              (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >✕</button>
        </div>

        {/* Video container — 16:9 ratio trick */}
        <div style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          background: "#000",
        }}>
          {loading ? (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "16px",
            }}>
              <div className="spinner" />
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                Loading trailer...
              </p>
            </div>
          ) : trailerKey ? (
            <iframe
              style={{
                position: "absolute",
                top: 0, left: 0,
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
              }}
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
              title={movieTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "16px",
            }}>
              <span style={{ fontSize: "56px" }}>🎬</span>
              <p style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "15px", fontWeight: 500,
              }}>
                No trailer available for this movie
              </p>
              <button
                onClick={onClose}
                style={{
                  background: "#E50914", color: "white",
                  border: "none", borderRadius: "6px",
                  padding: "10px 24px", fontSize: "14px",
                  fontWeight: 600, cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 24px",
          background: "rgba(0,0,0,0.5)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
            Press ESC to close
          </p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
            Powered by YouTube
          </p>
        </div>
      </div>
    </div>
  );
}