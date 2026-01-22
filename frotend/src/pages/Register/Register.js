import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import userService from "../../services/userService";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await userService.register({
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        address: form.address,
        password: form.password,
      });

      alert("Registration Success");
      navigate("/user-login");
    } catch (err) {
      const errorMessage = err?.error || err?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content center-page">
      <form className="form-box large-form" onSubmit={handleRegister}>
        <h2 className="form-title">New User Registration</h2>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <input
          type="text"
          name="name"
          placeholder="Enter Your Name"
          value={form.name}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Your Email"
          value={form.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <input
          type="text"
          name="mobile"
          placeholder="Enter Your Mobile No"
          value={form.mobile}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <input
          type="text"
          name="address"
          placeholder="Enter Your Address"
          value={form.address}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "REGISTERING..." : "REGISTER"}
        </button>
      </form>
    </div>
  );
}

export default Register;
