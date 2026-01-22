import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";
import transactionService from "../../services/transactionService";
import auctionService from "../../services/auctionService";
import biddingService from "../../services/biddingService";
import userService from "../../services/userService";
import invoiceService from "../../services/invoiceService";

function Orders() {
  const navigate = useNavigate();
  const loggedUser = useMemo(
    () => JSON.parse(localStorage.getItem("loggedUser")),
    []
  );

  const getUserIdentifier = useCallback(() => {
    if (!loggedUser) return null;
    return loggedUser.id ?? loggedUser.userId ?? loggedUser.email ?? null;
  }, [loggedUser]);

  const getErrorMessage = useCallback((err) => {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err;
    if (err.error) return err.error;
    if (err.message) return err.message;
    try {
      return JSON.stringify(err);
    } catch {
      return "Unknown error";
    }
  }, []);

  const [transactions, setTransactions] = useState([]);
  const [completedBids, setCompletedBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingTransactions, setIsFetchingTransactions] = useState(false);
  const [isFetchingCompletedBids, setIsFetchingCompletedBids] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("orders"); // "orders" or "bids"

  const fetchTransactions = useCallback(async () => {
    if (!loggedUser) return;

    try {
      setIsFetchingTransactions(true);
      
      let allTransactions = [];
      
      // Admin can see all transactions, buyers see only their own
      if (loggedUser.role === "admin" || loggedUser.role === "ADMIN") {
        // Admin can see all transactions
        allTransactions = await transactionService.getAllTransactions();
      } else {
        // Fetch transactions for the logged-in buyer
        const buyerIdentifier = getUserIdentifier();
        if (!buyerIdentifier) {
          throw new Error("Missing user id/email. Please login again.");
        }

        try {
          allTransactions = await transactionService.getTransactionsByBuyer(buyerIdentifier);
        } catch (buyerErr) {
          // Some backends expect a different identifier; try email as fallback.
          if (loggedUser.email && buyerIdentifier !== loggedUser.email) {
            try {
              allTransactions = await transactionService.getTransactionsByBuyer(loggedUser.email);
            } catch {
              // ignore; we'll fall back to fetching all below
            }
          }

          // Last-resort fallback: try fetching all transactions and filtering client-side.
          // This helps when the backend doesn't expose /buyer/{id} but does expose /all.
          if (!allTransactions || allTransactions.length === 0) {
            const everyTxn = await transactionService.getAllTransactions();
            allTransactions = (everyTxn || []).filter(
              (t) =>
                t.buyerId === buyerIdentifier ||
                t.buyerId === loggedUser.email ||
                String(t.buyerId) === String(buyerIdentifier)
            );
          }
        }
      }

      // Enrich transactions with auction details
      const enrichedTransactions = await Promise.all(
        allTransactions.map(async (txn) => {
          try {
            const auction = await auctionService.getAuctionById(txn.auctionId);
            const seller = await userService.getUserById(txn.sellerId);
            
            return {
              ...txn,
              auctionTitle: auction?.title || auction?.name || "Unknown Item",
              sellerName: seller?.name || txn.sellerId,
              sellerEmail: seller?.email || txn.sellerId,
              itemName: auction?.title || auction?.name || "Unknown Item",
              category: auction?.category,
              image: auction?.images?.[0] || auction?.image,
            };
          } catch (err) {
            console.error("Error enriching transaction:", err);
            return {
              ...txn,
              auctionTitle: "Unknown Item",
              sellerName: txn.sellerId,
              sellerEmail: txn.sellerId,
              itemName: "Unknown Item",
            };
          }
        })
      );

      setTransactions(enrichedTransactions);
      setError("");
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(getErrorMessage(err) || "Failed to load orders");
    } finally {
      setIsFetchingTransactions(false);
    }
  }, [loggedUser, getUserIdentifier, getErrorMessage]);

  const fetchCompletedBids = useCallback(async () => {
    if (!loggedUser || loggedUser.role === "admin" || loggedUser.role === "ADMIN") {
      return; // Only for buyers
    }

    try {
      setIsFetchingCompletedBids(true);
      // Get all bids by this user
      const allBids = await biddingService.getBidsByBidder(
        getUserIdentifier() || loggedUser.email
      );

      // Get all auctions to check which are closed
      const allAuctions = await auctionService.getAllAuctions();
      const closedAuctions = allAuctions.filter(
        (a) =>
          a.status === "CLOSED" ||
          ((a.endTime || a.endDate) && new Date(a.endTime || a.endDate) < new Date())
      );

      // Get all transactions to find which bids won
      const userTransactions = await transactionService.getTransactionsByBuyer(
        getUserIdentifier() || loggedUser.email
      );

      // Enrich bids with auction and winner information
      const enrichedBids = await Promise.all(
        allBids.map(async (bid) => {
          const auction = allAuctions.find((a) => a.id === bid.auctionId);
          if (!auction) return null;

          const isClosed = closedAuctions.some((a) => a.id === auction.id);
          if (!isClosed) return null; // Only show completed auctions

          // Check if this bid won
          const transaction = userTransactions.find((t) => t.auctionId === auction.id);
          const userIdOrEmail = getUserIdentifier() || loggedUser.email;
          const isWinner =
            transaction &&
            (transaction.buyerId === userIdOrEmail ||
              String(transaction.buyerId) === String(userIdOrEmail));

          // Get highest bid to see if this bid was the winner
          let isWinningBid = false;
          try {
            const highestBid = await biddingService.getHighestBid(auction.id);
            isWinningBid = highestBid && highestBid.id === bid.id && isWinner;
          } catch (err) {
            console.log("Could not fetch highest bid:", err);
          }

          // Get seller details
          let sellerName = auction.sellerId || "N/A";
          try {
            const seller = await userService.getUserById(auction.sellerId);
            sellerName = seller?.name || seller?.email || sellerName;
          } catch (err) {
            console.log("Could not fetch seller:", err);
          }

          return {
            ...bid,
            auctionTitle: auction.title || auction.name || "Unknown Item",
            auctionCategory: auction.category,
            auctionImage: auction.images?.[0] || auction.image,
            sellerName: sellerName,
            sellerId: auction.sellerId,
            auctionStatus: auction.status,
            auctionEndTime: auction.endTime || auction.endDate,
            isWinner: isWinningBid,
            transaction: transaction,
            winningBidAmount: transaction?.sellingPrice || null,
          };
        })
      );

      // Filter out null values and sort by bid time (newest first)
      const validBids = enrichedBids
        .filter((bid) => bid !== null)
        .sort((a, b) => new Date(b.bidTime) - new Date(a.bidTime));

      setCompletedBids(validBids);
    } catch (err) {
      console.error("Error fetching completed bids:", err);
    } finally {
      setIsFetchingCompletedBids(false);
    }
  }, [loggedUser, getUserIdentifier]);

  useEffect(() => {
    if (!loggedUser) {
      alert("Please login first");
      navigate("/user-login");
      return;
    }
    // Allow both buyers and admins to view orders
    if (
      loggedUser.role !== "buyer" &&
      loggedUser.role !== "BUYER" &&
      loggedUser.role !== "admin" &&
      loggedUser.role !== "ADMIN"
    ) {
      alert("Orders are available for buyers and admins");
      navigate("/");
      return;
    }

    // First load: show full-page loading state
    setLoading(true);
    Promise.all([fetchTransactions(), fetchCompletedBids()]).finally(() => {
      setLoading(false);
    });

    const interval = setInterval(() => {
      fetchTransactions();
      fetchCompletedBids();
    }, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [loggedUser, navigate, fetchTransactions, fetchCompletedBids]);

  const goInvoice = useCallback(
    (transaction) => {
      navigate(`/invoice/${transaction.id}`);
    },
    [navigate]
  );

  const downloadInvoicePDF = useCallback(async (transaction) => {
    try {
      // First try to get invoice by transaction ID
      const invoice = await invoiceService.getInvoiceByTransaction(transaction.id);
      if (invoice && invoice.id) {
        await invoiceService.downloadInvoicePDF(invoice.id);
      } else {
        // Fallback: download by transaction ID
        await invoiceService.downloadInvoicePDFByTransaction(transaction.id);
      }
    } catch (err) {
      console.error("Error downloading invoice:", err);
      alert("Failed to download invoice. Please try again.");
    }
  }, []);

  const renderTransactionsTable = () => {
    if (transactions.length === 0) {
      return <p className="no-data">No orders yet. You haven't won any auctions.</p>;
    }

    return (
      <table className="auction-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Seller</th>
            <th>Amount</th>
            <th>Payment Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td>{txn.id}</td>
              <td>{txn.itemName || txn.auctionTitle}</td>
              <td>{txn.category || "N/A"}</td>
              <td>{txn.sellerName || txn.sellerEmail}</td>
              <td className="price">₹ {txn.sellingPrice}</td>
              <td>
                <span className={`status ${txn.paymentStatus?.toLowerCase()}`}>
                  {txn.paymentStatus || "PENDING"}
                </span>
              </td>
              <td>
                {txn.transactionDate
                  ? new Date(txn.transactionDate).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                <button
                  className="small-btn"
                  onClick={() => goInvoice(txn)}
                  style={{ marginRight: "5px" }}
                >
                  VIEW INVOICE
                </button>
                <button className="small-btn" onClick={() => downloadInvoicePDF(txn)}>
                  DOWNLOAD PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderCompletedBidsTable = () => {
    if (completedBids.length === 0) {
      return (
        <p className="no-data">
          No completed bids yet. Your bids will appear here once auctions close.
        </p>
      );
    }

    return (
      <table className="auction-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Seller</th>
            <th>Your Bid</th>
            <th>Winning Bid</th>
            <th>Status</th>
            <th>Bid Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {completedBids.map((bid) => (
            <tr key={bid.id}>
              <td>{bid.auctionTitle}</td>
              <td>{bid.auctionCategory || "N/A"}</td>
              <td>{bid.sellerName}</td>
              <td className="price">₹ {bid.bidAmount}</td>
              <td className="price">
                {bid.winningBidAmount ? `₹ ${bid.winningBidAmount}` : "N/A"}
              </td>
              <td>
                {bid.isWinner ? (
                  <span
                    className="status won"
                    style={{
                      backgroundColor: "#2ecc71",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    🏆 WON
                  </span>
                ) : (
                  <span
                    className="status lost"
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    Lost
                  </span>
                )}
              </td>
              <td>{bid.bidTime ? new Date(bid.bidTime).toLocaleString() : "N/A"}</td>
              <td>
                {bid.isWinner && bid.transaction ? (
                  <>
                    <button
                      className="small-btn"
                      onClick={() => goInvoice(bid.transaction)}
                      style={{ marginRight: "5px" }}
                    >
                      VIEW INVOICE
                    </button>
                    <button
                      className="small-btn"
                      onClick={() => downloadInvoicePDF(bid.transaction)}
                    >
                      DOWNLOAD PDF
                    </button>
                  </>
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    No invoice available
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="table-container">
          <h2 className="page-heading">MY ORDERS</h2>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="table-container">
        <h2 className="page-heading">
          {loggedUser.role === "admin" || loggedUser.role === "ADMIN" 
            ? "ALL ORDERS" 
            : "MY ORDER HISTORY"}
        </h2>

        {/* Tabs for Orders and Completed Bids */}
        {loggedUser.role !== "admin" && loggedUser.role !== "ADMIN" && (
          <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            <button
              className={activeTab === "orders" ? "submit-btn" : "small-btn"}
              onClick={() => setActiveTab("orders")}
              style={{ 
                backgroundColor: activeTab === "orders" ? "#2ecc71" : "#95a5a6",
                color: "white",
                border: "none",
                padding: "10px 20px",
                cursor: "pointer",
                borderRadius: "4px"
              }}
            >
              Won Auctions (Orders)
            </button>
            <button
              className={activeTab === "bids" ? "submit-btn" : "small-btn"}
              onClick={() => setActiveTab("bids")}
              style={{ 
                backgroundColor: activeTab === "bids" ? "#2ecc71" : "#95a5a6",
                color: "white",
                border: "none",
                padding: "10px 20px",
                cursor: "pointer",
                borderRadius: "4px"
              }}
            >
              All Completed Bids
            </button>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        {!loading && (isFetchingTransactions || isFetchingCompletedBids) && (
          <div className="inline-loading">
            <div className="spinner" />
            <div>
              Fetching latest data…
              {isFetchingTransactions && isFetchingCompletedBids
                ? " (orders + bids)"
                : isFetchingTransactions
                ? " (orders)"
                : " (bids)"}
            </div>
          </div>
        )}

        {activeTab === "orders" ? (
          // Orders/Won Auctions Tab
          <>
            {renderTransactionsTable()}

            {/* Show completed bids in Orders tab as well (buyers only) */}
            {loggedUser.role !== "admin" && loggedUser.role !== "ADMIN" && (
              <div style={{ marginTop: "30px" }}>
                <h3 style={{ marginBottom: "12px" }}>Completed Bids</h3>
                {renderCompletedBidsTable()}
              </div>
            )}
          </>
        ) : (
          // Completed Bids Tab
          renderCompletedBidsTable()
        )}
      </div>
    </div>
  );
}

export default Orders;

