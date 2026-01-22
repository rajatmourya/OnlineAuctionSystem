import React, { useEffect, useState } from "react";
import "./AuctionStatus.css";

function AuctionStatus() {
  const [auctions, setAuctions] = useState([]);

  // 🔥 AUTO UPDATE STATUS EVERY 2 SECONDS
  useEffect(() => {
    const interval = setInterval(() => {
      const storedAuctions =
        JSON.parse(localStorage.getItem("auctions")) || [];

      const now = new Date();

      const updatedAuctions = storedAuctions.map(a => {
        if (a.status === "Ongoing" && new Date(a.endDate) <= now) {
          return { ...a, status: "Ended" };
        }
        return a;
      });

      localStorage.setItem("auctions", JSON.stringify(updatedAuctions));
      setAuctions(updatedAuctions);
    }, 2000); // 🔁 every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // 🔒 MANUAL CLOSE BY ADMIN
  const closeAuction = (id) => {
    const updated = auctions.map(a =>
      a.id === id ? { ...a, status: "Closed" } : a
    );

    setAuctions(updated);
    localStorage.setItem("auctions", JSON.stringify(updated));
    alert("Auction Closed Manually");
  };

  return (
    <div className="page-content">
      <div className="table-container">
        <h2 className="page-heading">AUCTION STATUS</h2>

        <table className="auction-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Starting Price</th>
              <th>Highest Bidder</th>
              <th>Highest Bid</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {auctions.map(a => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.startPrice}</td>
                <td>{a.highestBidder}</td>
                <td className="price">{a.highestBid}</td>
                <td>{a.endDate}</td>

                <td>
                  <span className={`status ${a.status.toLowerCase()}`}>
                    {a.status}
                  </span>
                </td>

                <td>
                  {a.status === "Ongoing" ? (
                    <button
                      className="close-btn"
                      onClick={() => closeAuction(a.id)}
                    >
                      CLOSE AUCTION
                    </button>
                  ) : (
                    "--"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuctionStatus;
