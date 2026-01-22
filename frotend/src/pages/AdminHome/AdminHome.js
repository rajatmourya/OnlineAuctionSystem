import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";

function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="center-page">
      <div className="admin-dashboard">
        <h1 className="dashboard-title">ADMIN DASHBOARD</h1>

        <div className="admin-cards">
          <div className="admin-card" onClick={() => navigate("/register-seller")}>
            <h3>Register Seller</h3>
            <p>Create seller accounts</p>
          </div>

          <div className="admin-card" onClick={() => navigate("/user-details")}>
            <h3>User Details</h3>
            <p>View all users</p>
          </div>

          <div className="admin-card" onClick={() => navigate("/auction-status")}>
            <h3>Auction Status</h3>
            <p>Monitor auctions</p>
          </div>

          <div className="admin-card" onClick={() => navigate("/bidding-details")}>
            <h3>Bidding Details</h3>
            <p>View all bids</p>
          </div>

          <div className="admin-card" onClick={() => navigate("/graph")}>
            <h3>Statistics</h3>
            <p>Graphs & analytics</p>
          </div>

          <div className="admin-card" onClick={() => navigate("/live-auctions")}>
            <h3>Live Auctions</h3>
            <p>View all live auctions</p>
          </div>

          <div className="admin-card" onClick={() => navigate("/orders")}>
            <h3>Orders & Invoices</h3>
            <p>View all orders & invoices</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
