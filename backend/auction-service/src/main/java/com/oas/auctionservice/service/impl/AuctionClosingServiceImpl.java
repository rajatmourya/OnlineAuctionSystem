package com.oas.auctionservice.service.impl;

import com.oas.auctionservice.model.Auction;
import com.oas.auctionservice.service.AuctionClosingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuctionClosingServiceImpl implements AuctionClosingService {

    private final RestTemplate restTemplate;

    @Autowired
    public AuctionClosingServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public void processClosedAuction(Auction auction) {
        try {
            System.out.println("=== Processing closed auction: " + auction.getId() + " ===");
            
            // Get highest bidder from bidding-service using service discovery
            // Using @LoadBalanced RestTemplate, we can use service names directly
            String highestBidUrl = "http://bidding-service/api/bids/auction/" + auction.getId() + "/highest";
            
            Map<String, Object> highestBidResponse;
            try {
                highestBidResponse = restTemplate.getForObject(highestBidUrl, Map.class);
            } catch (Exception e) {
                System.err.println("Error fetching highest bid: " + e.getMessage());
                return;
            }
            
            if (highestBidResponse == null || highestBidResponse.get("bidderId") == null) {
                System.out.println("No bids found for auction: " + auction.getId() + " - No transaction created");
                return;
            }

            String winnerId = (String) highestBidResponse.get("bidderId");
            Object bidAmountObj = highestBidResponse.get("bidAmount");
            Double winningPrice = bidAmountObj instanceof Number 
                ? ((Number) bidAmountObj).doubleValue() 
                : Double.parseDouble(bidAmountObj.toString());

            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            System.out.println("🏆 WINNER DETERMINED:");
            System.out.println("   Winner ID: " + winnerId);
            System.out.println("   Winning Bid Amount: ₹" + winningPrice);
            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            // Create transaction in transaction-service
            Map<String, Object> transaction = new HashMap<>();
            transaction.put("auctionId", auction.getId());
            transaction.put("itemId", auction.getItemId() != null ? auction.getItemId() : auction.getId());
            transaction.put("sellerId", auction.getSellerId());
            transaction.put("buyerId", winnerId);
            transaction.put("sellingPrice", winningPrice);
            transaction.put("paymentStatus", "PENDING");

            String createTransactionUrl = "http://transaction-service/api/transactions";
            try {
                Map<String, Object> createdTransaction = restTemplate.postForObject(
                    createTransactionUrl, 
                    transaction, 
                    Map.class
                );

                System.out.println("✅ Transaction created successfully!");
                System.out.println("   Transaction ID: " + createdTransaction.get("id"));
                System.out.println("   Auction ID: " + auction.getId());
                System.out.println("   Buyer: " + winnerId);
                System.out.println("   Seller: " + auction.getSellerId());
                System.out.println("   Amount: ₹" + winningPrice);
                
                // Get user details for invoice generation
                Map<String, Object> seller = null;
                Map<String, Object> buyer = null;
                
                try {
                    String userServiceUrl = "http://user-service/api/users";
                    seller = restTemplate.getForObject(userServiceUrl + "/" + auction.getSellerId(), Map.class);
                    buyer = restTemplate.getForObject(userServiceUrl + "/" + winnerId, Map.class);
                } catch (Exception e) {
                    System.err.println("Error fetching user details: " + e.getMessage());
                }
                
                // Generate invoice and send notifications
                Map<String, Object> invoiceRequest = new HashMap<>();
                invoiceRequest.put("transactionId", createdTransaction.get("id"));
                invoiceRequest.put("auctionId", auction.getId());
                invoiceRequest.put("itemName", auction.getTitle());
                invoiceRequest.put("category", auction.getCategory());
                
                if (seller != null) {
                    invoiceRequest.put("sellerName", seller.get("name"));
                    invoiceRequest.put("sellerEmail", seller.get("email"));
                    invoiceRequest.put("sellerMobile", seller.get("mobileNumber"));
                } else {
                    invoiceRequest.put("sellerName", auction.getSellerId());
                    invoiceRequest.put("sellerEmail", auction.getSellerId());
                    invoiceRequest.put("sellerMobile", "");
                }
                
                if (buyer != null) {
                    invoiceRequest.put("buyerName", buyer.get("name"));
                    invoiceRequest.put("buyerEmail", buyer.get("email"));
                    invoiceRequest.put("buyerMobile", buyer.get("mobileNumber"));
                    invoiceRequest.put("buyerAddress", buyer.get("address"));
                } else {
                    invoiceRequest.put("buyerName", winnerId);
                    invoiceRequest.put("buyerEmail", winnerId);
                    invoiceRequest.put("buyerMobile", "");
                    invoiceRequest.put("buyerAddress", "");
                }
                
                // Generate invoice
                String generateInvoiceUrl = "http://transaction-service/api/invoices/generate";
                try {
                    Map<String, Object> invoice = restTemplate.postForObject(
                        generateInvoiceUrl,
                        invoiceRequest,
                        Map.class
                    );
                    System.out.println("✅ Invoice generated successfully!");
                    System.out.println("   Invoice Number: " + invoice.get("invoiceNumber"));
                    System.out.println("   Invoice ID: " + invoice.get("id"));
                    
                    // Send notifications
                    String invoiceId = (String) invoice.get("id");
                    if (invoiceId != null) {
                        System.out.println("\n📧 Sending Email Notification...");
                        try {
                            restTemplate.postForObject(
                                "http://transaction-service/api/invoices/" + invoiceId + "/send-email",
                                null,
                                Void.class
                            );
                        } catch (Exception e) {
                            System.err.println("⚠️ Email notification error: " + e.getMessage());
                        }
                        
                        System.out.println("\n📱 Sending WhatsApp Notification...");
                        try {
                            restTemplate.postForObject(
                                "http://transaction-service/api/invoices/" + invoiceId + "/send-whatsapp",
                                null,
                                Void.class
                            );
                        } catch (Exception e) {
                            System.err.println("⚠️ WhatsApp notification error: " + e.getMessage());
                        }
                        
                        System.out.println("\n✅ All notifications processed successfully!");
                        System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                    }
                } catch (Exception e) {
                    System.err.println("Error generating invoice: " + e.getMessage());
                    e.printStackTrace();
                }
                
            } catch (Exception e) {
                System.err.println("Error creating transaction: " + e.getMessage());
                e.printStackTrace();
            }
            
        } catch (Exception e) {
            System.err.println("Error processing closed auction: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
