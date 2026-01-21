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
        auction.setStatus("ACTIVE"); // Ensure consistent starting state
        auction.setCreatedAt(Instant.now());
        return auctionRepository.save(auction);
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