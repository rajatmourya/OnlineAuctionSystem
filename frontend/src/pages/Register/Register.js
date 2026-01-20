import React from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // ✅ Alert after registration
    alert("Registration Success");

    // Optional: redirect to login page
    navigate("/login");
  };

  return (
    <div className="page-content center-page">
      <form className="form-box large-form" onSubmit={handleRegister}>
        <h2 className="form-title">New User Registration</h2>

        <input
          type="text"
          placeholder="Enter Your Name"
          required
        />

        <input
          type="email"
          placeholder="Enter Your Email"
          required
        />

        <input
          type="text"
          placeholder="Enter Your Mobile No"
          required
        />

        <input
          type="text"
          placeholder="Enter Your Address"
          required
        />

        <input
          type="password"
          placeholder="Password"
          required
        />

        <button type="submit" className="submit-btn">
          REGISTER
        </button>
      </form>
    </div>
  );
}

export default Register;
