import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserHome.css";

function UserHome() {
  const navigate = useNavigate();

  return (
    <div className="center-page">
      <h1 className="page-title">USER DASHBOARD</h1>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <button className="submit-btn" onClick={() => navigate("/live-auctions")}>
          LIVE AUCTIONS
        </button>
        <button className="submit-btn" onClick={() => navigate("/my-bids")}>
          MY BIDS
        </button>
        <button className="submit-btn" onClick={() => navigate("/orders")}>
          ORDERS
        </button>
        <button className="submit-btn" onClick={() => navigate("/profile")}>
          PROFILE
        </button>
      </div>
    </div>
  );
}

export default UserHome;
