import React, { useEffect, useState } from "react";
import "./LiveAuctions.css";

function LiveAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({});

  useEffect(() => {
    const allAuctions = JSON.parse(localStorage.getItem("auctions")) || [];
    setAuctions(allAuctions.filter(a => a.status === "Ongoing"));
  }, []);

  const handleBidChange = (id, value) => {
    setBidAmounts({ ...bidAmounts, [id]: value });
  };

  const placeBid = (auction) => {
    const bidValue = Number(bidAmounts[auction.id]);

    if (!bidValue || bidValue <= auction.highestBid) {
      alert("Bid must be higher than current highest bid");
      return;
    }

    /* 🔥 UPDATE AUCTIONS (DO NOT FILTER!) */
    const allAuctions = JSON.parse(localStorage.getItem("auctions")) || [];

    const updatedAllAuctions = allAuctions.map(a =>
      a.id === auction.id
        ? {
            ...a,
            highestBid: bidValue,
            highestBidder: "currentUser",
            totalBids: a.totalBids + 1,
          }
        : a
    );

    localStorage.setItem("auctions", JSON.stringify(updatedAllAuctions));

    /* 🔥 SAVE BID HISTORY (ADMIN PAGE USES THIS) */
    const bids = JSON.parse(localStorage.getItem("bids")) || [];

    bids.push({
      auctionId: auction.id,
      itemName: auction.name,
      bidder: "currentUser",
      amount: bidValue,
      time: new Date().toLocaleString(),
    });

    localStorage.setItem("bids", JSON.stringify(bids));

    /* 🔥 UPDATE UI */
    setAuctions(updatedAllAuctions.filter(a => a.status === "Ongoing"));
    setBidAmounts({ ...bidAmounts, [auction.id]: "" });

    alert("Bidding Placed");
  };

  return (
    <div className="page-content">
      <div className="table-container">
        <h2 className="page-heading">LIVE AUCTIONS</h2>

        <table className="auction-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Starting Price</th>
              <th>Current Highest Bid</th>
              <th>Total Bids</th>
              <th>End Date</th>
              <th>Country</th>
              <th>Seller</th>
              <th>Bid</th>
            </tr>
          </thead>

          <tbody>
            {auctions.map(a => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.category}</td>
                <td>{a.startPrice}</td>
                <td className="price">{a.highestBid}</td>
                <td>{a.totalBids}</td>
                <td>{a.endDate}</td>
                <td>{a.country}</td>
                <td>{a.seller}</td>
                <td>
                  <input
                    type="number"
                    placeholder="Enter bid amount"
                    value={bidAmounts[a.id] || ""}
                    onChange={(e) =>
                      handleBidChange(a.id, e.target.value)
                    }
                  />
                  <button
                    className="bid-btn"
                    onClick={() => placeBid(a)}
                  >
                    PLACE BID
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default LiveAuctions;
