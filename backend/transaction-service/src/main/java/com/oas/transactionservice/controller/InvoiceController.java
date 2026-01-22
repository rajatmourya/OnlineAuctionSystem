package com.oas.transactionservice.controller;

import com.oas.transactionservice.model.Invoice;
import com.oas.transactionservice.model.Transaction;
import com.oas.transactionservice.repository.InvoiceRepository;
import com.oas.transactionservice.service.InvoiceService;
import com.oas.transactionservice.service.TransactionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final InvoiceRepository invoiceRepository;
    private final TransactionService transactionService;

    public InvoiceController(
            InvoiceService invoiceService,
            InvoiceRepository invoiceRepository,
            TransactionService transactionService) {
        this.invoiceService = invoiceService;
        this.invoiceRepository = invoiceRepository;
        this.transactionService = transactionService;
    }

    @PostMapping("/generate")
    public Invoice generateInvoice(@RequestBody Map<String, Object> request) {
        String transactionId = (String) request.get("transactionId");
        Transaction transaction = transactionService.getTransactionById(transactionId);
        
        return invoiceService.generateInvoice(
            transaction,
            (String) request.get("itemName"),
            (String) request.get("category"),
            (String) request.get("sellerName"),
            (String) request.get("sellerEmail"),
            (String) request.get("sellerMobile"),
            (String) request.get("buyerName"),
            (String) request.get("buyerEmail"),
            (String) request.get("buyerMobile"),
            (String) request.get("buyerAddress")
        );
    }

    @PostMapping("/{invoiceId}/send-email")
    public ResponseEntity<Map<String, String>> sendInvoiceByEmail(@PathVariable String invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        
        invoiceService.sendInvoiceByEmail(invoice);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Invoice email sent successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{invoiceId}/send-whatsapp")
    public ResponseEntity<Map<String, String>> sendInvoiceByWhatsApp(@PathVariable String invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        
        invoiceService.sendInvoiceByWhatsApp(invoice);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Invoice WhatsApp message sent successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/transaction/{transactionId}")
    public Invoice getInvoiceByTransaction(@PathVariable String transactionId) {
        return invoiceRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    @GetMapping("/buyer/{buyerId}")
    public List<Invoice> getInvoicesByBuyer(@PathVariable String buyerId) {
        return invoiceRepository.findByBuyerId(buyerId);
    }

    @GetMapping("/seller/{sellerId}")
    public List<Invoice> getInvoicesBySeller(@PathVariable String sellerId) {
        return invoiceRepository.findBySellerId(sellerId);
    }

    @GetMapping("/{invoiceId}/download")
    public ResponseEntity<byte[]> downloadInvoicePDF(@PathVariable String invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        byte[] pdfBytes = invoiceService.generateInvoicePDF(invoice);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Invoice-" + invoice.getInvoiceNumber() + ".pdf");
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/transaction/{transactionId}/download")
    public ResponseEntity<byte[]> downloadInvoicePDFByTransaction(@PathVariable String transactionId) {
        Invoice invoice = invoiceRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        byte[] pdfBytes = invoiceService.generateInvoicePDF(invoice);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Invoice-" + invoice.getInvoiceNumber() + ".pdf");
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    private String generateInvoiceHTML(Invoice invoice) {
        return "<!DOCTYPE html><html><head><title>Invoice " + invoice.getInvoiceNumber() + "</title>" +
                "<style>body{font-family:Arial;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}</style></head><body>" +
                "<h1>INVOICE</h1>" +
                "<p><strong>Invoice Number:</strong> " + invoice.getInvoiceNumber() + "</p>" +
                "<p><strong>Date:</strong> " + invoice.getInvoiceDate() + "</p>" +
                "<h2>Bill To:</h2><p>" + invoice.getBuyerName() + "<br>" + invoice.getBuyerEmail() + "<br>" + invoice.getBuyerAddress() + "</p>" +
                "<h2>Seller:</h2><p>" + invoice.getSellerName() + "<br>" + invoice.getSellerEmail() + "</p>" +
                "<table><tr><th>Item</th><th>Price</th></tr>" +
                "<tr><td>" + invoice.getItemName() + "</td><td>₹" + invoice.getTotalAmount() + "</td></tr>" +
                "</table><p><strong>Total: ₹" + invoice.getTotalAmount() + "</strong></p>" +
                "<script>window.onload=function(){window.print();}</script></body></html>";
    }
}
