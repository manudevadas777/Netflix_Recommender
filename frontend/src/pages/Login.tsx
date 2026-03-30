import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      let res: any;
      if (isRegister) {
        res = await api.post("/users/register", form);
      } else {
        const params = new URLSearchParams({ username: form.username, password: form.password });
        res = await api.post("/users/login", params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
      }
      login(res.data.access_token, res.data.username);
      navigate("/");
    } catch (e: any) {
      setError(e.response?.data?.detail || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      fontFamily: "Inter, sans-serif",
    }}>

      {/* Animated background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/9c5457b8-9ab0-4a04-9fc1-e608d5670f1a/710d74e0-7158-408e-8d9b-23c219dee0eb/IN-en-20230814-popsignuptwoweeks-perspective_alpha_website_large.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.35,
        animation: "float 12s ease-in-out infinite",
        transform: "scale(1.05)",
      }} />

      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(229,9,20,0.08) 50%, rgba(0,0,0,0.85) 100%)",
      }} />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${60 + i * 40}px`,
          height: `${60 + i * 40}px`,
          borderRadius: "50%",
          border: "1px solid rgba(229,9,20,0.15)",
          top: `${10 + i * 15}%`,
          left: `${5 + i * 15}%`,
          animation: `float ${4 + i}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Logo top left */}
      <div style={{
        position: "absolute", top: "28px", left: "40px",
        color: "#E50914", fontSize: "28px", fontWeight: 900,
        fontStyle: "italic", letterSpacing: "1px",
        animation: "textGlow 3s ease infinite",
        cursor: "pointer", zIndex: 10,
      }} onClick={() => navigate("/")}>
        NETFIX
      </div>

      {/* Login card */}
      <div style={{
        position: "relative", zIndex: 10,
        width: "420px",
        background: "rgba(0,0,0,0.88)",
        borderRadius: "16px",
        padding: "52px 48px",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(30px)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.9), 0 0 60px rgba(229,9,20,0.05)",
        animation: "zoomIn 0.6s cubic-bezier(0.34,1.56,0.64,1)",
      }}>

        {/* Title */}
        <h1 style={{
          fontSize: "30px", fontWeight: 800,
          textAlign: "center", marginBottom: "8px",
          color: "white", letterSpacing: "-0.5px",
        }}>
          {isRegister ? "Create Account" : "Welcome Back"}
        </h1>
        <p style={{
          textAlign: "center", color: "rgba(255,255,255,0.4)",
          fontSize: "13px", marginBottom: "32px",
        }}>
          {isRegister ? "Join millions of movie lovers" : "Sign in to continue watching"}
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(229,9,20,0.12)",
            border: "1px solid rgba(229,9,20,0.35)",
            borderRadius: "8px", padding: "12px 16px",
            marginBottom: "20px", animation: "fadeIn 0.3s ease",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span style={{ color: "#E50914", fontSize: "16px" }}>⚠</span>
            <span style={{ color: "#ff6b6b", fontSize: "13px" }}>{error}</span>
          </div>
        )}

        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>

          {/* Username */}
          <div style={{ position: "relative" }}>
            <label style={{
              position: "absolute", top: focused === "username" || form.username ? "8px" : "16px",
              left: "16px", fontSize: focused === "username" || form.username ? "10px" : "14px",
              color: focused === "username" ? "#E50914" : "rgba(255,255,255,0.4)",
              transition: "all 0.2s ease", pointerEvents: "none", fontWeight: 500,
            }}>Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              onFocus={() => setFocused("username")}
              onBlur={() => setFocused("")}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{
                width: "100%", padding: "24px 16px 8px",
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${focused === "username" ? "rgba(229,9,20,0.6)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "8px", color: "white",
                fontSize: "15px", outline: "none",
                fontFamily: "Inter, sans-serif",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                boxShadow: focused === "username" ? "0 0 0 3px rgba(229,9,20,0.1)" : "none",
              }}
            />
          </div>

          {/* Email (register only) */}
          {isRegister && (
            <div style={{ position: "relative" }}>
              <label style={{
                position: "absolute", top: focused === "email" || form.email ? "8px" : "16px",
                left: "16px", fontSize: focused === "email" || form.email ? "10px" : "14px",
                color: focused === "email" ? "#E50914" : "rgba(255,255,255,0.4)",
                transition: "all 0.2s ease", pointerEvents: "none", fontWeight: 500,
              }}>Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                style={{
                  width: "100%", padding: "24px 16px 8px",
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${focused === "email" ? "rgba(229,9,20,0.6)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "8px", color: "white",
                  fontSize: "15px", outline: "none",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                  boxShadow: focused === "email" ? "0 0 0 3px rgba(229,9,20,0.1)" : "none",
                }}
              />
            </div>
          )}

          {/* Password */}
          <div style={{ position: "relative" }}>
            <label style={{
              position: "absolute", top: focused === "password" || form.password ? "8px" : "16px",
              left: "16px", fontSize: focused === "password" || form.password ? "10px" : "14px",
              color: focused === "password" ? "#E50914" : "rgba(255,255,255,0.4)",
              transition: "all 0.2s ease", pointerEvents: "none", fontWeight: 500,
            }}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{
                width: "100%", padding: "24px 16px 8px",
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${focused === "password" ? "rgba(229,9,20,0.6)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "8px", color: "white",
                fontSize: "15px", outline: "none",
                fontFamily: "Inter, sans-serif",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                boxShadow: focused === "password" ? "0 0 0 3px rgba(229,9,20,0.1)" : "none",
              }}
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            background: loading
              ? "rgba(229,9,20,0.5)"
              : "linear-gradient(135deg, #E50914 0%, #b20710 100%)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "16px",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.3px",
            transition: "all 0.3s ease",
            boxShadow: loading ? "none" : "0 8px 30px rgba(229,9,20,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 12px 40px rgba(229,9,20,0.6)";
            }
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.transform = "translateY(0)";
            (e.target as HTMLButtonElement).style.boxShadow = "0 8px 30px rgba(229,9,20,0.4)";
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: "16px", height: "16px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid white",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }} />
              Please wait...
            </>
          ) : (
            isRegister ? "Create Account →" : "Sign In →"
          )}
        </button>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: "12px", margin: "24px 0",
        }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Toggle */}
        <p style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.45)",
          fontSize: "14px", lineHeight: 1.6,
        }}>
          {isRegister ? "Already have an account? " : "New to Netfix? "}
          <span
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            style={{
              color: "white", fontWeight: 700,
              cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.3)",
              paddingBottom: "1px", transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLSpanElement).style.color = "#E50914";
              (e.target as HTMLSpanElement).style.borderColor = "#E50914";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLSpanElement).style.color = "white";
              (e.target as HTMLSpanElement).style.borderColor = "rgba(255,255,255,0.3)";
            }}
          >
            {isRegister ? "Sign In" : "Sign Up now"}
          </span>
        </p>
      </div>
    </div>
  );
}