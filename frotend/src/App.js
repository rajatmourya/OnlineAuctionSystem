import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";

import Home from "./pages/Home/Home";
import UserLogin from "./pages/UserLogin/UserLogin";
// import AdminLogin from "./pages/AdminLogin/AdminLogin";
import Register from "./pages/Register/Register";
import RegisterSeller from "./pages/RegisterSeller/RegisterSeller";

import UserHome from "./pages/UserHome/UserHome";
import PostAuction from "./pages/PostAuction/PostAuction";
import AuctionStatus from "./pages/AuctionStatus/AuctionStatus";
import LiveAuctions from "./pages/LiveAuctions/LiveAuctions";
import MyBidding from "./pages/MyBidding/MyBidding";

import AdminHome from "./pages/AdminHome/AdminHome";
import UserDetails from "./pages/UserDetails/UserDetails";
import BiddingDetails from "./pages/BiddingDetails/BiddingDetails";
import Graph from "./pages/Graph/Graph";
import Profile from "./pages/Profile/Profile";
import Orders from "./pages/Orders/Orders";
import Invoice from "./pages/Invoice/Invoice";

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
          {/* <Route path="/admin-login" element={<AdminLogin />} /> */}
          <Route path="/register" element={<Register />} />

          {/* USER */}
          <Route path="/user-home" element={<UserHome />} />
          <Route path="/post-auction" element={<PostAuction />} />
          <Route path="/auction-status" element={<AuctionStatus />} />
          <Route path="/live-auctions" element={<LiveAuctions />} />
          <Route path="/my-bids" element={<MyBidding />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/invoice/:orderId" element={<Invoice />} />

          {/* ADMIN */}
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/user-details" element={<UserDetails />} />
          <Route path="/bidding-details" element={<BiddingDetails />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/register-seller" element={<RegisterSeller />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
