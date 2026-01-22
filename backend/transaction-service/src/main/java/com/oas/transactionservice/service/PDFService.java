package com.oas.transactionservice.service;

import com.oas.transactionservice.model.Invoice;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
public class PDFService {

    public byte[] generateInvoicePDF(Invoice invoice) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Title
        document.add(new Paragraph("INVOICE")
                .setFontSize(24)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20));

        // Invoice Details
        document.add(new Paragraph("Invoice Number: " + invoice.getInvoiceNumber())
                .setMarginBottom(5));
        document.add(new Paragraph("Date: " + 
                invoice.getInvoiceDate().toString().substring(0, 10))
                .setMarginBottom(20));

        // Bill To Section
        document.add(new Paragraph("Bill To:")
                .setBold()
                .setMarginBottom(5));
        document.add(new Paragraph(invoice.getBuyerName())
                .setMarginBottom(2));
        document.add(new Paragraph(invoice.getBuyerEmail())
                .setMarginBottom(2));
        if (invoice.getBuyerAddress() != null && !invoice.getBuyerAddress().isEmpty()) {
            document.add(new Paragraph(invoice.getBuyerAddress())
                    .setMarginBottom(10));
        }

        // Seller Section
        document.add(new Paragraph("Seller:")
                .setBold()
                .setMarginBottom(5));
        document.add(new Paragraph(invoice.getSellerName())
                .setMarginBottom(2));
        document.add(new Paragraph(invoice.getSellerEmail())
                .setMarginBottom(20));

        // Items Table
        Table table = new Table(UnitValue.createPercentArray(new float[]{3, 1, 1, 1}))
                .useAllAvailableWidth()
                .setMarginBottom(20);

        table.addHeaderCell(new Cell().add(new Paragraph("Description").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Category").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Quantity").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Amount").setBold()));

        table.addCell(new Cell().add(new Paragraph(invoice.getItemName())));
        table.addCell(new Cell().add(new Paragraph(
                invoice.getCategory() != null ? invoice.getCategory() : "N/A")));
        table.addCell(new Cell().add(new Paragraph("1")));
        table.addCell(new Cell().add(new Paragraph("₹" + invoice.getTotalAmount())));

        document.add(table);

        // Total
        document.add(new Paragraph("Total Amount: ₹" + invoice.getTotalAmount())
                .setBold()
                .setFontSize(16)
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginTop(10));

        document.add(new Paragraph("Payment Status: " + invoice.getPaymentStatus())
                .setMarginTop(10));

        document.close();
        return baos.toByteArray();
    }
}
