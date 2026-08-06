package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {

    @Value("${donationapp.whatsapp.enabled:true}")
    private boolean enabled;

    @Value("${donationapp.whatsapp.api-token:META_WHATSAPP_TOKEN_DEFAULT}")
    private String apiToken;

    @Value("${donationapp.whatsapp.phone-number-id:WHATSAPP_PHONE_ID_DEFAULT}")
    private String phoneNumberId;

    private final RestTemplate restTemplate = new RestTemplate();

    public String sendDonationReceiptWhatsApp(Donation donation, Receipt receipt) {
        if (!enabled) return "WHATSAPP_DISABLED";

        String phone = donation.getDonorPhone();
        String donorName = donation.isAnonymous() ? "Devotee" : donation.getDonorName();
        String committee = donation.getFestival().getOrganization() != null 
            ? donation.getFestival().getOrganization().getName() 
            : donation.getFestival().getOrganizer();

        // Message 1: Official Thank You & Receipt Details
        String receiptMessage = String.format(
            "🙏 *Thank You!*\n\n" +
            "Dear *%s*,\n\n" +
            "Thank you for donating *₹%.2f* towards\n" +
            "*%s*.\n\n" +
            "Your support helps us organize the festival successfully.\n\n" +
            "Receipt No:\n*%s*\n\n" +
            "Amount:\n*₹%.2f*\n\n" +
            "Committee:\n*%s*\n\n" +
            "May Lord Ganesha bless you and your family.\n\n" +
            "🙏 *Ganpati Bappa Morya!*",
            donorName,
            donation.getAmount(),
            donation.getFestival().getName(),
            receipt.getReceiptNumber(),
            donation.getAmount(),
            committee
        );

        String status1 = dispatchMetaCloudApi(phone, receiptMessage);

        // Message 2: Community Invitation Link
        sendCommunityInvitationWhatsApp(phone, donation.getFestival().getName());

        return status1;
    }

    public String sendCommunityInvitationWhatsApp(String phone, String festivalName) {
        if (!enabled) return "WHATSAPP_DISABLED";

        String inviteMessage = String.format(
            "🎉 *Join our Festival Community*\n\n" +
            "Stay connected with:\n" +
            "📸 Daily Pooja Photos\n" +
            "🪔 Live Celebrations\n" +
            "🎶 Aarti Videos\n" +
            "📢 Announcements\n" +
            "🌊 Immersion Updates\n" +
            "🤝 Community Events\n\n" +
            "Click below to join:\n" +
            "https://donation.app/community",
            festivalName
        );

        return dispatchMetaCloudApi(phone, inviteMessage);
    }

    private String dispatchMetaCloudApi(String recipientPhone, String messageContent) {
        String cleanPhone = recipientPhone.replaceAll("[^0-9]", "");
        if (cleanPhone.length() == 10) {
            cleanPhone = "91" + cleanPhone; // Default to India country code
        }

        System.out.println("==================================================");
        System.out.println("📱 [META WHATSAPP BUSINESS CLOUD API DISPATCH]");
        System.out.println("Phone Number ID: " + phoneNumberId);
        System.out.println("Recipient Phone: +" + cleanPhone);
        System.out.println("Message Payload:\n" + messageContent);

        if (apiToken.equals("META_WHATSAPP_TOKEN_DEFAULT") || phoneNumberId.equals("WHATSAPP_PHONE_ID_DEFAULT")) {
            System.out.println("⚠️ [META CREDENTIALS NOTICE] Running in simulation/dev mode.");
            System.out.println("Set WHATSAPP_API_TOKEN & WHATSAPP_PHONE_NUMBER_ID env vars for real delivery.");
            System.out.println("Status: SIMULATED_DELIVERY_TEST_MODE ✅");
            System.out.println("==================================================");
            return "SIMULATED_DELIVERY_TEST_MODE";
        }

        try {
            String url = String.format("https://graph.facebook.com/v18.0/%s/messages", phoneNumberId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiToken);

            Map<String, Object> body = new HashMap<>();
            body.put("messaging_product", "whatsapp");
            body.put("to", cleanPhone);
            body.put("type", "text");

            Map<String, String> textObj = new HashMap<>();
            textObj.put("body", messageContent);
            body.put("text", textObj);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

            System.out.println("Status: META_API_SENT_200 ✅ Response: " + response.getBody());
            System.out.println("==================================================");
            return "META_API_SENT_200";
        } catch (Exception e) {
            System.err.println("❌ Error sending Meta WhatsApp message: " + e.getMessage());
            System.out.println("==================================================");
            return "META_DISPATCH_FAILED: " + e.getMessage();
        }
    }
}
