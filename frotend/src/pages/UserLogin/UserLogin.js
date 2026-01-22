import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";
import userService from "../../services/userService";

function UserLogin() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      alert("Invalid Login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await userService.login(user.email, user.password);
      
      // Map backend role (BUYER, SELLER, ADMIN) to frontend role (buyer, seller, admin)
      const role = response.role?.toLowerCase() || "buyer";
      
      // Store user data with token
      localStorage.setItem(
        "loggedUser",
        JSON.stringify({
          id: response.id,
          email: response.email,
          role: role,
          token: response.token,
        })
      );
      localStorage.setItem("role", role); // legacy checks

      // Navigate based on role
      if (role === "admin") {
        alert("Admin Login Successful");
        navigate("/admin-home");
      } else if (role === "seller") {
        alert("Seller Login Successful");
        navigate("/post-auction");
      } else {
        alert("User Login Successful");
        navigate("/user-home");
      }
    } catch (err) {
      const errorMessage = err?.error || err?.message || "Invalid Email or Password";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page">
      <form className="form-box large-form" onSubmit={handleSubmit}>
        <h2 className="form-title">USER LOGIN</h2>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "LOGGING IN..." : "SUBMIT"}
        </button>
      </form>
    </div>
  );
}

export default UserLogin;
