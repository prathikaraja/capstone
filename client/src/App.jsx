import React, { useState } from "react";

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@capstone.local");
  const [password, setPassword] = useState("Pass1234!");
  const [role, setRole] = useState("admin");

  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [roleResult, setRoleResult] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setStatusMsg("");
    setErrorMsg("");
    setRoleResult("");
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister ? { name, email, password, role } : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");

      if (isRegister) {
        setStatusMsg(data.message + " Please log in.");
        setIsRegister(false);
      } else {
        setToken(data.token);
        setCurrentUser(data.user);
        setStatusMsg("Logged in as " + data.user.role.toUpperCase() + "!");
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleRoleCheck = async (targetRole) => {
    setRoleResult("");
    setErrorMsg("");
    try {
      const endpoint = targetRole === "admin" ? "/api/auth/admin-dashboard" : "/api/auth/profile";
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Access Denied");
      setRoleResult(data.message);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleLogout = () => {
    setToken("");
    setCurrentUser(null);
    setStatusMsg("Logged out successfully.");
    setRoleResult("");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif", maxWidth: "520px", margin: "30px auto", border: "1px solid #ccc", borderRadius: "8px", background: "#fff" }}>
      <h2 style={{ textAlign: "center" }}>Day 30: User Authentication & RBAC</h2>

      {statusMsg && <div style={{ background: "#d4edda", color: "#155724", padding: "10px", borderRadius: "4px", marginBottom: "15px" }}>{statusMsg}</div>}
      {errorMsg && <div style={{ background: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "4px", marginBottom: "15px" }}>{errorMsg}</div>}
      {roleResult && <div style={{ background: "#cce5ff", color: "#004085", padding: "10px", borderRadius: "4px", marginBottom: "15px" }}>{roleResult}</div>}

      {!token ? (
        <div>
          <h3>{isRegister ? "Register User" : "Login"}</h3>
          <form onSubmit={handleAuth}>
            {isRegister && (
              <div style={{ marginBottom: "10px" }}>
                <label>Name: </label>
                <input style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}
            <div style={{ marginBottom: "10px" }}>
              <label>Email: </label>
              <input style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Password: </label>
              <input style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {isRegister && (
              <div style={{ marginBottom: "12px" }}>
                <label>Role: </label>
                <select style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            <button type="submit" style={{ padding: "8px 18px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "10px" }}>
              {isRegister ? "Sign Up" : "Log In"}
            </button>
            <button type="button" onClick={() => setIsRegister(!isRegister)} style={{ marginLeft: "10px", background: "none", border: "none", color: "#007bff", cursor: "pointer", textDecoration: "underline" }}>
              {isRegister ? "Already registered? Login" : "Need an account? Register"}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ border: "1px solid #28a745", padding: "15px", borderRadius: "6px" }}>
          <h3 style={{ color: "#28a745", margin: "0 0 10px 0" }}>User Session Active</h3>
          <p><strong>Email:</strong> {currentUser?.email}</p>
          <p><strong>Role:</strong> <span style={{ color: "#007bff", fontWeight: "bold" }}>{currentUser?.role}</span></p>

          <div style={{ marginTop: "15px" }}>
            <h4>Role Access Testing:</h4>
            <button onClick={() => handleRoleCheck("user")} style={{ padding: "8px 12px", marginRight: "10px", backgroundColor: "#17a2b8", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Access User Profile
            </button>
            <button onClick={() => handleRoleCheck("admin")} style={{ padding: "8px 12px", backgroundColor: "#6f42c1", color: "#fff", border: "none", borderRadius: "4px", description: "pointer", cursor: "pointer" }}>
              Access Admin Dashboard
            </button>
          </div>

          <button onClick={handleLogout} style={{ marginTop: "15px", padding: "6px 12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
