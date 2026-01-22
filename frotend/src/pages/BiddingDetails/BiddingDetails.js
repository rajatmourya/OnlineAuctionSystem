import React, { useEffect, useState } from "react";
import "./BiddingDetails.css";

function BiddingDetails() {
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    setAuctions(JSON.parse(localStorage.getItem("auctions")) || []);
    setBids(JSON.parse(localStorage.getItem("bids")) || []);
  }, []);

  // 🔥 Get bids of a specific auction
  const getAuctionBids = (auctionId) =>
    bids.filter((b) => b.auctionId === auctionId);

  return (
    <div className="page-content">
      <div className="table-container">

        {/* ================= TOP BIDDERS ================= */}
        <h2 className="page-heading">Top Bidders for Each Auction</h2>

        <table className="auction-table">
          <thead>
            <tr>
              <th>Auction ID</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Starting Price</th>
              <th>Highest Bid</th>
              <th>Winning Bidder</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {auctions.map((auction) => (
              <tr key={auction.id}>
                <td>{auction.id}</td>
                <td>{auction.name}</td>
                <td>{auction.category}</td>
                <td>{auction.startPrice}</td>

                <td className="price">
                  {auction.highestBid || auction.startPrice}
                </td>

                <td>
                  {auction.highestBidder
                    ? auction.highestBidder
                    : "No Bids Yet"}
                </td>

                <td>
                  <span
                    className={`status-badge ${
                      auction.status === "Ongoing"
                        ? "ongoing"
                        : "closed"
                    }`}
                  >
                    {auction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ================= ALL BIDDERS ================= */}
        <h2 className="page-heading" style={{ marginTop: "40px" }}>
          All Bidders for Each Auction
        </h2>

        {auctions.map((auction) => {
          const auctionBids = getAuctionBids(auction.id);

          if (auctionBids.length === 0) return null;

          return (
            <div key={auction.id} className="bid-group">
              <h3>
                Bidding Details for {auction.name} (ID: {auction.id})
              </h3>

              <table className="auction-table">
                <thead>
                  <tr>
                    <th>Bidder Email</th>
                    <th>Bid Amount</th>
                    <th>Bid Time</th>
                  </tr>
                </thead>

                <tbody>
                  {auctionBids.map((bid, index) => (
                    <tr key={index}>
                      <td>{bid.bidder}</td>
                      <td className="price">{bid.amount}</td>
                      <td>{bid.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default BiddingDetails;
