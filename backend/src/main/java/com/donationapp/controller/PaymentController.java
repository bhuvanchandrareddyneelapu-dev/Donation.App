package com.donationapp.controller;

import com.donationapp.dto.req.RazorpayOrderRequest;
import com.donationapp.dto.req.RazorpayVerifyRequest;
import com.donationapp.dto.resp.DonationResponse;
import com.donationapp.dto.resp.RazorpayOrderResponse;
import com.donationapp.entity.Donation;
import com.donationapp.entity.Festival;
import com.donationapp.repository.DonationRepository;
import com.donationapp.repository.FestivalRepository;
import com.donationapp.service.DonationService;
import com.donationapp.service.RazorpayService;
import jakarta.validation.Valid;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final RazorpayService razorpayService;
    private final DonationService donationService;
    private final FestivalRepository festivalRepository;
    private final DonationRepository donationRepository;

    public PaymentController(RazorpayService razorpayService,
                             DonationService donationService,
                             FestivalRepository festivalRepository,
                             DonationRepository donationRepository) {
        this.razorpayService = razorpayService;
        this.donationService = donationService;
        this.festivalRepository = festivalRepository;
        this.donationRepository = donationRepository;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@Valid @RequestBody RazorpayOrderRequest req) {
        Festival festival = festivalRepository.findById(req.getFestivalId())
                .orElse(null);

        String prefix = festival != null ? festival.getReceiptPrefix() : "DON";
        String receiptNo = String.format("%s-%d-%06d", prefix, LocalDate.now().getYear(), System.currentTimeMillis() % 1000000);

        Map<String, Object> orderMap = razorpayService.createOrder(req.getAmount(), req.getCurrency(), receiptNo);

        RazorpayOrderResponse response = new RazorpayOrderResponse(
                (String) orderMap.get("id"),
                ((Number) orderMap.get("amount")).longValue(),
                (String) orderMap.get("currency"),
                (String) orderMap.get("receipt"),
                (String) orderMap.get("status"),
                (String) orderMap.get("keyId")
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@Valid @RequestBody RazorpayVerifyRequest req) {
        boolean isValid = razorpayService.verifyPaymentSignature(
                req.getRazorpay_order_id(),
                req.getRazorpay_payment_id(),
                req.getRazorpay_signature()
        );

        if (!isValid) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid Razorpay payment signature");
            error.put("status", "FAILED");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        DonationResponse response = donationService.processVerifiedOnlineDonation(req);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {

        if (signature != null && !signature.isEmpty()) {
            boolean isValid = razorpayService.verifyWebhookSignature(payload, signature);
            if (!isValid) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid webhook signature");
            }
        }

        try {
            JSONObject json = new JSONObject(payload);
            String event = json.optString("event");
            System.out.println("🔔 [RAZORPAY WEBHOOK EVENT RECEIVED]: " + event);

            switch (event) {
                case "payment.authorized":
                case "payment.captured":
                case "order.paid":
                    System.out.println("✅ Webhook: Payment captured / order paid successfully.");
                    break;
                case "payment.failed":
                    System.out.println("❌ Webhook: Payment failed.");
                    break;
                case "refund.processed":
                    System.out.println("🔄 Webhook: Refund processed.");
                    break;
                default:
                    System.out.println("ℹ️ Webhook event received: " + event);
                    break;
            }
            return ResponseEntity.ok(Map.of("status", "success", "event", event));
        } catch (Exception e) {
            System.err.println("Webhook parsing error: " + e.getMessage());
            return ResponseEntity.ok(Map.of("status", "received"));
        }
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<?> getPaymentDetails(@PathVariable String paymentId) {
        Optional<Donation> donationOpt = donationRepository.findByRazorpayPaymentId(paymentId);
        if (donationOpt.isEmpty()) {
            donationOpt = donationRepository.findByTransactionId(paymentId);
        }
        if (donationOpt.isEmpty()) {
            donationOpt = donationRepository.findByRazorpayOrderId(paymentId);
        }

        if (donationOpt.isPresent()) {
            Donation d = donationOpt.get();
            Map<String, Object> details = new HashMap<>();
            details.put("donationId", d.getId());
            details.put("festivalName", d.getFestival().getName());
            details.put("donorName", d.isAnonymous() ? "Anonymous" : d.getDonorName());
            details.put("amount", d.getAmount());
            details.put("currency", d.getCurrency());
            details.put("paymentStatus", d.getPaymentStatus());
            details.put("paymentType", d.getPaymentType());
            details.put("transactionId", d.getTransactionId());
            details.put("razorpayOrderId", d.getRazorpayOrderId());
            details.put("razorpayPaymentId", d.getRazorpayPaymentId());
            details.put("createdAt", d.getCreatedAt());
            return ResponseEntity.ok(details);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Payment record not found"));
    }
}
