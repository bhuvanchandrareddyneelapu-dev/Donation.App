package com.donationapp.service.email;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

public class ResendEmailProviderTest {

    private RestTemplate restTemplate;
    private MockRestServiceServer mockServer;
    private ResendEmailProvider resendEmailProvider;

    private Donation donation;
    private Receipt receipt;

    @BeforeEach
    void setUp() {
        restTemplate = new RestTemplate();
        mockServer = MockRestServiceServer.createServer(restTemplate);
        resendEmailProvider = new ResendEmailProvider(restTemplate);

        ReflectionTestUtils.setField(resendEmailProvider, "apiKey", "re_test_123456789");
        ReflectionTestUtils.setField(resendEmailProvider, "fromEmail", "onboarding@resend.dev");
        ReflectionTestUtils.setField(resendEmailProvider, "adminEmail", "admin@donation.app");

        donation = new Donation();
        donation.setId(100L);
        donation.setDonorName("Test Donor");
        donation.setAmount(new BigDecimal("500.00"));

        receipt = new Receipt();
        receipt.setReceiptNumber("REC-100");
    }

    @Test
    void testIsConfigured_ReturnsTrueWhenAllSet() {
        assertTrue(resendEmailProvider.isConfigured());
    }

    @Test
    void testIsConfigured_MissingApiKey_ReturnsFalse() {
        ReflectionTestUtils.setField(resendEmailProvider, "apiKey", "");
        assertFalse(resendEmailProvider.isConfigured());
    }

    @Test
    void testSendDonorReceipt_Success() {
        mockServer.expect(requestTo("https://api.resend.com/emails"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Authorization", "Bearer re_test_123456789"))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.to[0]").value("donor@example.com"))
                .andExpect(jsonPath("$.subject").value("Thank You"))
                .andExpect(jsonPath("$.attachments[0].filename").value("Receipt_REC-100.pdf"))
                .andRespond(withSuccess("{\"id\": \"msg_123\"}", MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() -> resendEmailProvider.sendDonorReceipt(
                donation, receipt, "donor@example.com", "Thank You", "Plain text", "<h1>HTML</h1>", "%PDF-dummy".getBytes(), true
        ));

        mockServer.verify();
    }

    @Test
    void testSendDonorReceipt_ApiFailure_ThrowsRuntimeException() {
        mockServer.expect(requestTo("https://api.resend.com/emails"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withStatus(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Invalid API key\"}"));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> resendEmailProvider.sendDonorReceipt(
                donation, receipt, "donor@example.com", "Thank You", "Plain text", "<h1>HTML</h1>", "%PDF-dummy".getBytes(), true
        ));

        assertTrue(ex.getMessage().contains("Resend API failed with status 401"));
        mockServer.verify();
    }

    @Test
    void testSendTestEmail_Success() {
        mockServer.expect(requestTo("https://api.resend.com/emails"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Authorization", "Bearer re_test_123456789"))
                .andExpect(jsonPath("$.to[0]").value("admin@donation.app"))
                .andExpect(jsonPath("$.subject").value("Test Subject"))
                .andRespond(withSuccess("{\"id\": \"msg_456\"}", MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() -> resendEmailProvider.sendTestEmail("Test Subject", "Plain Text", "<h1>HTML</h1>", "admin@donation.app"));

        mockServer.verify();
    }
}
