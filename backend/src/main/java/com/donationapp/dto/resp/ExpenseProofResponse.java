package com.donationapp.dto.resp;

import com.donationapp.entity.ExpenseProof;
import java.time.LocalDateTime;

public class ExpenseProofResponse {
    private Long id;
    private Long expenseId;
    private String proofType;
    private String fileUrl;
    private String fileName;
    private LocalDateTime uploadedAt;

    public ExpenseProofResponse() {}

    public ExpenseProofResponse(ExpenseProof proof) {
        if (proof != null) {
            this.id = proof.getId();
            if (proof.getExpense() != null) {
                this.expenseId = proof.getExpense().getId();
            }
            this.proofType = proof.getProofType();
            this.fileUrl = proof.getFileUrl();
            this.fileName = proof.getFileName();
            this.uploadedAt = proof.getUploadedAt();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getExpenseId() { return expenseId; }
    public void setExpenseId(Long expenseId) { this.expenseId = expenseId; }

    public String getProofType() { return proofType; }
    public void setProofType(String proofType) { this.proofType = proofType; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
