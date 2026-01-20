package com.oas.transactionservice.service.impl;

import com.oas.transactionservice.model.Transaction;
import com.oas.transactionservice.repository.TransactionRepository;
import com.oas.transactionservice.service.TransactionService;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository repository;

    public TransactionServiceImpl(TransactionRepository repository) {
        this.repository = repository;
    }

    @Override
    public Transaction createTransaction(Transaction transaction) {
        transaction.setPaymentStatus("PENDING");
        transaction.setTransactionDate(Instant.now());
        return repository.save(transaction);
    }

    @Override
    public Transaction getTransactionById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    @Override
    public List<Transaction> getTransactionsByBuyer(String buyerId) {
        return repository.findByBuyerId(buyerId);
    }

    @Override
    public List<Transaction> getTransactionsBySeller(String sellerId) {
        return repository.findBySellerId(sellerId);
    }

    @Override
    public Transaction updatePaymentStatus(String id, String status) {
        Transaction txn = getTransactionById(id);
        txn.setPaymentStatus(status);
        return repository.save(txn);
    }
}
