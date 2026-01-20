import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";

function UserLogin() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user.email && user.password) {
      localStorage.setItem("role", "user");
      alert("User Login Successful");
      navigate("/user-home");
    } else {
      alert("Invalid Login");
    }
  };

  return (
    <div className="center-page">
      <form className="form-box large-form" onSubmit={handleSubmit}>
        <h2 className="form-title">USER LOGIN</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">
          SUBMIT
        </button>
      </form>
    </div>
  );
}

export default UserLogin;
