package com.oas.transactionservice.controller;

import com.oas.transactionservice.model.Transaction;
import com.oas.transactionservice.service.TransactionService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return service.createTransaction(transaction);
    }

    @GetMapping("/{id}")
    public Transaction getTransaction(@PathVariable String id) {
        return service.getTransactionById(id);
    }

    @GetMapping("/buyer/{buyerId}")
    public List<Transaction> getByBuyer(@PathVariable String buyerId) {
        return service.getTransactionsByBuyer(buyerId);
    }

    @GetMapping("/seller/{sellerId}")
    public List<Transaction> getBySeller(@PathVariable String sellerId) {
        return service.getTransactionsBySeller(sellerId);
    }

    @PutMapping("/{id}/status")
    public Transaction updateStatus(@PathVariable String id,
                                    @RequestParam String status) {
        return service.updatePaymentStatus(id, status);
    }
}
