import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// ✅ Central API URL
const API_URL = process.env.REACT_APP_API_URL || "https://task-manager-x6in.onrender.com";

function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/signup`, form);
      alert("Registered successfully");
      navigate("/");
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.heading}>Sign Up</h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Sign Up
        </button>

        <p style={styles.text}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>Login</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8"
  },
  card: {
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    width: "320px"
  },
  heading: {
    textAlign: "center",
    marginBottom: "15px",
    color: "#1e3a8a"
  },
  input: {
    margin: "10px 0",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px"
  },
  text: {
    marginTop: "10px",
    textAlign: "center"
  },
  link: {
    color: "#1e3a8a",
    textDecoration: "none",
    fontWeight: "bold"
  }
};

export default Register;