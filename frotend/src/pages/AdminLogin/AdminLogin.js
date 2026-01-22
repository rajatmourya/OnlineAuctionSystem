import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import userService from "../../services/userService";

function AdminLogin() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admin.email || !admin.password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await userService.login(admin.email, admin.password);
      
      // Check if user is admin
      if (response.role?.toUpperCase() !== "ADMIN") {
        alert("Access Denied: Admin credentials required");
        return;
      }

      const role = response.role?.toLowerCase() || "admin";
      
      // Store user data with token
      localStorage.setItem(
        "loggedUser",
        JSON.stringify({
          id: response.id,
          email: response.email,
          name: response.name,
          role: role,
          token: response.token,
        })
      );
      localStorage.setItem("role", role);

      alert("Admin Login Successful");
      navigate("/admin-home");
    } catch (err) {
      const errorMessage = err?.error || err?.message || "Invalid Admin Credentials";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2 className="form-title">ADMIN LOGIN</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={admin.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={admin.password}
          onChange={handleChange}
          required
        />

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "LOGGING IN..." : "SUBMIT"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
