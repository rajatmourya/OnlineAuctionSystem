import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="logo">ONLINE AUCTION SYSTEM</div>

      <div className="nav-links">
        {!role && (
          <>
            <button onClick={() => navigate("/")}>HOME</button>
            <button onClick={() => navigate("/admin-login")}>ADMIN</button>
            <button onClick={() => navigate("/user-login")}>USER</button>
            <button onClick={() => navigate("/register")}>REGISTER</button>
          </>
        )}

        {role === "user" && (
          <>
            <button onClick={() => navigate("/user-home")}>HOME</button>
            <button onClick={() => navigate("/post-auction")}>POST</button>
            <button onClick={() => navigate("/live-auctions")}>LIVE</button>
            <button onClick={() => navigate("/my-bids")}>MY BIDS</button>
            <button className="logout-btn" onClick={logout}>LOGOUT</button>
          </>
        )}

        {role === "admin" && (
          <>
            <button onClick={() => navigate("/admin-home")}>HOME</button>
            <button onClick={() => navigate("/user-details")}>USERS</button>
            <button onClick={() => navigate("/bidding-details")}>BIDS</button>
            <button onClick={() => navigate("/graph")}>GRAPH</button>
            <button className="logout-btn" onClick={logout}>LOGOUT</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
