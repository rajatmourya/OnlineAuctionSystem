import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ name: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (admin.name === "admin" && admin.password === "admin123") {
      localStorage.setItem("role", "admin");
      navigate("/admin-home");
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div className="center-page">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2 className="form-title">ADMIN LOGIN</h2>

        <input
          type="text"
          placeholder="Email"
          onChange={(e) =>
            setAdmin({ ...admin, name: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setAdmin({ ...admin, password: e.target.value })
          }
          required
        />

        <button type="submit" className="submit-btn">
          SUBMIT
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
