package com.oas.biddingservice.service.impl;

import com.oas.biddingservice.model.Bid;
import com.oas.biddingservice.repository.BidRepository;
import com.oas.biddingservice.service.BiddingService;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class BiddingServiceImpl implements BiddingService {

    private final BidRepository bidRepository;

    public BiddingServiceImpl(BidRepository bidRepository) {
        this.bidRepository = bidRepository;
    }

    @Override
    public Bid placeBid(Bid bid) {

        Bid highestBid = getHighestBid(bid.getAuctionId());

        if (highestBid != null && bid.getBidAmount() <= highestBid.getBidAmount()) {
            throw new RuntimeException("Bid must be higher than current highest bid");
        }

        bid.setBidTime(Instant.now());
        return bidRepository.save(bid);
    }

    @Override
    public Bid getHighestBid(String auctionId) {
        return bidRepository
                .findTopByAuctionIdOrderByBidAmountDesc(auctionId)
                .orElse(null);
    }

    @Override
    public List<Bid> getAllBidsForAuction(String auctionId) {
        return bidRepository.findByAuctionIdOrderByBidAmountDesc(auctionId);
    }
}
