import { useState } from "react";
import api from "../lib/api";
import MovieRow from "./MovieRow";

const MOODS = [
  { key: "happy",     emoji: "😂", label: "Feel Good",  color: "#f5c518" },
  { key: "thrilling", emoji: "😱", label: "Thriller",   color: "#E50914" },
  { key: "emotional", emoji: "😢", label: "Drama",      color: "#54b9c5" },
  { key: "scifi",     emoji: "🚀", label: "Sci-Fi",     color: "#7c4dff" },
  { key: "romantic",  emoji: "❤️", label: "Romance",    color: "#ff4081" },
  { key: "action",    emoji: "💥", label: "Action",     color: "#ff6d00" },
];

export default function MoodPicker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickMood = async (mood: string) => {
    if (selectedMood === mood) {
      setSelectedMood(null);
      setMovies([]);
      return;
    }
    setSelectedMood(mood);
    setLoading(true);
    try {
      const res: any = await api.get(`/mood/${mood}`);
      setMovies(res.data);
    } catch (e) {}
    setLoading(false);
  };

  const selected = MOODS.find(m => m.key === selectedMood);

  return (
    <div className="mood-section">
      <h2 className="mood-title">🎭 What's your mood tonight?</h2>
      <div className="mood-buttons">
        {MOODS.map((mood) => (
          <button
            key={mood.key}
            onClick={() => pickMood(mood.key)}
            className="mood-btn"
            style={{
              borderColor: selectedMood === mood.key ? mood.color : "rgba(255,255,255,0.1)",
              background: selectedMood === mood.key ? `${mood.color}18` : "rgba(255,255,255,0.04)",
              color: selectedMood === mood.key ? mood.color : "rgba(255,255,255,0.75)",
              transform: selectedMood === mood.key ? "translateY(-4px) scale(1.06)" : "scale(1)",
              boxShadow: selectedMood === mood.key ? `0 8px 25px ${mood.color}33` : "none",
            }}
          >
            <span style={{ fontSize: "20px" }}>{mood.emoji}</span>
            {mood.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <div className="spinner" />
        </div>
      )}

      {!loading && movies.length > 0 && selected && (
        <MovieRow
          title={`${selected.emoji} ${selected.label} Picks`}
          movies={movies}
          badge="none"
        />
      )}
    </div>
  );
}