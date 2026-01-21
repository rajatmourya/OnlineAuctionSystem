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
        return auctionService.createAuction(auction);
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
