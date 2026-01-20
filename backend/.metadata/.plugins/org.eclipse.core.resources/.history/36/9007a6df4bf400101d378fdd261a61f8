package com.oas.auctionservice.repository;

import com.oas.auctionservice.model.Auction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface AuctionRepository extends MongoRepository<Auction, String> {

    List<Auction> findByStatus(String status);

    List<Auction> findByEndTimeBeforeAndStatus(Instant time, String status);
    
}
