package com.oas.auctionservice.service;

import com.oas.auctionservice.model.Auction;

public interface AuctionClosingService {
    void processClosedAuction(Auction auction);
}
