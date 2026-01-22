import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./Graph.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function Graph() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const auctions = JSON.parse(localStorage.getItem("auctions")) || [];

    const labels = auctions.map(a => a.name);
    const bidCounts = auctions.map(a => a.totalBids || 0);

    setChartData({
      labels,
      datasets: [
        {
          label: "Total Bids",
          data: bidCounts,
          backgroundColor: "rgba(88, 200, 200, 0.7)",
          borderRadius: 6,
        },
      ],
    });
  }, []);

  return (
    <div className="page-content">
      <div className="chart-box">
        <h2 className="page-heading">AUCTION BID GRAPH</h2>

        {chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                },
                tooltip: {
                  enabled: true,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
}

export default Graph;
