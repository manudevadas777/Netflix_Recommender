import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore";

export default function Social() {
  const [friends, setFriends] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [friendInput, setFriendInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    Promise.all([
      api.get("/social/friends"),
      api.get("/social/activity"),
    ]).then(([f, a]: any) => {
      setFriends(f.data);
      setActivity(a.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  const addFriend = async () => {
    if (!friendInput.trim()) return;
    try {
      const res: any = await api.post("/social/friend/add", { username: friendInput });
      setMessage(`✓ ${res.data.message}`);
      setFriendInput("");
      const f: any = await api.get("/social/friends");
      setFriends(f.data);
    } catch (e: any) {
      setMessage(`✗ ${e.response?.data?.detail || "Error adding friend"}`);
    }
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#141414" }}>
      <Navbar />
      <div style={{ padding: "100px 60px 60px" }}>

        {/* Header */}
        <h1 style={{
          fontSize: "42px", fontWeight: 900,
          letterSpacing: "-1px", marginBottom: "40px",
          background: "linear-gradient(135deg, #fff 60%, rgba(255,255,255,0.6))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Friends & Activity
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px" }}>

          {/* Left — Friends */}
          <div>
            {/* Add friend */}
            <div style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "white" }}>
                Add a Friend
              </h2>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  value={friendInput}
                  onChange={(e) => setFriendInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addFriend()}
                  placeholder="Enter username..."
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "8px", padding: "10px 14px",
                    color: "white", fontSize: "14px",
                    fontFamily: "Inter, sans-serif", outline: "none",
                  }}
                />
                <button
                  className="btn btn-red"
                  onClick={addFriend}
                  style={{ padding: "10px 18px", fontSize: "13px" }}
                >
                  Add
                </button>
              </div>
              {message && (
                <p style={{
                  marginTop: "10px", fontSize: "13px",
                  color: message.startsWith("✓") ? "#46d369" : "#E50914",
                  animation: "fadeIn 0.3s ease",
                }}>
                  {message}
                </p>
              )}
            </div>

            {/* Friends list */}
            <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "14px", color: "white" }}>
              Your Friends ({friends.length})
            </h2>
            {loading ? (
              <div className="spinner" style={{ margin: "20px auto" }} />
            ) : friends.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "40px 20px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "12px",
                border: "1px dashed rgba(255,255,255,0.1)",
              }}>
                <span style={{ fontSize: "40px" }}>👥</span>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "12px" }}>
                  No friends yet. Add some!
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {friends.map((f) => (
                  <div key={f.id} style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "10px", padding: "14px 16px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    animation: "fadeInUp 0.5s ease",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                      <div style={{
                        width: "38px", height: "38px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #E50914, #b20710)",
                        display: "flex", alignItems: "center",
                        justifyContent: "center", fontWeight: 700,
                        fontSize: "16px", color: "white",
                        boxShadow: "0 4px 12px rgba(229,9,20,0.3)",
                      }}>
                        {f.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: "14px", color: "white" }}>{f.username}</p>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                          {f.recent_activity.length} recent ratings
                        </p>
                      </div>
                    </div>
                    {f.recent_activity.length > 0 && (
                      <div style={{ display: "flex", gap: "6px" }}>
                        {f.recent_activity.map((m: any, i: number) => (
                          <div key={i} title={`${m.title} - ${m.rating}★`} style={{ position: "relative" }}>
                            <img
                              src={m.poster}
                              alt={m.title}
                              style={{
                                width: "40px", height: "60px",
                                objectFit: "cover", borderRadius: "4px",
                                border: "1px solid rgba(255,255,255,0.1)",
                              }}
                            />
                            <span style={{
                              position: "absolute", bottom: "2px", right: "2px",
                              background: "rgba(0,0,0,0.8)",
                              fontSize: "8px", color: "#f5c518",
                              padding: "1px 3px", borderRadius: "2px",
                            }}>
                              {m.rating}★
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — Activity Feed */}
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "14px", color: "white" }}>
              Friends Activity Feed
            </h2>
            {loading ? (
              <div className="spinner" style={{ margin: "20px auto" }} />
            ) : activity.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "60px 20px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "12px",
                border: "1px dashed rgba(255,255,255,0.1)",
              }}>
                <span style={{ fontSize: "40px" }}>🎬</span>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "12px" }}>
                  No activity yet. Add friends to see what they're watching!
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {activity.map((a, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "14px", alignItems: "center",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "10px", padding: "14px 16px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    animation: `fadeInUp 0.5s ease ${i * 0.05}s both`,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                    onClick={() => navigate(`/movie/${a.movie_id}`)}
                  >
                    <img
                      src={a.poster}
                      alt={a.movie_title}
                      style={{
                        width: "48px", height: "72px",
                        objectFit: "cover", borderRadius: "5px",
                        flexShrink: 0,
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <div style={{
                          width: "24px", height: "24px", borderRadius: "50%",
                          background: "linear-gradient(135deg, #E50914, #b20710)",
                          display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: "11px",
                          fontWeight: 700, color: "white", flexShrink: 0,
                        }}>
                          {a.username[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>
                          {a.username}
                        </span>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                          rated
                        </span>
                      </div>
                      <p style={{
                        fontSize: "14px", fontWeight: 700, color: "white",
                        marginBottom: "4px", whiteSpace: "nowrap",
                        overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {a.movie_title}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} style={{
                            fontSize: "12px",
                            color: s <= a.rating ? "#f5c518" : "rgba(255,255,255,0.2)",
                          }}>★</span>
                        ))}
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginLeft: "4px" }}>
                          {new Date(a.watched_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}