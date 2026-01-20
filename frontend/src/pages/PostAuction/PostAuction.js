import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostAuction.css";

function PostAuction() {
  const navigate = useNavigate();

  const [auction, setAuction] = useState({
    name: "",
    category: "",
    startPrice: "",
    endDate: "",
    country: "",
    description: "",
  });

  const handleChange = (e) => {
    setAuction({ ...auction, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existing = JSON.parse(localStorage.getItem("auctions")) || [];

    // 🔥 CREATE FULL AUCTION OBJECT
    const newAuction = {
      id: Date.now(),                    // unique id
      name: auction.name,
      category: auction.category,
      startPrice: Number(auction.startPrice),
      highestBid: Number(auction.startPrice),
      highestBidder: "No Bids Yet",
      totalBids: 0,
      endDate: auction.endDate,
      country: auction.country,
      description: auction.description,
      seller: "alice",                   // demo seller
      status: "Ongoing",                 // important
    };

    localStorage.setItem(
      "auctions",
      JSON.stringify([...existing, newAuction])
    );

    alert("Auction Posted Successfully!");
    navigate("/live-auctions");
  };

  return (
    <div className="page-content">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2 className="form-title">POST AUCTION</h2>

        <input
          name="name"
          placeholder="Item Name"
          onChange={handleChange}
          required
        />

        <select name="category" onChange={handleChange} required>
          <option value="">Select Category</option>
          <option>Electronics</option>
          <option>Furniture</option>
          <option>Clothing</option>
          <option>Jewelry</option>
        </select>

        <input
          name="startPrice"
          type="number"
          placeholder="Starting Price"
          onChange={handleChange}
          required
        />

        <input
          name="endDate"
          type="datetime-local"
          onChange={handleChange}
          required
        />

        <input
          name="country"
          placeholder="Item Country"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Item Description"
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn">
          START AUCTION
        </button>
      </form>
    </div>
  );
}

export default PostAuction;
