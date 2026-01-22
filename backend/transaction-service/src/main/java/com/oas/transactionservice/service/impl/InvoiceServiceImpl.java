package com.oas.transactionservice.service.impl;

import com.oas.transactionservice.model.Invoice;
import com.oas.transactionservice.model.Transaction;
import com.oas.transactionservice.repository.InvoiceRepository;
import com.oas.transactionservice.service.InvoiceService;
import com.oas.transactionservice.service.PDFService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PDFService pdfService;

    @Autowired
    public InvoiceServiceImpl(InvoiceRepository invoiceRepository, PDFService pdfService) {
        this.invoiceRepository = invoiceRepository;
        this.pdfService = pdfService;
    }

    @Override
    public Invoice generateInvoice(Transaction transaction, String itemName, String category,
                                   String sellerName, String sellerEmail, String sellerMobile,
                                   String buyerName, String buyerEmail, String buyerMobile, String buyerAddress) {
        
        Invoice invoice = new Invoice();
        
        // Generate invoice number
        String invoiceNumber = "INV-" + Instant.now().toEpochMilli();
        invoice.setInvoiceNumber(invoiceNumber);
        
        invoice.setTransactionId(transaction.getId());
        invoice.setAuctionId(transaction.getAuctionId());
        invoice.setItemName(itemName != null ? itemName : "Auction Item");
        invoice.setCategory(category);
        
        invoice.setSellerId(transaction.getSellerId());
        invoice.setSellerName(sellerName);
        invoice.setSellerEmail(sellerEmail);
        invoice.setSellerMobile(sellerMobile);
        
        invoice.setBuyerId(transaction.getBuyerId());
        invoice.setBuyerName(buyerName);
        invoice.setBuyerEmail(buyerEmail);
        invoice.setBuyerMobile(buyerMobile);
        invoice.setBuyerAddress(buyerAddress);
        
        invoice.setItemPrice(transaction.getSellingPrice());
        invoice.setTax(0.0); // No tax for now
        invoice.setTotalAmount(transaction.getSellingPrice());
        invoice.setPaymentStatus(transaction.getPaymentStatus());
        
        invoice.setInvoiceDate(Instant.now());
        invoice.setCreatedAt(Instant.now());
        invoice.setEmailSent(false);
        invoice.setWhatsappSent(false);
        
        Invoice saved = invoiceRepository.save(invoice);
        System.out.println("Invoice generated: " + saved.getInvoiceNumber());
        
        return saved;
    }

    @Override
    public void sendInvoiceByEmail(Invoice invoice) {
        try {
            System.out.println("\n========== EMAIL NOTIFICATION ==========");
            System.out.println("🎉 AUCTION WINNER NOTIFICATION");
            System.out.println("=========================================");
            System.out.println("To: " + invoice.getBuyerEmail());
            System.out.println("Subject: Congratulations! You Won the Auction - Invoice " + invoice.getInvoiceNumber());
            System.out.println("\n--- Email Content ---");
            System.out.println("Dear " + invoice.getBuyerName() + ",");
            System.out.println("\nCongratulations! You are the winning bidder for the following auction:");
            System.out.println("\nItem: " + invoice.getItemName());
            System.out.println("Category: " + (invoice.getCategory() != null ? invoice.getCategory() : "N/A"));
            System.out.println("Invoice Number: " + invoice.getInvoiceNumber());
            System.out.println("Winning Bid Amount: ₹" + invoice.getTotalAmount());
            System.out.println("Payment Status: " + invoice.getPaymentStatus());
            System.out.println("\nSeller Details:");
            System.out.println("Name: " + invoice.getSellerName());
            System.out.println("Email: " + invoice.getSellerEmail());
            System.out.println("\nPlease complete your payment to receive the item.");
            System.out.println("You can view and download your invoice from your account.");
            System.out.println("\nThank you for using Online Auction System!");
            System.out.println("=========================================\n");
            
            // Mark as sent
            invoice.setEmailSent(true);
            invoiceRepository.save(invoice);
            
            // Generate PDF
            try {
                byte[] pdfBytes = pdfService.generateInvoicePDF(invoice);
                System.out.println("📄 PDF generated: " + pdfBytes.length + " bytes");
                System.out.println("📎 PDF attached to email (Invoice-" + invoice.getInvoiceNumber() + ".pdf)");
            } catch (Exception e) {
                System.err.println("⚠️ Error generating PDF: " + e.getMessage());
            }
            
            System.out.println("✅ Email notification logged successfully (Configure SMTP for actual email sending)");
        } catch (Exception e) {
            System.err.println("❌ Error sending invoice email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void sendInvoiceByWhatsApp(Invoice invoice) {
        try {
            System.out.println("\n========== WHATSAPP NOTIFICATION ==========");
            System.out.println("📱 Sending WhatsApp Message");
            System.out.println("============================================");
            System.out.println("To: " + invoice.getBuyerMobile());
            System.out.println("Recipient: " + invoice.getBuyerName());
            System.out.println("\n--- WhatsApp Message ---");
            
            String message = String.format(
                "🎉 *Congratulations! You Won the Auction!*\n\n" +
                "Dear %s,\n\n" +
                "You are the winning bidder!\n\n" +
                "*Auction Details:*\n" +
                "Item: %s\n" +
                "Category: %s\n" +
                "Invoice: %s\n" +
                "Winning Bid: ₹%.2f\n" +
                "Payment Status: %s\n\n" +
                "*Seller:*\n" +
                "Name: %s\n" +
                "Email: %s\n\n" +
                "Please complete your payment to receive the item.\n" +
                "View invoice in your account: Online Auction System\n\n" +
                "Thank you!",
                invoice.getBuyerName(),
                invoice.getItemName(),
                invoice.getCategory() != null ? invoice.getCategory() : "N/A",
                invoice.getInvoiceNumber(),
                invoice.getTotalAmount(),
                invoice.getPaymentStatus(),
                invoice.getSellerName(),
                invoice.getSellerEmail()
            );
            
            System.out.println(message);
            System.out.println("\n============================================");
            
            // Mark as sent
            invoice.setWhatsappSent(true);
            invoiceRepository.save(invoice);
            
            // Generate PDF
            try {
                byte[] pdfBytes = pdfService.generateInvoicePDF(invoice);
                System.out.println("📄 PDF generated: " + pdfBytes.length + " bytes");
                System.out.println("📎 PDF attached to WhatsApp (Invoice-" + invoice.getInvoiceNumber() + ".pdf)");
            } catch (Exception e) {
                System.err.println("⚠️ Error generating PDF: " + e.getMessage());
            }
            
            System.out.println("✅ WhatsApp notification logged successfully (Configure Twilio API for actual WhatsApp sending)");
        } catch (Exception e) {
            System.err.println("❌ Error sending invoice WhatsApp: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public byte[] generateInvoicePDF(Invoice invoice) {
        try {
            return pdfService.generateInvoicePDF(invoice);
        } catch (IOException e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
        }
    }
}
