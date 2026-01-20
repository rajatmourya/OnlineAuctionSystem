package com.oas.transactionservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createAndGetTransactionByIdTest() throws Exception {

        // 1️⃣ Create transaction
        String transactionJson = """
                {
                  "itemId": "ITEM1",
                  "auctionId": "AUC1",
                  "sellerId": "SELLER1",
                  "buyerId": "BUYER1",
                  "sellingPrice": 58000
                }
                """;

        MvcResult result = mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transactionJson))
                .andExpect(status().isOk())
                .andReturn();

        // 2️⃣ Extract transactionId from response
        String response = result.getResponse().getContentAsString();
        String transactionId =
                objectMapper.readTree(response).get("id").asText();

        // 3️⃣ Get transaction by ID (NOW IT EXISTS)
        mockMvc.perform(get("/api/transactions/" + transactionId))
                .andExpect(status().isOk());
    }

    @Test
    void getTransactionsByBuyerTest() throws Exception {
        mockMvc.perform(get("/api/transactions/buyer/BUYER1"))
                .andExpect(status().isOk());
    }

    @Test
    void getTransactionsBySellerTest() throws Exception {
        mockMvc.perform(get("/api/transactions/seller/SELLER1"))
                .andExpect(status().isOk());
    }
}
