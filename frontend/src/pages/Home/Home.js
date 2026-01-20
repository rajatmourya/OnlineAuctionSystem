import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
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
  );
}

export default Home;
