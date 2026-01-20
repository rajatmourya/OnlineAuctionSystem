package com.oas.biddingservice.controller;

import com.oas.biddingservice.model.Bid;
import com.oas.biddingservice.service.BiddingService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
public class BiddingController {

    private final BiddingService biddingService;

    public BiddingController(BiddingService biddingService) {
        this.biddingService = biddingService;
    }

    @PostMapping
    public Bid placeBid(@RequestBody Bid bid) {
        return biddingService.placeBid(bid);
    }

    @GetMapping("/auction/{auctionId}")
    public List<Bid> getBidsForAuction(@PathVariable String auctionId) {
        return biddingService.getAllBidsForAuction(auctionId);
    }

    @GetMapping("/auction/{auctionId}/highest")
    public Bid getHighestBid(@PathVariable String auctionId) {
        return biddingService.getHighestBid(auctionId);
    }
}
