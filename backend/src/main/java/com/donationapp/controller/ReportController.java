package com.donationapp.controller;

import com.donationapp.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/donations/pdf")
    public ResponseEntity<byte[]> downloadDonationsPdf(@RequestParam(required = false) Long festivalId) {
        byte[] pdfBytes = reportService.generateDonationReportPdf(festivalId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Donations_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/donations/csv")
    public ResponseEntity<byte[]> downloadDonationsCsv(@RequestParam(required = false) Long festivalId) {
        byte[] csvBytes = reportService.generateDonationReportCsv(festivalId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Donations_Report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }

    @GetMapping("/expenses/csv")
    public ResponseEntity<byte[]> downloadExpensesCsv(@RequestParam(required = false) Long festivalId) {
        byte[] csvBytes = reportService.generateExpenseReportCsv(festivalId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Expenses_Report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }
}
