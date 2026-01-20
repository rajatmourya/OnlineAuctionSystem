import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";

import Home from "./pages/Home/Home";
import UserLogin from "./pages/UserLogin/UserLogin";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import Register from "./pages/Register/Register";

import UserHome from "./pages/UserHome/UserHome";
import PostAuction from "./pages/PostAuction/PostAuction";
import AuctionStatus from "./pages/AuctionStatus/AuctionStatus";
import LiveAuctions from "./pages/LiveAuctions/LiveAuctions";
import MyBidding from "./pages/MyBidding/MyBidding";

import AdminHome from "./pages/AdminHome/AdminHome";
import UserDetails from "./pages/UserDetails/UserDetails";
import BiddingDetails from "./pages/BiddingDetails/BiddingDetails";
import Graph from "./pages/Graph/Graph";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-background">
        <Navbar />

        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />

          {/* USER */}
          <Route path="/user-home" element={<UserHome />} />
          <Route path="/post-auction" element={<PostAuction />} />
          <Route path="/auction-status" element={<AuctionStatus />} />
          <Route path="/live-auctions" element={<LiveAuctions />} />
          <Route path="/my-bids" element={<MyBidding />} />

          {/* ADMIN */}
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/user-details" element={<UserDetails />} />
          <Route path="/bidding-details" element={<BiddingDetails />} />
          <Route path="/graph" element={<Graph />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
