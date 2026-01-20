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

    @PostMapping
    public Auction createAuction(@RequestBody Auction auction) {
        return auctionService.createAuction(auction);
    }

    @GetMapping("/{id}")
    public Auction getAuction(@PathVariable String id) {
        return auctionService.getAuctionById(id);
    }

    @GetMapping
    public List<Auction> getAllAuctions() {
        return auctionService.getAllAuctions();
    }

    @PutMapping("/{id}")
    public Auction updateAuction(@PathVariable String id,
                                 @RequestBody Auction auction) {
        return auctionService.updateAuction(id, auction);
    }

    @PostMapping("/{id}/close")
    public void closeAuction(@PathVariable String id) {
        auctionService.closeAuction(id);
    }
}
