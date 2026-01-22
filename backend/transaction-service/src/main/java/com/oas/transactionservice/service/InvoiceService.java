package com.oas.transactionservice.service;

import com.oas.transactionservice.model.Invoice;
import com.oas.transactionservice.model.Transaction;

public interface InvoiceService {
    Invoice generateInvoice(Transaction transaction, String itemName, String category,
                           String sellerName, String sellerEmail, String sellerMobile,
                           String buyerName, String buyerEmail, String buyerMobile, String buyerAddress);
    
    void sendInvoiceByEmail(Invoice invoice);
    void sendInvoiceByWhatsApp(Invoice invoice);
    byte[] generateInvoicePDF(Invoice invoice);
}
