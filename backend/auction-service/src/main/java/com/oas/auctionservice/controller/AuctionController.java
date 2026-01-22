package com.oas.auctionservice.controller;

import com.oas.auctionservice.model.Auction;
import com.oas.auctionservice.service.AuctionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    private final AuctionService auctionService;

    public AuctionController(AuctionService auctionService) {
        this.auctionService = auctionService;
    }

    // CREATE AUCTION
    @PostMapping
    public Auction createAuction(@RequestBody Auction auction) {
        try {
            System.out.println("=== Received auction creation request ===");
            System.out.println("Title: " + auction.getTitle());
            System.out.println("SellerId: " + auction.getSellerId());
            System.out.println("Category: " + auction.getCategory());
            System.out.println("StartingPrice: " + auction.getStartingPrice());
            System.out.println("EndTime (raw): " + auction.getEndTime());
            System.out.println("StartTime (raw): " + auction.getStartTime());
            System.out.println("Description: " + auction.getDescription());
            System.out.println("Images: " + auction.getImages());
            System.out.println("Condition: " + auction.getCondition());
            System.out.println("Quantity: " + auction.getQuantity());
            
            // Validate that endTime was parsed correctly
            if (auction.getEndTime() == null) {
                System.err.println("ERROR: EndTime is null after JSON deserialization!");
                throw new RuntimeException("End time is required and must be in ISO-8601 format (e.g., 2026-01-22T01:34:00.000Z)");
            }
            
            Auction created = auctionService.createAuction(auction);
            System.out.println("=== Auction created successfully with ID: " + created.getId() + " ===");
            return created;
        } catch (RuntimeException e) {
            System.err.println("RuntimeException in createAuction: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw as-is since it's already a RuntimeException
        } catch (Exception e) {
            System.err.println("Unexpected error creating auction: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create auction: " + e.getMessage(), e);
        }
    }

    // GET AUCTION BY ID
    @GetMapping("/{id}")
    public Auction getAuction(@PathVariable String id) {
        return auctionService.getAuctionById(id);
    }

    // GET ALL AUCTIONS
    @GetMapping
    public List<Auction> getAllAuctions() {
        return auctionService.getAllAuctions();
    }

    // UPDATE AUCTION
    @PutMapping("/{id}")
    public Auction updateAuction(@PathVariable String id,
                                 @RequestBody Auction auction) {
        return auctionService.updateAuction(id, auction);
    }

    // CLOSE AUCTION
    @PostMapping("/{id}/close")
    public void closeAuction(@PathVariable String id) {
        auctionService.closeAuction(id);
    }
}
