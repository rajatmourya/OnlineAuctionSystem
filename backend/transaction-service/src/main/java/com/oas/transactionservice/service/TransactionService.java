package com.oas.transactionservice.service;

import com.oas.transactionservice.model.Transaction;

import java.util.List;

public interface TransactionService {

    Transaction createTransaction(Transaction transaction);

    Transaction getTransactionById(String id);

    List<Transaction> getTransactionsByBuyer(String buyerId);

    List<Transaction> getTransactionsBySeller(String sellerId);

    Transaction updatePaymentStatus(String id, String status);
}
