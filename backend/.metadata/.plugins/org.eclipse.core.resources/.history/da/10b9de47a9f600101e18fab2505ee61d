package com.oas.auctionservice.controller;

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
public class AuctionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createAuctionTest() throws Exception {

        String auctionJson = """
                {
                  "itemId": "ITEM1",
                  "sellerId": "SELLER1",
                  "title": "Laptop",
                  "description": "Dell i5",
                  "category": "electronics",
                  "startingPrice": 30000,
                  "reservePrice": 35000,
                  "endTime": "2026-01-20T10:00:00Z",
                  "condition": "NEW",
                  "quantity": 1
                }
                """;

        mockMvc.perform(post("/api/auctions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(auctionJson))
                .andExpect(status().isOk());
    }

    @Test
    void getAllAuctionsTest() throws Exception {

        mockMvc.perform(get("/api/auctions"))
                .andExpect(status().isOk());
    }
}
