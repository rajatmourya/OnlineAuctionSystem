package com.oas.auctionservice.scheduler;

import com.oas.auctionservice.model.Auction;
import com.oas.auctionservice.repository.AuctionRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class AuctionClosingScheduler {

    private final AuctionRepository auctionRepository;

    public AuctionClosingScheduler(AuctionRepository auctionRepository) {
        this.auctionRepository = auctionRepository;
    }

    // Runs every 1 minute
    @Scheduled(fixedRate = 60000)
    public void closeExpiredAuctions() {

        List<Auction> expiredAuctions =
                auctionRepository.findByEndTimeBeforeAndStatus(
                        Instant.now(), "ACTIVE");

        for (Auction auction : expiredAuctions) {
            auction.setStatus("CLOSED");
            auctionRepository.save(auction);
        }
    }
}
