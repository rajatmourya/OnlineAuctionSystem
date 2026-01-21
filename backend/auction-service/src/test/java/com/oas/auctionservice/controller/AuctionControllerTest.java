package com.oas.auctionservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oas.auctionservice.model.Auction;
import com.oas.auctionservice.repository.AuctionRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuctionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        auctionRepository.deleteAll();
    }

 // ---------------- UPDATE AUCTION TEST ----------------
    @Test
    @WithMockUser(username = "seller@test.com", roles = {"SELLER"})
    void updateAuctionTest() throws Exception {

        // 1️⃣ Create OPEN auction (future endTime)
        Auction auction = new Auction();
        auction.setTitle("Old Title");
        auction.setDescription("Old description");
        auction.setStartingPrice(1000);
        auction.setEndTime(Instant.now().plusSeconds(3600)); 
        
        // FIX: Set the status to ACTIVE so the service allows the update
        auction.setStatus("ACTIVE"); 

        Auction savedAuction = auctionRepository.save(auction);

        // 2️⃣ Modify ONLY allowed fields
        savedAuction.setTitle("Updated Title");
        savedAuction.setDescription("Updated description");
        savedAuction.setStartingPrice(1500);

        // 3️⃣ Call UPDATE API
        mockMvc.perform(
                put("/api/auctions/" + savedAuction.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(savedAuction))
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.title").value("Updated Title"))
        .andExpect(jsonPath("$.startingPrice").value(1500));
    }
}
