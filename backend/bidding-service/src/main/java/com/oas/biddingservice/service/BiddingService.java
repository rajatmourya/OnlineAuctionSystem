package com.oas.biddingservice.service;

import com.oas.biddingservice.model.Bid;

import java.util.List;

public interface BiddingService {

    Bid placeBid(Bid bid);

    Bid getHighestBid(String auctionId);

    List<Bid> getAllBidsForAuction(String auctionId);
}
