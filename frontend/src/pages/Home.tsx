import { useEffect, useState } from "react";
import api from "../lib/api";
import HeroBanner from "../components/HeroBanner";
import MovieRow from "../components/MovieRow";
import Navbar from "../components/Navbar";
import MoodPicker from "../components/MoodPicker";
import { useAuthStore } from "../store/authStore";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [forYou, setForYou] = useState([]);
  const { token } = useAuthStore();

  useEffect(() => {
    api.get("/movies/trending").then((r: any) => setTrending(r.data));
    api.get("/movies/popular").then((r: any) => setPopular(r.data));
    if (token) {
      api.get("/recommendations/for-you").then((r: any) => setForYou(r.data)).catch(() => {});
    }
  }, [token]);

  return (
    <div style={{ minHeight: "100vh", background: "#141414" }}>
      <Navbar />
      <HeroBanner movie={(trending as any[])[0]} />
      <div style={{ position: "relative", marginTop: "-60px", paddingBottom: "60px" }}>
        {(forYou as any[]).length > 0 && (
          <MovieRow title="🎯 Recommended For You" movies={forYou} />
        )}
        <MoodPicker />
        <MovieRow title="🔥 Trending Now" movies={trending} />
        <MovieRow title="⭐ Popular Movies" movies={popular} />
      </div>
    </div>
  );
}