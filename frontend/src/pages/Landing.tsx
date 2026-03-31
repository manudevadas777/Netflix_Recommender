import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const FEATURES = [
  {
    icon: "🎯",
    title: "Smart Recommendations",
    desc: "Our AI learns your taste and recommends movies you'll actually love — not just popular ones.",
    color: "#7c4dff",
  },
  {
    icon: "🎭",
    title: "Mood-Based Discovery",
    desc: "Not sure what to watch? Pick your mood and we'll find the perfect movie for your vibe.",
    color: "#E50914",
  },
  {
    icon: "👥",
    title: "Watch With Friends",
    desc: "See what your friends are watching, share ratings and discover movies together.",
    color: "#46d369",
  },
  {
    icon: "🎬",
    title: "Instant Trailers",
    desc: "Watch YouTube trailers instantly without leaving the app. Decide faster, watch better.",
    color: "#f5c518",
  },
  {
    icon: "📋",
    title: "Your Watchlist",
    desc: "Save movies to watch later. Your personal curated list always in sync.",
    color: "#54b9c5",
  },
  {
    icon: "⭐",
    title: "Rate & Refine",
    desc: "Rate movies you've watched and our engine gets smarter with every rating.",
    color: "#ff4081",
  },
];

const MOVIES = [
  "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bAY1lIG0vVdHa09Z.jpg",
  "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
  "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  "https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
  "https://image.tmdb.org/t/p/w500/A4j8S6moJS2zNtRR8oWF08gRnL5.jpg",
  "https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
  "https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
  "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
  "https://image.tmdb.org/t/p/w500/xmbU4JTUm4MBDZSTE1JoMquLkn8.jpg",
  "https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg",
  "https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
];

