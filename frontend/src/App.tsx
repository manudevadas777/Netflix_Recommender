import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MovieDetail from "./pages/MovieDetail";
import Search from "./pages/Search";
import Watchlist from "./pages/Watchlist";
import Social from "./pages/Social";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* If logged in, skip landing and go straight to home */}
        <Route path="/" element={token ? <Navigate to="/home" /> : <Landing />} />
        <Route path="/login" element={token ? <Navigate to="/home" /> : <Login />} />

        {/* Protected routes */}
        <Route path="/home" element={token ? <Home /> : <Navigate to="/" />} />
        <Route path="/movie/:id" element={token ? <MovieDetail /> : <Navigate to="/" />} />
        <Route path="/search" element={token ? <Search /> : <Navigate to="/" />} />
        <Route path="/watchlist" element={token ? <Watchlist /> : <Navigate to="/" />} />
        <Route path="/social" element={token ? <Social /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}