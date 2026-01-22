import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./MyBidding.css";
import biddingService from "../../services/biddingService";
import auctionService from "../../services/auctionService";
import transactionService from "../../services/transactionService";

function MyBidding() {
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const loggedUser = useMemo(
    () => JSON.parse(localStorage.getItem("loggedUser")),
    []
  );

  const getUserIdentifier = useCallback(() => {
    if (!loggedUser) return null;
    return loggedUser.id ?? loggedUser.userId ?? loggedUser.email ?? null;
  }, [loggedUser]);

  const fetchMyBids = useCallback(async (options = { showFullLoading: false }) => {
    if (!loggedUser) {
      setLoading(false);
      return;
    }

    try {
      if (options.showFullLoading) {
        setLoading(true);
      } else {
        setIsFetching(true);
      }

      // Get all auctions
      const allAuctions = await auctionService.getAllAuctions();
      const now = new Date();

      let userTransactions = [];
      try {
        const buyerIdentifier = getUserIdentifier();
        if (buyerIdentifier) {
          userTransactions = await transactionService.getTransactionsByBuyer(buyerIdentifier);
        }
      } catch (err) {
        console.log("Could not fetch transactions:", err);
      }

      // Get bids for each auction and filter by current user
      const userBidsData = [];

      for (const auction of allAuctions) {
        try {
          const bids = await biddingService.getBidsForAuction(auction.id);
          const userBids = bids.filter(
            (bid) => bid.bidderId === loggedUser.id || bid.bidderId === loggedUser.email
          );

          if (userBids.length > 0) {
            // Determine status
            const endTime = auction.endTime || auction.endDate;
            let status = auction.status;
            if (status === "ACTIVE" && endTime && new Date(endTime) <= now) {
              status = "CLOSED";
            }

            // Check if this user won by checking transactions (same logic as Orders.js)
            const userIdOrEmail = getUserIdentifier() || loggedUser.email;
            const transaction = userTransactions.find((t) => t.auctionId === auction.id);
            const isWinner =
              transaction &&
              (transaction.buyerId === userIdOrEmail ||
                String(transaction.buyerId) === String(userIdOrEmail));

            // Determine result
            let result = "Applied";
            if (status === "CLOSED" || status === "Ended") {
              result = isWinner ? "Won" : "Lost";
            }

            // Add each bid
            userBids.forEach((bid) => {
              userBidsData.push({
                auctionId: auction.id,
                itemName: auction.title || auction.name,
                category: auction.category,
                startPrice: auction.startingPrice || auction.startPrice,
                bidAmount: bid.bidAmount,
                endDate: auction.endTime || auction.endDate,
                country: auction.country || "",
                status: status === "ACTIVE" ? "Ongoing" : status,
                result,
                bidTime: bid.bidTime,
              });
            });
          }
        } catch (err) {
          // Skip auctions with errors
          console.error(`Error fetching bids for auction ${auction.id}:`, err);
        }
      }

      // Sort by bid time (most recent first)
      userBidsData.sort((a, b) => {
        const timeA = a.bidTime ? new Date(a.bidTime) : new Date(0);
        const timeB = b.bidTime ? new Date(b.bidTime) : new Date(0);
        return timeB - timeA;
      });

      setMyBids(userBidsData);
      setError("");
    } catch (err) {
      setError(err?.error || err?.message || "Failed to load bidding history");
    } finally {
      if (options.showFullLoading) {
        setLoading(false);
      }
      setIsFetching(false);
    }
  }, [loggedUser, getUserIdentifier]);

  useEffect(() => {
    if (!loggedUser) {
      setLoading(false);
      return;
    }

    // First load: show full-page loading
    fetchMyBids({ showFullLoading: true });

    // Background refresh (no full-screen loading)
    const interval = setInterval(() => fetchMyBids({ showFullLoading: false }), 5000);
    return () => clearInterval(interval);
  }, [loggedUser, fetchMyBids]);

  if (loading) {
    return (
      <div className="page-content">
        <div className="table-container">
          <h2 className="page-heading">MY BIDDING HISTORY</h2>
          <p>Loading bidding history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="table-container">
        <h2 className="page-heading">MY BIDDING HISTORY</h2>

        {error && <p className="error-message">{error}</p>}

        {!loading && isFetching && (
          <div className="inline-loading">
            <div className="spinner" />
            <div>Fetching latest bids…</div>
          </div>
        )}

        {myBids.length === 0 ? (
          <p className="no-data">No bidding history available</p>
        ) : (
          <table className="auction-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Starting Price</th>
                <th>My Bid</th>
                <th>End Date</th>
                <th>Country</th>
                <th>Status</th>
                <th>Result</th>
              </tr>
            </thead>

            <tbody>
              {myBids.map((bid, index) => (
                <tr key={index}>
                  <td>{bid.itemName}</td>
                  <td>{bid.category}</td>
                  <td>{bid.startPrice}</td>
                  <td className="price">{bid.bidAmount}</td>
                  <td>
                    {bid.endDate
                      ? new Date(bid.endDate).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>{bid.country}</td>

                  <td>
                    <span className={`status ${bid.status.toLowerCase()}`}>
                      {bid.status}
                    </span>
                  </td>

                  <td className={bid.result.toLowerCase()}>
                    {bid.result}
                  </td>
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
