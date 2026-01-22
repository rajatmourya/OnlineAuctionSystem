import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterSeller.css";
import userService from "../../services/userService";

function RegisterSeller() {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const role = loggedUser?.role || localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin") {
      alert("Access Denied: Admin access required");
      navigate("/");
    }
  }, [role, navigate]);

  const [seller, setSeller] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setSeller({ ...seller, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!seller.name || !seller.email || !seller.password) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Register seller with SELLER role using admin endpoint
      const sellerData = {
        ...seller,
        role: "SELLER", // Backend expects uppercase
      };

      await userService.createUserWithRole(sellerData);
      
      alert("Seller Registered Successfully");
      navigate("/admin-home");
    } catch (err) {
      const errorMessage = err?.error || err?.message || "Failed to register seller";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page">
      <form className="form-box large-form" onSubmit={handleSubmit}>
        <h2 className="form-title">REGISTER SELLER</h2>

        <input
          type="text"
          name="name"
          placeholder="Seller Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Seller Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={seller.password}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={seller.mobileNumber}
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={seller.address}
          onChange={handleChange}
        />

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "REGISTERING..." : "REGISTER SELLER"}
        </button>
      </form>
    </div>
  );
}

export default RegisterSeller;
