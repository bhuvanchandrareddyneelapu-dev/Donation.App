package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Expense;
import com.donationapp.entity.Festival;
import com.donationapp.repository.DonationRepository;
import com.donationapp.repository.ExpenseRepository;
import com.donationapp.repository.FestivalRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ReportService {

    private final DonationRepository donationRepository;
    private final ExpenseRepository expenseRepository;
    private final FestivalRepository festivalRepository;

    public ReportService(DonationRepository donationRepository, ExpenseRepository expenseRepository,
                         FestivalRepository festivalRepository) {
        this.donationRepository = donationRepository;
        this.expenseRepository = expenseRepository;
        this.festivalRepository = festivalRepository;
    }

    public byte[] generateDonationReportPdf(Long festivalId) {
        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, new Color(139, 0, 0));
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.BLACK);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.DARK_GRAY);

            Paragraph title = new Paragraph("DONATION.APP - OFFICIAL DONATION AUDIT REPORT", headerFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(15);
            document.add(title);

            List<Donation> donations = festivalId != null
                    ? donationRepository.findByFestivalId(festivalId)
                    : donationRepository.findAll();

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1, 2, 2, 2, 1.5f, 1.5f, 2});

            String[] headers = {"ID", "Donor Name", "Phone", "Festival", "Amount (₹)", "Method", "Status"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, boldFont));
                cell.setBackgroundColor(new Color(255, 237, 213));
                cell.setPadding(6);
                table.addCell(cell);
            }

            for (Donation d : donations) {
                table.addCell(new Phrase(d.getId().toString(), bodyFont));
                table.addCell(new Phrase(d.isAnonymous() ? "Anonymous" : d.getDonorName(), bodyFont));
                table.addCell(new Phrase(d.getDonorPhone(), bodyFont));
                table.addCell(new Phrase(d.getFestival().getName(), bodyFont));
                table.addCell(new Phrase("₹" + d.getAmount().toString(), bodyFont));
                table.addCell(new Phrase(d.getPaymentType().name(), bodyFont));
                table.addCell(new Phrase(d.getPaymentStatus().name(), bodyFont));
            }

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }

    public byte[] generateDonationReportCsv(Long festivalId) {
        StringBuilder csv = new StringBuilder();
        csv.append("Donation ID,Donor Name,Phone,Festival,Amount,Payment Method,Payment Status,Transaction ID,Date\n");

        List<Donation> donations = festivalId != null
                ? donationRepository.findByFestivalId(festivalId)
                : donationRepository.findAll();

        for (Donation d : donations) {
            csv.append(d.getId()).append(",")
               .append("\"").append(d.isAnonymous() ? "Anonymous" : d.getDonorName()).append("\",")
               .append(d.getDonorPhone()).append(",")
               .append("\"").append(d.getFestival().getName()).append("\",")
               .append(d.getAmount()).append(",")
               .append(d.getPaymentType()).append(",")
               .append(d.getPaymentStatus()).append(",")
               .append(d.getTransactionId() != null ? d.getTransactionId() : "N/A").append(",")
               .append(d.getCreatedAt()).append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] generateExpenseReportCsv(Long festivalId) {
        StringBuilder csv = new StringBuilder();
        csv.append("Expense ID,Festival,Category,Title,Amount,Vendor,Paid By,Approved By,Date\n");

        List<Expense> expenses = festivalId != null
                ? expenseRepository.findByFestivalId(festivalId)
                : expenseRepository.findAll();

        for (Expense e : expenses) {
            csv.append(e.getId()).append(",")
               .append("\"").append(e.getFestival().getName()).append("\",")
               .append(e.getCategory()).append(",")
               .append("\"").append(e.getTitle()).append("\",")
               .append(e.getAmount()).append(",")
               .append("\"").append(e.getVendorName()).append("\",")
               .append("\"").append(e.getPaidBy()).append("\",")
               .append("\"").append(e.getApprovedBy() != null ? e.getApprovedBy() : "N/A").append("\",")
               .append(e.getPaymentDate()).append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }
}