export default function Landing() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      fontFamily: "Inter, sans-serif",
      overflow: "hidden",
    }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 100,
        padding: "20px 64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrollY > 50 ? "rgba(10,10,10,0.98)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(30px)" : "none",
        borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.04)" : "none",
        transition: "all 0.5s ease",
      }}>
        <span style={{
          color: "#E50914", fontSize: "30px", fontWeight: 900,
          fontStyle: "italic", letterSpacing: "1px",
          textShadow: "0 0 30px rgba(229,9,20,0.6)",
          cursor: "pointer",
        }}>NETFIX</span>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "transparent", color: "white",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "6px", padding: "9px 22px",
              fontSize: "14px", fontWeight: 600,
              cursor: "pointer", fontFamily: "Inter, sans-serif",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.6)";
              (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.25)";
              (e.target as HTMLButtonElement).style.background = "transparent";
            }}
          >Sign In</button>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "linear-gradient(135deg, #E50914, #b20710)",
              color: "white", border: "none",
              borderRadius: "6px", padding: "9px 22px",
              fontSize: "14px", fontWeight: 700,
              cursor: "pointer", fontFamily: "Inter, sans-serif",
              boxShadow: "0 4px 20px rgba(229,9,20,0.4)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 8px 30px rgba(229,9,20,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = "translateY(0)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(229,9,20,0.4)";
            }}
          >Get Started</button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <div style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center",
        justifyContent: "center", overflow: "hidden",
        paddingTop: "80px",
      }}>

        {/* Animated background movie posters */}
        <div style={{
          position: "absolute", inset: 0,
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "8px", padding: "8px",
          opacity: 0.12,
          transform: `translateY(${scrollY * 0.3}px)`,
          transition: "transform 0.1s linear",
        }}>
          {[...MOVIES, ...MOVIES].map((src, i) => (
            <img
              key={i} src={src}
              alt=""
              style={{
                width: "100%", aspectRatio: "2/3",
                objectFit: "cover", borderRadius: "8px",
                animationDelay: `${i * 0.2}s`,
              }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ))}
        </div>

        {/* Gradient overlays */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, rgba(229,9,20,0.08) 0%, rgba(10,10,10,0.95) 70%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(0deg, #0a0a0a 0%, transparent 30%, transparent 70%, #0a0a0a 100%)",
        }} />

        {/* Hero content */}
        <div style={{
          position: "relative", zIndex: 10,
          textAlign: "center", maxWidth: "800px",
          padding: "0 32px",
          animation: "fadeInUp 0.9s ease both",
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(229,9,20,0.1)",
            border: "1px solid rgba(229,9,20,0.3)",
            borderRadius: "50px", padding: "6px 16px",
            marginBottom: "28px",
            animation: "fadeIn 0.6s ease 0.2s both",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#E50914", display: "inline-block" }} />
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.5px" }}>
              AI-Powered Movie Recommendations
            </span>
          </div>

          {/* Main title */}
          <h1 style={{
            fontSize: "clamp(52px, 8vw, 88px)",
            fontWeight: 900, lineHeight: 1.0,
            letterSpacing: "-4px", marginBottom: "24px",
            background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "fadeInUp 0.8s ease 0.3s both",
          }}>
            Your Next<br />
            <span style={{
              background: "linear-gradient(135deg, #E50914, #ff4444, #E50914)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradientShift 3s ease infinite",
            }}>
              Favorite Film
            </span><br />
            Awaits
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: "18px", fontWeight: 400,
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.75, marginBottom: "44px",
            maxWidth: "560px", margin: "0 auto 44px",
            animation: "fadeInUp 0.8s ease 0.5s both",
          }}>
            Discover movies tailored to your unique taste using AI. Rate, save, and share with friends.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: "flex", gap: "14px",
            justifyContent: "center", flexWrap: "wrap",
            animation: "fadeInUp 0.8s ease 0.7s both",
          }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "linear-gradient(135deg, #E50914, #b20710)",
                color: "white", border: "none",
                borderRadius: "8px", padding: "16px 40px",
                fontSize: "17px", fontWeight: 800,
                cursor: "pointer", fontFamily: "Inter, sans-serif",
                boxShadow: "0 8px 35px rgba(229,9,20,0.5)",
                transition: "all 0.3s ease",
                letterSpacing: "0.3px",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(-3px) scale(1.03)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 16px 50px rgba(229,9,20,0.7)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 8px 35px rgba(229,9,20,0.5)";
              }}
            >
              Start Watching Free →
            </button>
            <button
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "8px", padding: "16px 40px",
                fontSize: "17px", fontWeight: 600,
                cursor: "pointer", fontFamily: "Inter, sans-serif",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)";
                (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
                (e.target as HTMLButtonElement).style.transform = "translateY(0)";
              }}
            >
              See How It Works
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: "48px",
            justifyContent: "center", marginTop: "64px",
            animation: "fadeInUp 0.8s ease 0.9s both",
          }}>
            {[
              { value: "10K+", label: "Movies" },
              { value: "AI", label: "Powered" },
              { value: "Free", label: "Forever" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: "32px", fontWeight: 900,
                  color: "white", letterSpacing: "-1px",
                  marginBottom: "4px",
                }}>{stat.value}</div>
                <div style={{
                  fontSize: "13px", color: "rgba(255,255,255,0.35)",
                  fontWeight: 500, letterSpacing: "1px",
                  textTransform: "uppercase",
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "40px", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "8px",
          animation: "float 2s ease-in-out infinite",
          opacity: 0.4, cursor: "pointer",
        }} onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
          <span style={{ fontSize: "12px", color: "white", letterSpacing: "2px", textTransform: "uppercase" }}>Scroll</span>
          <div style={{
            width: "1px", height: "40px",
            background: "linear-gradient(0deg, transparent, white)",
          }} />
        </div>
      </div>

      {/* ── FEATURES SECTION ── */}
      <div id="features" style={{
        padding: "120px 64px",
        position: "relative",
      }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "50px", padding: "6px 16px",
            marginBottom: "20px",
          }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>
              Everything You Need
            </span>
          </div>
          <h2 style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 900, letterSpacing: "-2px",
            color: "white", marginBottom: "16px",
          }}>
            Built for movie lovers
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.4)", fontSize: "16px",
            maxWidth: "480px", margin: "0 auto", lineHeight: 1.7,
          }}>
            Every feature designed to help you find and enjoy movies better than ever before.
          </p>
        </div>

        {/* Feature grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px", maxWidth: "1100px", margin: "0 auto",
        }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                background: hoveredFeature === i
                  ? `rgba(${f.color === "#E50914" ? "229,9,20" : f.color === "#7c4dff" ? "124,77,255" : f.color === "#46d369" ? "70,211,105" : f.color === "#f5c518" ? "245,197,24" : f.color === "#54b9c5" ? "84,185,197" : "255,64,129"},0.08)`
                  : "rgba(255,255,255,0.02)",
                border: `1px solid ${hoveredFeature === i ? f.color + "44" : "rgba(255,255,255,0.06)"}`,
                borderRadius: "16px", padding: "32px",
                transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                transform: hoveredFeature === i ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                boxShadow: hoveredFeature === i ? `0 20px 50px ${f.color}22` : "none",
                cursor: "default",
              }}
            >
              <div style={{
                fontSize: "40px", marginBottom: "20px",
                display: "inline-block",
                transform: hoveredFeature === i ? "scale(1.2) rotate(5deg)" : "scale(1) rotate(0deg)",
                transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              }}>{f.icon}</div>
              <h3 style={{
                fontSize: "18px", fontWeight: 800,
                color: "white", marginBottom: "10px",
                letterSpacing: "-0.3px",
              }}>{f.title}</h3>
              <p style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "14px", lineHeight: 1.75, fontWeight: 400,
              }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{
        padding: "100px 64px",
        background: "rgba(255,255,255,0.01)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 900, letterSpacing: "-2px", color: "white",
          }}>How it works</h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "32px", maxWidth: "900px", margin: "0 auto",
          position: "relative",
        }}>
          {[
            { step: "01", title: "Sign Up Free", desc: "Create your account in seconds. No credit card needed.", color: "#E50914" },
            { step: "02", title: "Rate Movies", desc: "Tell us what you love. Rate a few movies to get started.", color: "#7c4dff" },
            { step: "03", title: "Get Picks", desc: "Our AI instantly learns your taste and recommends films.", color: "#46d369" },
            { step: "04", title: "Enjoy!", desc: "Watch trailers, save to list, share with friends.", color: "#f5c518" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", position: "relative" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: `${s.color}18`,
                border: `2px solid ${s.color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "22px", fontWeight: 900, color: s.color,
                transition: "all 0.3s ease",
              }}>{s.step}</div>
              <h3 style={{
                fontSize: "18px", fontWeight: 800,
                color: "white", marginBottom: "10px",
              }}>{s.title}</h3>
              <p style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "14px", lineHeight: 1.7,
              }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA SECTION ── */}
      <div style={{
        padding: "120px 64px",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(229,9,20,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 900, letterSpacing: "-2px",
            color: "white", marginBottom: "20px", lineHeight: 1.1,
          }}>
            Ready to find your<br />
            <span style={{ color: "#E50914" }}>next obsession?</span>
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.4)", fontSize: "16px",
            marginBottom: "44px", lineHeight: 1.7,
          }}>
            Join and start discovering movies you'll actually love.
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "linear-gradient(135deg, #E50914, #b20710)",
              color: "white", border: "none",
              borderRadius: "8px", padding: "18px 52px",
              fontSize: "18px", fontWeight: 800,
              cursor: "pointer", fontFamily: "Inter, sans-serif",
              boxShadow: "0 8px 40px rgba(229,9,20,0.5)",
              transition: "all 0.3s ease", letterSpacing: "0.3px",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.transform = "translateY(-3px) scale(1.04)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 16px 60px rgba(229,9,20,0.7)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 8px 40px rgba(229,9,20,0.5)";
            }}
          >
            Get Started — It's Free →
          </button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "32px 64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{
          color: "#E50914", fontSize: "20px", fontWeight: 900,
          fontStyle: "italic", letterSpacing: "1px",
        }}>NETFIX</span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>
          Built with ❤️ for movie lovers
        </span>
      </div>
    </div>
  );
}