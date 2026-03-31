import { useEffect, useState } from "react";
import api from "../lib/api";
import HeroBanner from "../components/HeroBanner";
import MovieRow from "../components/MovieRow";
import Navbar from "../components/Navbar";
import MoodPicker from "../components/MoodPicker";
import { useAuthStore } from "../store/authStore";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [forYou, setForYou] = useState([]);
  const [action, setAction] = useState([]);
  const [comedy, setComedy] = useState([]);
  const { token } = useAuthStore();

  useEffect(() => {
    api.get("/movies/trending")
      .then((r: any) => setTrending(r.data))
      .catch(() => {});

    api.get("/recommendations/top-rated")
      .then((r: any) => setTopRated(r.data))
      .catch(() => {});

    api.get("/movies/by-genre?genre_id=28")
      .then((r: any) => setAction(r.data))
      .catch(() => {});

    api.get("/movies/by-genre?genre_id=35")
      .then((r: any) => setComedy(r.data))
      .catch(() => {});

    if (token) {
      api.get("/recommendations/for-you")
        .then((r: any) => setForYou(r.data))
        .catch(() => {});
    }
  }, [token]);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <Navbar />
      <HeroBanner movie={(trending as any[])[0]} />
      <div style={{ position: "relative", marginTop: "-80px", paddingBottom: "80px" }}>
        {(forYou as any[]).length > 0 && (
          <MovieRow
            title="✨ Recommended For You"
            movies={forYou}
            badge="recommended"
          />
        )}
        <MoodPicker />
        <MovieRow
          title="🔥 Trending This Week"
          movies={trending}
          badge="trending"
          ranked={true}
        />
        {(topRated as any[]).length > 0 && (
          <MovieRow
            title="⭐ Top Rated"
            movies={topRated}
            badge="top-rated"
          />
        )}
        {(action as any[]).length > 0 && (
          <MovieRow
            title="💥 Action & Adventure"
            movies={action}
          />
        )}
        {(comedy as any[]).length > 0 && (
          <MovieRow
            title="😂 Comedy"
            movies={comedy}
          />
        )}
      </div>
    </div>
  );
}
