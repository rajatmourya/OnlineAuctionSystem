import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // ✅ SINGLE SOURCE OF TRUTH
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const role = loggedUser?.role;

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        ONLINE AUCTION SYSTEM
      </div>

      <div className="nav-links">
        {/* ================= GUEST ================= */}
        {!role && (
          <>
            <button onClick={() => navigate("/")}>HOME</button>
            <button onClick={() => navigate("/user-login")}>USER LOGIN</button>
            {/* <button onClick={() => navigate("/admin-login")}>ADMIN LOGIN</button> */}
            <button onClick={() => navigate("/register")}>REGISTER</button>
          </>
        )}

        {/* ================= BUYER ================= */}
        {role === "buyer" && (
          <>
            <button onClick={() => navigate("/user-home")}>HOME</button>
            <button onClick={() => navigate("/live-auctions")}>LIVE AUCTIONS</button>
            <button onClick={() => navigate("/my-bids")}>MY BIDS</button>
            <button onClick={() => navigate("/orders")}>ORDERS</button>
            <button onClick={() => navigate("/profile")}>PROFILE</button>
            <button className="logout-btn" onClick={logout}>
              LOGOUT
            </button>
          </>
        )}

        {/* ================= SELLER ================= */}
        {role === "seller" && (
          <>
            <button onClick={() => navigate("/post-auction")}>POST AUCTION</button>
            {/* <button onClick={() => navigate("/auction-status")}>MY AUCTIONS</button> */}
            <button onClick={() => navigate("/profile")}>PROFILE</button>
            <button className="logout-btn" onClick={logout}>
              LOGOUT
            </button>
          </>
        )}

        {/* ================= ADMIN ================= */}
        {role === "admin" && (
          <>
            <button onClick={() => navigate("/admin-home")}>ADMIN HOME</button>
            <button onClick={() => navigate("/register-seller")}>
              REGISTER SELLER
            </button>
            <button onClick={() => navigate("/post-auction")}>
              POST AUCTION
            </button>
            {/* <button onClick={() => navigate("/auction-status")}>
              AUCTION STATUS
            </button> */}
            <button onClick={() => navigate("/bidding-details")}>
              BIDDING DETAILS
            </button>
            <button onClick={() => navigate("/graph")}>GRAPH</button>
            <button onClick={() => navigate("/profile")}>PROFILE</button>
            <button className="logout-btn" onClick={logout}>
              LOGOUT
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
