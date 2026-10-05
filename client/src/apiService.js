const API_BASE = "http://localhost:5000/api";

// 1. User Registration
export const registerUser = async (name, email, password, role = "user") => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
};

// 2. User Login
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

// 3. Test RBAC Protected Route
export const fetchRoleData = async (token, targetRole) => {
  const endpoint = targetRole === "admin" ? "/auth/admin-dashboard" : "/auth/profile";
  const res = await fetch(`\({API_BASE}\){endpoint}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}: Access Denied`);
  return data;
};
