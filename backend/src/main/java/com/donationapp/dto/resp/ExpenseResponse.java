package com.donationapp.dto.resp;

import com.donationapp.entity.Expense;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ExpenseResponse {
    private Long id;
    private Long festivalId;
    private Expense.ExpenseCategory category;
    private String title;
    private BigDecimal amount;
    private String vendorName;
    private String paidBy;
    private String approvedBy;
    private LocalDate paymentDate;
    private String remarks;
    private String verificationStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ExpenseResponse() {}

    public ExpenseResponse(Expense expense) {
        if (expense != null) {
            this.id = expense.getId();
            if (expense.getFestival() != null) {
                this.festivalId = expense.getFestival().getId();
            }
            this.category = expense.getCategory();
            this.title = expense.getTitle();
            this.amount = expense.getAmount();
            this.vendorName = expense.getVendorName();
            this.paidBy = expense.getPaidBy();
            this.approvedBy = expense.getApprovedBy();
            this.paymentDate = expense.getPaymentDate();
            this.remarks = expense.getRemarks();
            this.verificationStatus = expense.getVerificationStatus();
            this.createdAt = expense.getCreatedAt();
            this.updatedAt = expense.getUpdatedAt();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFestivalId() { return festivalId; }
    public void setFestivalId(Long festivalId) { this.festivalId = festivalId; }

    public Expense.ExpenseCategory getCategory() { return category; }
    public void setCategory(Expense.ExpenseCategory category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }

    public String getPaidBy() { return paidBy; }
    public void setPaidBy(String paidBy) { this.paidBy = paidBy; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
