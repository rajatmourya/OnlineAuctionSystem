package com.oas.transactionservice.repository;

import com.oas.transactionservice.model.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends MongoRepository<Invoice, String> {
    Optional<Invoice> findByTransactionId(String transactionId);
    List<Invoice> findByBuyerId(String buyerId);
    List<Invoice> findBySellerId(String sellerId);
}
