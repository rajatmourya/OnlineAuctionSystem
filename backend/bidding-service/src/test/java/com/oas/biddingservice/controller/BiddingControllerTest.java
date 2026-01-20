package com.oas.biddingservice.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class BiddingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void placeBidTest() throws Exception {

        String bidJson = """
                {
                  "auctionId": "AUCTION1",
                  "bidderId": "BUYER1",
                  "bidAmount": 45000
                }
                """;

        mockMvc.perform(post("/api/bids")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bidJson))
                .andExpect(status().isOk());
    }

    @Test
    void getHighestBidTest() throws Exception {

        mockMvc.perform(get("/api/bids/auction/AUCTION1/highest"))
                .andExpect(status().isOk());
    }
}
