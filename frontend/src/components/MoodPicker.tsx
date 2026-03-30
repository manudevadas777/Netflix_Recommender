import { useState } from "react";
import api from "../lib/api";
import MovieRow from "./MovieRow";

const MOODS = [
  { key: "happy",     emoji: "😂", label: "Comedy",    color: "#f5c518" },
  { key: "thrilling", emoji: "😱", label: "Thriller",  color: "#E50914" },
  { key: "emotional", emoji: "😢", label: "Drama",     color: "#54b9c5" },
  { key: "scifi",     emoji: "🚀", label: "Sci-Fi",    color: "#7c4dff" },
  { key: "romantic",  emoji: "❤️", label: "Romance",   color: "#ff4081" },
  { key: "action",    emoji: "💥", label: "Action",    color: "#ff6d00" },
];

export default function MoodPicker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickMood = async (mood: string) => {
    setSelectedMood(mood);
    setLoading(true);
    try {
      const res: any = await api.get(`/mood/${mood}`);
      setMovies(res.data);
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div style={{ marginBottom: "48px" }}>
      {/* Title */}
      <h2 style={{
        fontSize: "20px", fontWeight: 700,
        padding: "0 60px", marginBottom: "20px",
        color: "white", letterSpacing: "-0.3px",
      }}>
        🎭 What's your mood tonight?
      </h2>

      {/* Mood buttons */}
      <div style={{
        display: "flex", gap: "12px",
        padding: "0 60px", flexWrap: "wrap",
        marginBottom: "24px",
      }}>
        {MOODS.map((mood) => (
          <button
            key={mood.key}
            onClick={() => pickMood(mood.key)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 20px",
              borderRadius: "50px",
              border: `2px solid ${selectedMood === mood.key ? mood.color : "rgba(255,255,255,0.15)"}`,
              background: selectedMood === mood.key
                ? `${mood.color}22`
                : "rgba(255,255,255,0.05)",
              color: selectedMood === mood.key ? mood.color : "rgba(255,255,255,0.8)",
              cursor: "pointer", fontSize: "14px", fontWeight: 600,
              transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              transform: selectedMood === mood.key ? "scale(1.08)" : "scale(1)",
              boxShadow: selectedMood === mood.key
                ? `0 4px 20px ${mood.color}44`
                : "none",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <span style={{ fontSize: "18px" }}>{mood.emoji}</span>
            {mood.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <div className="spinner" />
        </div>
      )}

      {!loading && movies.length > 0 && (
        <MovieRow
          title={`${MOODS.find(m => m.key === selectedMood)?.emoji} ${MOODS.find(m => m.key === selectedMood)?.label} picks for you`}
          movies={movies}
        />
      )}
    </div>
  );
}