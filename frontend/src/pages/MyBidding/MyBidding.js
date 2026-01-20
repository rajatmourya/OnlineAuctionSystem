import React, { useEffect, useState } from "react";
import "./MyBidding.css";

function MyBidding() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const storedBids = JSON.parse(localStorage.getItem("bids")) || [];
    setBids(storedBids);
  }, []);

  return (
    <div className="page-content">
      <div className="table-container">
        <h2 className="page-heading">MY BIDDING HISTORY</h2>

        {bids.length === 0 ? (
          <p className="no-data">No bidding history available</p>
        ) : (
          <table className="auction-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Starting Price</th>
                <th>Current Highest Bid</th>
                <th>End Date</th>
                <th>Item Country</th>
                <th>Status</th>
                <th>Result</th>
              </tr>
            </thead>

            <tbody>
              {bids.map((bid, index) => (
                <tr key={index}>
                  <td>{bid.name}</td>
                  <td>{bid.category}</td>
                  <td>{bid.startPrice}</td>
                  <td className="price">{bid.currentBid}</td>
                  <td>{bid.endDate}</td>
                  <td>{bid.country}</td>
                  <td>
                    <span className="status ongoing">{bid.status}</span>
                  </td>
                  <td className="applied">{bid.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MyBidding;
