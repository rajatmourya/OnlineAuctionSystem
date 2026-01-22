package com.oas.auctionservice.service.impl;

import com.oas.auctionservice.model.Auction;
import com.oas.auctionservice.repository.AuctionRepository;
import com.oas.auctionservice.service.AuctionService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class AuctionServiceImpl implements AuctionService {

    private final AuctionRepository auctionRepository;

    public AuctionServiceImpl(AuctionRepository auctionRepository) {
        this.auctionRepository = auctionRepository;
    }

    @Override
    public Auction createAuction(Auction auction) {
        try {
            // Validate required fields
            if (auction.getTitle() == null || auction.getTitle().trim().isEmpty()) {
                throw new RuntimeException("Auction title is required");
            }
            if (auction.getSellerId() == null || auction.getSellerId().trim().isEmpty()) {
                throw new RuntimeException("Seller ID is required");
            }
            if (auction.getCategory() == null || auction.getCategory().trim().isEmpty()) {
                throw new RuntimeException("Category is required");
            }
            if (auction.getStartingPrice() <= 0) {
                throw new RuntimeException("Starting price must be greater than 0");
            }
            if (auction.getEndTime() == null) {
                throw new RuntimeException("End time is required");
            }
            if (auction.getEndTime().isBefore(Instant.now())) {
                throw new RuntimeException("End time must be in the future");
            }
            
            // Set default values if not provided
            if (auction.getStartTime() == null) {
                auction.setStartTime(Instant.now());
            }
            if (auction.getStatus() == null || auction.getStatus().trim().isEmpty()) {
                auction.setStatus("ACTIVE");
            }
            if (auction.getCondition() == null || auction.getCondition().trim().isEmpty()) {
                auction.setCondition("NEW");
            }
            if (auction.getQuantity() <= 0) {
                auction.setQuantity(1);
            }
            if (auction.getReservePrice() <= 0) {
                auction.setReservePrice(auction.getStartingPrice());
            }
            
            auction.setCreatedAt(Instant.now());
            
            System.out.println("Saving auction to database...");
            Auction saved = auctionRepository.save(auction);
            System.out.println("Auction saved successfully with ID: " + saved.getId());
            return saved;
        } catch (Exception e) {
            System.err.println("Error in createAuction service: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create auction: " + e.getMessage(), e);
        }
    }

    @Override
    public Auction getAuctionById(String auctionId) {
        return auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));
    }

    @Override
    public List<Auction> getAllAuctions() {
        return auctionRepository.findAll();
    }

    @Override
    public Auction updateAuction(String auctionId, Auction updatedAuction) {
        Auction existingAuction = getAuctionById(auctionId);

        // Security check: Only active auctions can be edited
        if (!"ACTIVE".equals(existingAuction.getStatus())) {
            throw new RuntimeException("Cannot update closed or cancelled auction");
        }

        // FIX: Only update mutable fields. Do not allow changing IDs or Status here.
        existingAuction.setTitle(updatedAuction.getTitle());
        existingAuction.setDescription(updatedAuction.getDescription());
        existingAuction.setCategory(updatedAuction.getCategory());
        existingAuction.setStartingPrice(updatedAuction.getStartingPrice());

        return auctionRepository.save(existingAuction);
    }

    @Override
    public void closeAuction(String auctionId) {
        Auction auction = getAuctionById(auctionId);
        auction.setStatus("CLOSED");
        auctionRepository.save(auction);
    }
}