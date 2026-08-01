package com.donationapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "expense_proofs")
public class ExpenseProof {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    private String proofType; // INVOICE, BILL, RECEIPT_IMAGE, CHEQUE_COPY

    @Column(nullable = false)
    private String fileUrl;

    private String fileName;

    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    public ExpenseProof() {
        this.uploadedAt = LocalDateTime.now();
    }

    public ExpenseProof(Expense expense, String proofType, String fileUrl, String fileName) {
        this.expense = expense;
        this.proofType = proofType;
        this.fileUrl = fileUrl;
        this.fileName = fileName;
        this.uploadedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Expense getExpense() { return expense; }
    public void setExpense(Expense expense) { this.expense = expense; }

    public String getProofType() { return proofType; }
    public void setProofType(String proofType) { this.proofType = proofType; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
