import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // 🌙 Persist Theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://task-manager-x6in.onrender.com/api/tasks",
        {
          headers: { Authorization: "Bearer " + token },
          params: { ...filters, page }
        }
      );

      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
      setError("");
    } catch {
      setError("Failed to load tasks ❌");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
        "https://task-manager-x6in.onrender.com/api/tasks/analytics",
        {
          headers: { Authorization: "Bearer " + token }
        }
      );
      setAnalytics(res.data);
    } catch {
      console.log("Analytics error");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchAnalytics();
    // eslint-disable-next-line
  }, [filters, page]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  // CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.priority || !form.dueDate) {
      alert("Fill all fields ⚠️");
      return;
    }

    await axios.post(
      "https://task-manager-x6in.onrender.com/api/tasks",
      { ...form, status: "In Progress" },
      { headers: { Authorization: "Bearer " + token } }
    );

    setForm({ title: "", description: "", priority: "", dueDate: "" });
    fetchTasks();
    fetchAnalytics();
  };

  // DONE
  const markDone = async (id) => {
    await axios.put(
      `https://task-manager-x6in.onrender.com/api/tasks/${id}`,
      { status: "Done" },
      { headers: { Authorization: "Bearer " + token } }
    );
    fetchTasks();
    fetchAnalytics();
  };

  // DELETE
  const deleteTask = async (id) => {
    await axios.delete(
      `https://task-manager-x6in.onrender.com/api/tasks/${id}`,
      {
        headers: { Authorization: "Bearer " + token }
      }
    );
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

        {/* TOGGLE */}
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
              transform: darkMode
                ? "translateX(26px)"
                : "translateX(2px)"
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </div>
        </div>
      </div>

      {/* ANALYTICS */}
      <div style={styles.analytics}>
        {["total", "completed", "pending", "completionRate"].map((key) => (
          <div
            key={key}
            style={{
              ...styles.statCard,
              background: darkMode ? "#334155" : "white"
            }}
          >
            <h3>{key}</h3>
            <p>
              {analytics[key]}
              {key === "completionRate" ? "%" : ""}
            </p>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div style={styles.filters}>
        <input
          placeholder="Search"
          name="search"
          onChange={handleFilterChange}
          style={styles.input}
        />

        <select name="status" onChange={handleFilterChange} style={styles.input}>
          <option value="">All Status</option>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <select name="priority" onChange={handleFilterChange} style={styles.input}>
          <option value="">All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select name="sort" onChange={handleFilterChange} style={styles.input}>
          <option value="">Sort</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
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

      {/* STATES */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* TASK LIST */}
      {tasks.map((t) => (
        <div key={t._id} style={styles.taskRow}>
          <div style={{ flex: 1 }}>
            <h3>
              {t.title}
              <span style={styles.date}>
                {" "}
                ({t.dueDate?.substring(0, 10)})
              </span>
            </h3>

            <p>{t.description}</p>

            {t.status !== "Done" && (
              <button style={styles.doneBtn} onClick={() => markDone(t._id)}>
                Mark Done
              </button>
            )}

            {t.status === "Done" && (
              <span style={styles.tick}>✔ Completed</span>
            )}
          </div>

          <div style={styles.right}>
            <span
              style={{
                ...styles.badge,
                background: getStatusColor(t.status)
              }}
            >
              {t.status}
            </span>

            <span
              style={{
                ...styles.badge,
                background: getPriorityColor(t.priority)
              }}
            >
              {t.priority}
            </span>

            <span style={styles.deleteIcon} onClick={() => deleteTask(t._id)}>
              🗑️
            </span>
          </div>
        </div>
      ))}

      {/* PAGINATION */}
      <div style={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={styles.pageBtn}
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          style={styles.pageBtn}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "30px", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  heading: { color: "#1e3a8a" },
  toggleContainer: { width: "50px", height: "26px", borderRadius: "20px", display: "flex", alignItems: "center", cursor: "pointer", padding: "2px" },
  toggleCircle: { width: "22px", height: "22px", borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", transition: "0.3s" },
  analytics: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "10px", margin: "20px 0" },
  statCard: { padding: "15px", borderRadius: "10px", textAlign: "center" },
  filters: { display: "flex", gap: "10px" },
  form: { display: "flex", gap: "10px", flexWrap: "wrap", margin: "20px 0" },
  input: { padding: "10px", border: "1px solid #ccc", borderRadius: "5px" },
  button: { background: "#1e3a8a", color: "white", padding: "10px", border: "none" },
  taskRow: { padding: "15px", marginBottom: "10px", borderRadius: "8px", display: "flex", justifyContent: "space-between" },
  right: { display: "flex", gap: "8px", alignItems: "center" },
  badge: { color: "white", padding: "5px 10px", borderRadius: "20px" },
  deleteIcon: { color: "#dc3545", cursor: "pointer" },
  doneBtn: { marginTop: "5px", background: "#1e3a8a", color: "white", border: "none", padding: "5px 10px" },
  tick: { color: "#28a745" },
  date: { fontSize: "12px", color: "#888" },
  pagination: { marginTop: "20px", display: "flex", gap: "10px" },
  pageBtn: { background: "#1e3a8a", color: "white", border: "none", padding: "5px 10px" }
};

export default Dashboard;