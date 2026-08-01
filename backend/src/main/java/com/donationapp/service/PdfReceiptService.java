package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfReceiptService {

    public byte[] generateReceiptPdf(Donation donation, Receipt receipt) {
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Header Banner Colors (Saffron / Deep Maroon)
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(139, 0, 0));
            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA, 12, new Color(255, 107, 0));
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.BLACK);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
            Font boldBodyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);

            // Title
            Paragraph title = new Paragraph("DONATION.APP - OFFICIAL RECEIPT", headerFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subTitle = new Paragraph("Digital Transparency & Community Platform | Govt Regd NGO / Trust", subHeaderFont);
            subTitle.setAlignment(Element.ALIGN_CENTER);
            subTitle.setSpacingAfter(20);
            document.add(subTitle);

            // Receipt Box Table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1, 1});

            addTableCell(table, "Receipt Number:", receipt.getReceiptNumber(), boldBodyFont, bodyFont);
            addTableCell(table, "Date & Time:", donation.getCreatedAt().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy hh:mm a")), boldBodyFont, bodyFont);
            addTableCell(table, "Event / Festival:", donation.getFestival().getName(), boldBodyFont, bodyFont);
            addTableCell(table, "Organization:", donation.getFestival().getOrganization() != null ? donation.getFestival().getOrganization().getName() : "Festival Committee", boldBodyFont, bodyFont);
            addTableCell(table, "Donor Name:", donation.isAnonymous() ? "Anonymous Donor" : donation.getDonorName(), boldBodyFont, bodyFont);
            addTableCell(table, "Donor Phone:", donation.getDonorPhone(), boldBodyFont, bodyFont);
            addTableCell(table, "Donation Purpose:", donation.getPurpose().name(), boldBodyFont, bodyFont);
            addTableCell(table, "Payment Method:", donation.getPaymentType().name(), boldBodyFont, bodyFont);
            addTableCell(table, "Verification Status:", donation.getPaymentStatus().name(), boldBodyFont, bodyFont);
            addTableCell(table, "Transaction / Reference ID:", donation.getTransactionId() != null ? donation.getTransactionId() : "N/A", boldBodyFont, bodyFont);

            if (donation.getRecordedByVolunteer() != null) {
                addTableCell(table, "Recorded By Volunteer:", donation.getRecordedByVolunteer().getName(), boldBodyFont, bodyFont);
            }

            document.add(table);

            // Amount Box
            Paragraph amountPara = new Paragraph("\nTOTAL DONATION AMOUNT RECEIVED: ₹" + String.format("%.2f", donation.getAmount()), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(0, 100, 0)));
            amountPara.setAlignment(Element.ALIGN_CENTER);
            amountPara.setSpacingBefore(15);
            amountPara.setSpacingAfter(15);
            document.add(amountPara);

            // QR Validation Code
            Paragraph qrInfo = new Paragraph("Verification Hash QR: " + receipt.getQrCodeHash() + "\nVerify authenticity online at https://donation.app/verify/" + receipt.getQrCodeHash(), bodyFont);
            qrInfo.setAlignment(Element.ALIGN_CENTER);
            document.add(qrInfo);

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }

    private void addTableCell(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell cell1 = new PdfPCell(new Phrase(label, labelFont));
        cell1.setBackgroundColor(new Color(245, 245, 245));
        cell1.setPadding(8);

        PdfPCell cell2 = new PdfPCell(new Phrase(value, valueFont));
        cell2.setPadding(8);

        table.addCell(cell1);
        table.addCell(cell2);
    }
}
