import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LiveAuctions.css";
import auctionService from "../../services/auctionService";
import biddingService from "../../services/biddingService";
import userService from "../../services/userService";

function LiveAuctions() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  // 🔁 FETCH AUCTIONS FROM API
  useEffect(() => {
    fetchAuctions();
    const interval = setInterval(fetchAuctions, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAuctions = async () => {
    try {
      const allAuctions = await auctionService.getAllAuctions();
      const now = new Date();

      // Filter and update status
      const activeAuctions = allAuctions
        .map(a => {
          const endTime = a.endTime || a.endDate;
          if (a.status === "ACTIVE" && endTime && new Date(endTime) <= now) {
            return { ...a, status: "CLOSED" };
          }
          return a;
        })
        .filter(a => a.status === "ACTIVE" || a.status === "Ongoing");

      // Fetch highest bids and top 5 bids for each auction
      const auctionsWithBids = await Promise.all(
        activeAuctions.map(async (auction) => {
          try {
            const highestBid = await biddingService.getHighestBid(auction.id);
            // Get top 5 highest bids using the new endpoint
            const top5Bids = await biddingService.getTopBids(auction.id, 5);
            const allBids = await biddingService.getBidsForAuction(auction.id);
            
            // Fetch seller details
            let sellerName = auction.sellerId || auction.seller || "N/A";
            try {
              const seller = await userService.getUserById(auction.sellerId || auction.seller);
              sellerName = seller?.name || seller?.email || sellerName;
            } catch (err) {
              console.log("Could not fetch seller details:", err);
            }
            
            return {
              ...auction,
              highestBid: highestBid?.bidAmount || auction.startingPrice,
              highestBidder: highestBid?.bidderId || "No Bids Yet",
              totalBids: allBids?.length || 0,
              top5Bids: top5Bids || [],
              // Map backend fields to frontend fields
              name: auction.title || auction.name,
              startPrice: auction.startingPrice,
              endDate: auction.endTime || auction.endDate,
              seller: sellerName,
              sellerId: auction.sellerId || auction.seller,
              image: auction.images?.[0] || auction.image,
            };
          } catch (err) {
            // If no bids exist, use starting price
            let sellerName = auction.sellerId || auction.seller || "N/A";
            try {
              const seller = await userService.getUserById(auction.sellerId || auction.seller);
              sellerName = seller?.name || seller?.email || sellerName;
            } catch (e) {
              // Keep default sellerName
            }
            
            return {
              ...auction,
              highestBid: auction.startingPrice,
              highestBidder: "No Bids Yet",
              totalBids: 0,
              top5Bids: [],
              name: auction.title || auction.name,
              startPrice: auction.startingPrice,
              endDate: auction.endTime || auction.endDate,
              seller: sellerName,
              sellerId: auction.sellerId || auction.seller,
              image: auction.images?.[0] || auction.image,
            };
          }
        })
      );

      setAuctions(auctionsWithBids);
      setLoading(false);
    } catch (err) {
      setError(err?.error || err?.message || "Failed to load auctions");
      setLoading(false);
    }
  };

  const handleBidChange = (id, value) => {
    setBidAmounts({ ...bidAmounts, [id]: value });
  };

  const placeBid = async (auction) => {
    if (!loggedUser) {
      alert("Please login first to place a bid");
      navigate("/user-login");
      return;
    }

    // ❌ SELLER CANNOT BID ON OWN AUCTION
    const sellerId = auction.sellerId || auction.seller;
    if (sellerId === loggedUser.id || sellerId === loggedUser.email) {
      alert("You cannot bid on your own auction");
      return;
    }

    // ❌ ONLY BUYERS CAN BID
    if (loggedUser.role !== "buyer" && loggedUser.role !== "BUYER") {
      alert("Only buyers can place bids");
      return;
    }

    const bidValue = Number(bidAmounts[auction.id]);

    if (!bidValue || bidValue <= auction.highestBid) {
      alert("Bid must be higher than current highest bid");
      return;
    }

    try {
      const bidData = {
        auctionId: auction.id,
        bidderId: loggedUser.id || loggedUser.email,
        bidAmount: bidValue,
      };

      await biddingService.placeBid(bidData);
      setBidAmounts({ ...bidAmounts, [auction.id]: "" });
      alert("Bidding Placed Successfully");
      // Refresh auctions to show updated bid
      fetchAuctions();
    } catch (err) {
      const errorMessage = err?.error || err?.message || "Failed to place bid";
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="table-container">
          <h2 className="page-heading">LIVE AUCTIONS</h2>
          <p>Loading auctions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="table-container">
          <h2 className="page-heading">LIVE AUCTIONS</h2>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="table-container">
        <h2 className="page-heading">LIVE AUCTIONS</h2>

        {auctions.length === 0 ? (
          <p className="no-data">No live auctions available</p>
        ) : (
          <table className="auction-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Image</th>
              <th>Starting Price</th>
              <th>Current Highest Bid</th>
              <th>Total Bids</th>
              <th>Top 5 Bids</th>
              <th>End Date</th>
              <th>Seller</th>
              <th>Bid</th>
            </tr>
          </thead>

          <tbody>
            {auctions.map(a => {
              const isSeller = loggedUser && (loggedUser.email === a.seller || loggedUser.id === a.seller);
              const isBuyer = loggedUser && (loggedUser.role === "buyer" || loggedUser.role === "BUYER");
              const isAdmin = loggedUser && (loggedUser.role === "admin" || loggedUser.role === "ADMIN");

              return (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>{a.category}</td>

                  <td>
                    {a.image ? (
                      <img
                        src={a.image}
                        alt={a.name}
                        className="auction-img"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td>{a.startPrice}</td>
                  <td className="price">{a.highestBid}</td>
                  <td>{a.totalBids}</td>
                  <td>
                    {a.top5Bids && a.top5Bids.length > 0 ? (
                      <div className="top-bids-list">
                        {a.top5Bids.map((bid, idx) => (
                          <div key={idx} className="bid-item">
                            <span className="bid-rank">#{idx + 1}</span>
                            <span className="bid-amount">₹{bid.bidAmount}</span>
                            <span className="bidder-name">{bid.bidderId}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      "No bids yet"
                    )}
                  </td>
                  <td>{a.endDate ? new Date(a.endDate).toLocaleString() : 'N/A'}</td>
                  <td>{a.seller || 'N/A'}</td>

                  <td>
                    {!loggedUser ? (
                      <button
                        className="bid-btn"
                        onClick={() => {
                          alert("Please login first to place a bid");
                          navigate("/user-login");
                        }}
                      >
                        LOGIN TO BID
                      </button>
                    ) : isSeller ? (
                      <span className="disabled-text">
                        Cannot bid on own item
                      </span>
                    ) : !isBuyer && !isAdmin ? (
                      <span className="disabled-text">
                        Buyers only
                      </span>
                    ) : (
                      <>
                        <input
                          type="number"
                          placeholder="Enter bid"
                          min={a.highestBid + 1}
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
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}

export default LiveAuctions;
