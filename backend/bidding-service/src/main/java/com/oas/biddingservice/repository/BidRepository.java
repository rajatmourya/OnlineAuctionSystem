package com.oas.biddingservice.repository;

import com.oas.biddingservice.model.Bid;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BidRepository extends MongoRepository<Bid, String> {

    List<Bid> findByAuctionIdOrderByBidAmountDesc(String auctionId);

    Optional<Bid> findTopByAuctionIdOrderByBidAmountDesc(String auctionId);
}
