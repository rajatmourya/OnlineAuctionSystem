package com.oas.auctionservice.scheduler;

import com.oas.auctionservice.model.Auction;
import com.oas.auctionservice.repository.AuctionRepository;
import com.oas.auctionservice.service.AuctionClosingService;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class AuctionClosingScheduler {

    private final AuctionRepository auctionRepository;
    private final AuctionClosingService auctionClosingService;

    public AuctionClosingScheduler(
            AuctionRepository auctionRepository,
            AuctionClosingService auctionClosingService) {
        this.auctionRepository = auctionRepository;
        this.auctionClosingService = auctionClosingService;
    }

    // Runs every 1 minute - Automatically closes expired auctions
    @Scheduled(fixedRate = 60000)
    public void closeExpiredAuctions() {
        System.out.println("\n╔════════════════════════════════════════════════════════════╗");
        System.out.println("║     AUCTION CLOSING SCHEDULER - CHECKING EXPIRED AUCTIONS   ║");
        System.out.println("╚════════════════════════════════════════════════════════════╝");
        
        List<Auction> expiredAuctions =
                auctionRepository.findByEndTimeBeforeAndStatus(
                        Instant.now(), "ACTIVE");

        if (expiredAuctions.isEmpty()) {
            System.out.println(" No expired auctions found. All auctions are active.\n");
            return;
        }

        System.out.println("🔔 Found " + expiredAuctions.size() + " expired auction(s)");
        System.out.println("Current Time: " + Instant.now() + "\n");

        for (Auction auction : expiredAuctions) {
            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            System.out.println("🔴 Closing Auction:");
            System.out.println("   ID: " + auction.getId());
            System.out.println("   Title: " + auction.getTitle());
            System.out.println("   End Time: " + auction.getEndTime());
            System.out.println("   Seller: " + auction.getSellerId());
            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            
            auction.setStatus("CLOSED");
            auctionRepository.save(auction);
            System.out.println(" Auction status changed to CLOSED");
            
            // Process the closed auction: determine winner and create transaction
            auctionClosingService.processClosedAuction(auction);
            System.out.println("");
        }
        
        System.out.println(" Auction closing scheduler completed.\n");
    }
}
