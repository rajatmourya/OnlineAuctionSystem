import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostAuction.css";
import auctionService from "../../services/auctionService";

function PostAuction() {
  const navigate = useNavigate();

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const role = loggedUser?.role || localStorage.getItem("role");

  /* 🔒 BLOCK BUYER FROM POSTING */
  useEffect(() => {
    if (!loggedUser || (role !== "seller" && role !== "admin")) {
      alert("Only sellers or admin can post auctions");
      navigate("/user-home");
    }
  }, [loggedUser, role, navigate]);

  const [auction, setAuction] = useState({
    name: "",
    category: "",
    startPrice: "",
    endDate: "",
    country: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* HANDLE INPUT */
  const handleChange = (e) => {
    setAuction({ ...auction, [e.target.name]: e.target.value });
  };

  /* HANDLE IMAGE */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAuction({ ...auction, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  /* SUBMIT AUCTION */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auction.name || !auction.category || !auction.startPrice || !auction.endDate) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const auctionData = {
        ...auction,
        sellerId: loggedUser.id || loggedUser.email, // Use ID if available, else email
        seller: loggedUser.email,
      };

      console.log('Submitting auction data:', auctionData);
      const result = await auctionService.createAuction(auctionData);
      console.log('Auction created successfully:', result);
      alert("Auction Posted Successfully!");
      navigate("/live-auctions");
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      const errorMessage = err?.error || err?.message || err?.details?.message || "Failed to post auction";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content center-page">
      <form className="form-box large-form" onSubmit={handleSubmit}>
        <h2 className="form-title">POST AUCTION</h2>

        <input
          type="text"
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
          <option>Others</option>
        </select>

        <input
          type="number"
          name="startPrice"
          placeholder="Starting Price"
          onChange={handleChange}
          required
        />

        {/* END DATE */}
        <div className="date-box">
          <label className="input-label">
            Auction End Date & Time
          </label>

          <input
            type="datetime-local"
            name="endDate"
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 16)}
            required
          />

          <small className="helper-text">
            Auction will automatically close at this date & time
          </small>
        </div>

        <input
          type="text"
          name="country"
          placeholder="Item Country"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Item Description"
          value={auction.description}
          onChange={handleChange}
        />

        {/* IMAGE */}
        <div className="file-box">
          <label>Upload Item Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "POSTING..." : "START AUCTION"}
        </button>
      </form>
    </div>
  );
}

export default PostAuction;
