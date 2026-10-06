const fs = require("fs");
const target = "C:/Users/Prathika/codezoner-capstone-project/client/src/main.jsx";

const content = `import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [msg, setMsg] = useState("");

  const loadData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/projects");
      const data = await res.json();
      if (data.success) setProjects(data.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: desc.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("Project Stored Successfully!");
        setTitle("");
        setDesc("");
        loadData();
      }
    } catch (e) {
      setMsg("Error saving project");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("http://localhost:5000/api/projects/" + id, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMsg("Project Deleted!");
        loadData();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const h = React.createElement;

  return h("div", { style: { maxWidth: "600px", margin: "30px auto", fontFamily: "sans-serif", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" } },
    h("h2", { style: { textAlign: "center" } }, "Day 31: Data Storage & Retrieval"),
    h("p", { style: { textAlign: "center", color: "#666" } }, "SaaS Project CRUD & SQLite Storage"),
    msg ? h("div", { style: { background: "#d4edda", padding: "10px", marginBottom: "15px", borderRadius: "4px" } }, msg) : null,
    h("form", { onSubmit: handleSave, style: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" } },
      h("input", { style: { padding: "8px" }, placeholder: "Project Title", value: title, onChange: (e) => setTitle(e.target.value), required: true }),
      h("input", { style: { padding: "8px" }, placeholder: "Description", value: desc, onChange: (e) => setDesc(e.target.value) }),
      h("button", { type: "submit", style: { padding: "10px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" } }, "Save to Database")
    ),
    h("h4", null, "Stored Projects (" + projects.length + "):"),
    projects.length === 0
      ? h("p", { style: { color: "#888" } }, "No data found yet.")
      : projects.map((p) =>
          h("div", { key: p.id, style: { borderBottom: "1px solid #eee", padding: "8px 0", display: "flex", justifyContent: "space-between" } },
            h("span", null, h("strong", null, p.title), " - ", p.description || "No description"),
            h("button", { onClick: () => handleDelete(p.id), style: { background: "#dc3545", color: "#fff", border: "none", padding: "4px 8px", cursor: "pointer" } }, "Delete")
          )
        )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
`;

fs.writeFileSync(target, content, "utf8");
console.log("MAIN_JSX_UPDATED_PERFECTLY");

