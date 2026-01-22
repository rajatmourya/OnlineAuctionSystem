import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import auctionService from "../../services/auctionService";
import biddingService from "../../services/biddingService";
import userService from "../../services/userService";

function Home() {
  const navigate = useNavigate();
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  // ⏱️ CLOCK (for live countdown)
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 🔄 LOAD LIVE AUCTIONS FROM API (only if logged in)
  useEffect(() => {
    if (!loggedUser) {
      setLoading(false);
      return;
    }

    const fetchAuctions = async () => {
      try {
        const allAuctions = await auctionService.getAllAuctions();
        const now = new Date();

        // Filter active auctions
        const activeAuctions = allAuctions
          .map(a => {
            const endTime = a.endTime || a.endDate;
            if (a.status === "ACTIVE" && endTime && new Date(endTime) <= now) {
              return { ...a, status: "CLOSED" };
            }
            return a;
          })
          .filter(a => a.status === "ACTIVE" || a.status === "Ongoing");

        // Fetch highest bids for each auction
        const auctionsWithBids = await Promise.all(
          activeAuctions.map(async (auction) => {
            try {
              const highestBid = await biddingService.getHighestBid(auction.id);
              
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
                name: auction.title || auction.name,
                startPrice: auction.startingPrice,
                endDate: auction.endTime || auction.endDate,
                seller: sellerName,
                image: auction.images?.[0] || auction.image,
              };
            } catch (err) {
              // Fetch seller details even on error
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
                name: auction.title || auction.name,
                startPrice: auction.startingPrice,
                endDate: auction.endTime || auction.endDate,
                seller: sellerName,
                image: auction.images?.[0] || auction.image,
              };
            }
          })
        );

        setLiveAuctions(auctionsWithBids);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching auctions:", err);
        setLoading(false);
      }
    };

    fetchAuctions();
    const interval = setInterval(fetchAuctions, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [loggedUser]);

  // ⏱️ COUNTDOWN FORMAT
  const getTimeLeft = (endDate) => {
    const diff = new Date(endDate) - now;
    if (diff <= 0) return "Ended";

    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    return `${mins}m ${secs}s`;
  };

  return (
    <>
      {/* ================= HERO ================= */}
      <div className="hero">
        <div className="hero-overlay">
          <h1 className="hero-title">ONLINE AUCTION SYSTEM</h1>
          <p className="hero-subtitle">
            Bid Smart • Buy Fast • Sell Easy
          </p>

          <div className="hero-buttons">
            <button
              className="btn primary"
              onClick={() => navigate("/user-login")}
            >
              USER LOGIN
            </button>

            <button
              className="btn secondary"
              onClick={() => navigate("/register")}
            >
              REGISTER
            </button>
          </div>
        </div>
      </div>

      {/* ================= LIVE BIDS ================= */}
      {loggedUser && (
        <div className="live-section">
          <h2 className="live-title">🔥 Current Running Bids</h2>

          {loading ? (
            <p className="no-live">Loading auctions...</p>
          ) : liveAuctions.length === 0 ? (
            <p className="no-live">No live auctions available</p>
          ) : (
          <div className="live-scroll">
            {liveAuctions.map(item => {
              const timeLeft = getTimeLeft(item.endDate);
              const isEndingSoon =
                new Date(item.endDate) - now < 60000; // 1 min

              return (
                <div
                  key={item.id}
                  className={`live-card ${
                    isEndingSoon ? "ending-soon" : ""
                  }`}
                  onClick={() => navigate("/live-auctions")}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="live-img"
                    />
                  )}

                  <h3>{item.name}</h3>

                  <p className="price">₹ {item.highestBid}</p>

                  <p className="bidder">
                    Bidder:
                    <br />
                    <span>{item.highestBidder}</span>
                  </p>

                  <p className="countdown">
                    ⏳ {timeLeft}
                  </p>
                </div>
              );
            })}
          </div>
          )}
        </div>
      )}
    </>
  );
}

export default Home;
