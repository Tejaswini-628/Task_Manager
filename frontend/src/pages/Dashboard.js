import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Central API URL
const API_URL = process.env.REACT_APP_API_URL || "https://task-manager-x6in.onrender.com";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [darkMode, setDarkMode] = useState(false);

  const [analytics, setAnalytics] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: ""
  });

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    sort: ""
  });

  const token = localStorage.getItem("token");

  // 🌙 Theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // 📦 Fetch Tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: "Bearer " + token },
        params: { ...filters, page }
      });

      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
      setError("");
    } catch {
      setError("Failed to load tasks ❌");
    } finally {
      setLoading(false);
    }
  };

  // 📊 Analytics
  const fetchAnalytics = async () => {
    const res = await axios.get(`${API_URL}/api/tasks/analytics`, {
      headers: { Authorization: "Bearer " + token }
    });
    setAnalytics(res.data);
  };

  useEffect(() => {
    fetchTasks();
    fetchAnalytics();
  }, [filters, page]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  // ➕ Create Task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.priority || !form.dueDate) {
      alert("Fill all fields ⚠️");
      return;
    }

    await axios.post(
      `${API_URL}/api/tasks`,
      { ...form, status: "In Progress" },
      { headers: { Authorization: "Bearer " + token } }
    );

    setForm({ title: "", description: "", priority: "", dueDate: "" });
    fetchTasks();
    fetchAnalytics();
  };

  // ✏️ Edit
  const enableEdit = (id) => {
    setTasks(prev =>
      prev.map(t => t._id === id ? { ...t, editing: true } : t)
    );
  };

  const handleEditChange = (id, field, value) => {
    setTasks(prev =>
      prev.map(t => t._id === id ? { ...t, [field]: value } : t)
    );
  };

  const saveEdit = async (task) => {
    await axios.put(
      `${API_URL}/api/tasks/${task._id}`,
      { title: task.title, description: task.description },
      { headers: { Authorization: "Bearer " + token } }
    );
    fetchTasks();
  };

  // ✅ Done
  const markDone = async (id) => {
    await axios.put(
      `${API_URL}/api/tasks/${id}`,
      { status: "Done" },
      { headers: { Authorization: "Bearer " + token } }
    );
    fetchTasks();
    fetchAnalytics();
  };

  // ❌ Delete
  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/api/tasks/${id}`, {
      headers: { Authorization: "Bearer " + token }
    });
    fetchTasks();
    fetchAnalytics();
  };

  const getStatusColor = (s) =>
    s === "Done" ? "#28a745" : s === "In Progress" ? "#ffc107" : "#6c757d";

  const getPriorityColor = (p) =>
    p === "High" ? "#dc3545" : p === "Medium" ? "#fd7e14" : "#20c997";

  return (
    <div
      style={{
        ...styles.container,
        background: darkMode ? "#1e293b" : "#f4f6f8",
        color: darkMode ? "white" : "black"
      }}
    >
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.heading}>Task Manager</h1>

        <div
          style={{
            ...styles.toggleContainer,
            background: darkMode ? "#22c55e" : "#ccc"
          }}
          onClick={() => setDarkMode(!darkMode)}
        >
          <div
            style={{
              ...styles.toggleCircle,
              transform: darkMode ? "translateX(26px)" : "translateX(2px)"
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </div>
        </div>
      </div>

      {/* ANALYTICS */}
      <div style={styles.analytics}>
        {["total", "completed", "pending", "completionRate"].map((key) => (
          <div key={key} style={styles.statCard}>
            <h3>{key}</h3>
            <p>{analytics[key]}{key === "completionRate" ? "%" : ""}</p>
          </div>
        ))}
      </div>

      {/* CREATE */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} style={styles.input}/>
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} style={styles.input}/>
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} style={styles.input}/>
        <select name="priority" value={form.priority} onChange={handleChange} style={styles.input}>
          <option value="">Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button style={styles.button}>Add Task</button>
      </form>

      {/* TASKS */}
      {tasks.map(t => (
        <div key={t._id} style={styles.taskRow}>
          <div>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <button onClick={()=>markDone(t._id)}>Done</button>
          </div>

          <div>
            <button onClick={()=>deleteTask(t._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container:{padding:"30px"},
  header:{display:"flex",justifyContent:"space-between"},
  heading:{color:"#1e3a8a"},
  toggleContainer:{width:"50px",height:"26px",borderRadius:"20px",display:"flex",alignItems:"center",cursor:"pointer",padding:"2px"},
  toggleCircle:{width:"22px",height:"22px",borderRadius:"50%",background:"white",display:"flex",alignItems:"center",justifyContent:"center"},
  analytics:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"},
  statCard:{padding:"10px",background:"white"},
  form:{display:"flex",gap:"10px",margin:"20px 0"},
  input:{padding:"10px"},
  button:{background:"#1e3a8a",color:"white"},
  taskRow:{display:"flex",justifyContent:"space-between",margin:"10px 0"}
};

export default Dashboard;