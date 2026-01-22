import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Invoice.css";
import transactionService from "../../services/transactionService";
import auctionService from "../../services/auctionService";
import userService from "../../services/userService";

function Invoice() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const loggedUser = useMemo(
    () => JSON.parse(localStorage.getItem("loggedUser")),
    []
  );

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInvoice = useCallback(async () => {
    try {
      setLoading(true);
      const transaction = await transactionService.getTransactionById(orderId);

      // Enrich with auction and user details
      const auction = await auctionService.getAuctionById(transaction.auctionId);
      const buyer = await userService.getUserById(transaction.buyerId);
      const seller = await userService.getUserById(transaction.sellerId);

      setInvoice({
        ...transaction,
        auctionTitle: auction?.title || auction?.name || "Unknown Item",
        buyerName: buyer?.name || transaction.buyerId,
        buyerEmail: buyer?.email || transaction.buyerId,
        buyerAddress: buyer?.address || "",
        sellerName: seller?.name || transaction.sellerId,
        sellerEmail: seller?.email || transaction.sellerId,
        itemName: auction?.title || auction?.name || "Unknown Item",
        category: auction?.category,
      });
    } catch (err) {
      console.error("Error fetching invoice:", err);
      alert("Invoice not found");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  }, [orderId, navigate]);

  useEffect(() => {
    if (!loggedUser) {
      alert("Please login first");
      navigate("/user-login");
      return;
    }

    fetchInvoice();
  }, [loggedUser, navigate, fetchInvoice]);

  if (loading) {
    return (
      <div className="page-content center-page">
        <p>Loading invoice...</p>
      </div>
    );
  }

  if (!invoice) return null;

  const invoiceId = `INV-${invoice.id}`;
  const taxRate = 0.0;
  const tax = Math.round(invoice.sellingPrice * taxRate * 100) / 100;
  const total = Math.round((invoice.sellingPrice + tax) * 100) / 100;

  return (
    <div className="page-content center-page">
      <div className="invoice-wrap">
        <div className="invoice-top">
          <div>
            <h2 className="invoice-title">INVOICE</h2>
            <div className="muted">Invoice ID: {invoiceId}</div>
            <div className="muted">Transaction ID: {invoice.id}</div>
            <div className="muted">
              Date: {invoice.transactionDate 
                ? new Date(invoice.transactionDate).toLocaleString() 
                : new Date().toLocaleString()}
            </div>
          </div>

          <div className="invoice-actions no-print">
            <button className="small-btn" onClick={() => window.print()}>
              PRINT / SAVE PDF
            </button>
            <button 
              className="small-btn" 
              onClick={async () => {
                try {
                  // Download as PDF
                  const link = document.createElement('a');
                  link.href = window.location.href;
                  link.download = `invoice-${invoice.id}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.print(); // Also trigger print dialog
                } catch (err) {
                  console.error("Error downloading invoice:", err);
                  alert("Error downloading invoice");
                }
              }}
            >
              DOWNLOAD PDF
            </button>
            <button className="small-btn" onClick={() => navigate("/orders")}>
              BACK
            </button>
          </div>
        </div>

        <div className="invoice-grid">
          <div className="box">
            <div className="box-title">Bill To</div>
            <div>{invoice.buyerName}</div>
            <div className="muted">{invoice.buyerEmail}</div>
            <div className="muted">{invoice.buyerAddress || "Address not provided"}</div>
          </div>

          <div className="box">
            <div className="box-title">Seller</div>
            <div>{invoice.sellerName}</div>
            <div className="muted">{invoice.sellerEmail}</div>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{invoice.itemName}</td>
              <td>{invoice.category || "N/A"}</td>
              <td>1</td>
              <td>₹ {invoice.sellingPrice}</td>
              <td className="right">₹ {invoice.sellingPrice}</td>
            </tr>
          </tbody>
        </table>

        <div className="totals">
          <div className="row">
            <div className="muted">Subtotal</div>
            <div>₹ {invoice.sellingPrice}</div>
          </div>
          <div className="row">
            <div className="muted">Tax</div>
            <div>₹ {tax}</div>
          </div>
          <div className="row">
            <div className="muted">Payment Status</div>
            <div>
              <span className={`status ${invoice.paymentStatus?.toLowerCase()}`}>
                {invoice.paymentStatus || "PENDING"}
              </span>
            </div>
          </div>
          <div className="row total">
            <div>Total</div>
            <div>₹ {total}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoice;

