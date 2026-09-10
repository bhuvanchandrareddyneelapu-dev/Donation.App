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

/**
 * Unit tests for BrevoEmailProvider.
 *
 * All HTTP calls are intercepted by MockRestServiceServer — no actual Brevo API calls are made.
 * Tests verify the correct endpoint, headers, payload structure, and error handling.
 */
public class BrevoEmailProviderTest {

    private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";
    private static final String TEST_API_KEY = "xkeysib-test-brevo-key-123456789";
    private static final String TEST_FROM_EMAIL = "donations@example.com";
    private static final String TEST_ADMIN_EMAIL = "admin@donation.app";
    private static final String DONOR_EMAIL = "donor@example.com";

    private RestTemplate restTemplate;
    private MockRestServiceServer mockServer;
    private BrevoEmailProvider brevoEmailProvider;

    private Donation donation;
    private Receipt receipt;

    @BeforeEach
    void setUp() {
        restTemplate = new RestTemplate();
        mockServer = MockRestServiceServer.createServer(restTemplate);
        brevoEmailProvider = new BrevoEmailProvider(restTemplate);

        // Inject test config values via reflection (no Spring context needed)
        ReflectionTestUtils.setField(brevoEmailProvider, "apiKey", TEST_API_KEY);
        ReflectionTestUtils.setField(brevoEmailProvider, "fromEmail", TEST_FROM_EMAIL);
        ReflectionTestUtils.setField(brevoEmailProvider, "adminEmail", TEST_ADMIN_EMAIL);

        donation = new Donation();
        donation.setId(42L);
        donation.setDonorName("Test Donor");
        donation.setDonorEmail(DONOR_EMAIL);
        donation.setAmount(new BigDecimal("1500.00"));

        receipt = new Receipt();
        receipt.setReceiptNumber("GAN-2026-000042");
        receipt.setDonation(donation);
    }

    // -------------------------------------------------------------------------
    // isConfigured()
    // -------------------------------------------------------------------------

    @Test
    void testIsConfigured_ReturnsTrueWhenAllSet() {
        assertTrue(brevoEmailProvider.isConfigured());
    }

    @Test
    void testIsConfigured_MissingApiKey_ReturnsFalse() {
        ReflectionTestUtils.setField(brevoEmailProvider, "apiKey", "");
        assertFalse(brevoEmailProvider.isConfigured());
    }

    @Test
    void testIsConfigured_MissingFromEmail_ReturnsFalse() {
        ReflectionTestUtils.setField(brevoEmailProvider, "fromEmail", "");
        assertFalse(brevoEmailProvider.isConfigured());
    }

    @Test
    void testIsConfigured_MissingAdminEmail_ReturnsFalse() {
        ReflectionTestUtils.setField(brevoEmailProvider, "adminEmail", "");
        assertFalse(brevoEmailProvider.isConfigured());
    }

    // -------------------------------------------------------------------------
    // Provider identity
    // -------------------------------------------------------------------------

    @Test
    void testGetProviderName_ReturnsBrevo() {
        assertEquals("brevo", brevoEmailProvider.getProviderName());
    }

    @Test
    void testGetTransportType_ReturnsHttps() {
        assertEquals("https", brevoEmailProvider.getTransportType());
    }

    // -------------------------------------------------------------------------
    // sendDonorReceipt — endpoint, headers, payload
    // -------------------------------------------------------------------------

    @Test
    void testSendDonorReceipt_UsesCorrectEndpoint() throws Exception {
        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("{\"messageId\":\"<msg-001@brevo>\"}", MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() -> brevoEmailProvider.sendDonorReceipt(
                donation, receipt, DONOR_EMAIL, "Thank You", "Plain text", "<h1>HTML</h1>",
                "%PDF-dummy".getBytes(), false
        ));
        mockServer.verify();
    }

    @Test
    void testSendDonorReceipt_SendsApiKeyHeader() throws Exception {
        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("api-key", TEST_API_KEY))  // Brevo uses api-key, not Bearer
                .andRespond(withSuccess("{\"messageId\":\"<msg-002@brevo>\"}", MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() -> brevoEmailProvider.sendDonorReceipt(
                donation, receipt, DONOR_EMAIL, "Thank You", "Plain text", "<h1>HTML</h1>",
                null, false
        ));
        mockServer.verify();
    }

    @Test
    void testSendDonorReceipt_DonorRecipientIsCorrect() throws Exception {
        // Verifies dynamic donor email goes to Brevo "to" array — NOT admin email
        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(jsonPath("$.to[0].email").value(DONOR_EMAIL))
                .andExpect(jsonPath("$.sender.email").value(TEST_FROM_EMAIL))
                .andExpect(jsonPath("$.sender.name").value("Unicode Estates"))
                .andRespond(withSuccess("{\"messageId\":\"<msg-003@brevo>\"}", MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() -> brevoEmailProvider.sendDonorReceipt(
                donation, receipt, DONOR_EMAIL, "Thank You", "Plain text", "<h1>HTML</h1>",
                null, false
        ));
        mockServer.verify();
    }

    @Test
    void testSendDonorReceipt_DonorRecipientIsNotAdminEmail() throws Exception {
        // Critical: donor email must NOT equal admin email
        assertNotEquals(DONOR_EMAIL, TEST_ADMIN_EMAIL,
                "Test setup error: donor and admin emails must differ");

        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(jsonPath("$.to[0].email").value(DONOR_EMAIL))
                .andRespond(withSuccess("{\"messageId\":\"<msg-004@brevo>\"}", MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() -> brevoEmailProvider.sendDonorReceipt(
                donation, receipt, DONOR_EMAIL, "Thank You", "Plain text", "<h1>HTML</h1>",
                null, false
        ));
        mockServer.verify();
    }

    @Test
    void testSendDonorReceipt_PdfAttachmentIncluded() throws Exception {
        byte[] pdfBytes = "%PDF-1.4 test content".getBytes();

        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(jsonPath("$.attachment[0].name").value("Receipt_GAN-2026-000042.pdf"))
                .andExpect(jsonPath("$.attachment[0].content").isNotEmpty())
                .andRespond(withSuccess("{\"messageId\":\"<msg-005@brevo>\"}", MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() -> brevoEmailProvider.sendDonorReceipt(
                donation, receipt, DONOR_EMAIL, "Thank You", "Plain text", "<h1>HTML</h1>",
                pdfBytes, false
        ));
        mockServer.verify();
    }

    @Test
    void testSendDonorReceipt_PdfAttachmentIsBase64Encoded() throws Exception {
        byte[] pdfBytes = "%PDF-1.4 encoded content".getBytes();
        String expectedBase64 = java.util.Base64.getEncoder().encodeToString(pdfBytes);

        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(jsonPath("$.attachment[0].content").value(expectedBase64))
                .andRespond(withSuccess("{\"messageId\":\"<msg-006@brevo>\"}", MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() -> brevoEmailProvider.sendDonorReceipt(
                donation, receipt, DONOR_EMAIL, "Thank You", "Plain text", "<h1>HTML</h1>",
                pdfBytes, false
        ));
        mockServer.verify();
    }

    @Test
    void testSendDonorReceipt_NoPdfBytes_NoAttachmentField() throws Exception {
        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                // When no PDF bytes, "attachment" key must not be present
                .andExpect(jsonPath("$.attachment").doesNotExist())
                .andRespond(withSuccess("{\"messageId\":\"<msg-007@brevo>\"}", MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() -> brevoEmailProvider.sendDonorReceipt(
                donation, receipt, DONOR_EMAIL, "Thank You", "Plain text", "<h1>HTML</h1>",
                null, false
        ));
        mockServer.verify();
    }

    // -------------------------------------------------------------------------
    // sendAdminNotification — separate request, admin recipient
    // -------------------------------------------------------------------------

    @Test
    void testSendAdminNotification_AdminRecipientIsCorrect() throws Exception {
        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(jsonPath("$.to[0].email").value(TEST_ADMIN_EMAIL))
                .andRespond(withSuccess("{\"messageId\":\"<msg-008@brevo>\"}", MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() -> brevoEmailProvider.sendAdminNotification(
                donation, receipt, TEST_ADMIN_EMAIL,
                "New Donation - ₹1500.00", "Admin notification body"
        ));
        mockServer.verify();
    }

    @Test
    void testSendAdminNotification_AdminRecipientIsNotDonorEmail() throws Exception {
        // Critical: admin email must NOT equal donor email
        assertNotEquals(TEST_ADMIN_EMAIL, DONOR_EMAIL,
                "Test setup error: admin and donor emails must differ");

        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(jsonPath("$.to[0].email").value(TEST_ADMIN_EMAIL))
                .andRespond(withSuccess("{\"messageId\":\"<msg-009@brevo>\"}", MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() -> brevoEmailProvider.sendAdminNotification(
                donation, receipt, TEST_ADMIN_EMAIL,
                "New Donation", "Body"
        ));
        mockServer.verify();
    }

    // -------------------------------------------------------------------------
    // sendTestEmail
    // -------------------------------------------------------------------------

    @Test
    void testSendTestEmail_Success() throws Exception {
        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("api-key", TEST_API_KEY))
                .andExpect(jsonPath("$.to[0].email").value(TEST_ADMIN_EMAIL))
                .andExpect(jsonPath("$.subject").value("Test Subject"))
                .andRespond(withSuccess("{\"messageId\":\"<msg-010@brevo>\"}", MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() -> brevoEmailProvider.sendTestEmail(
                "Test Subject", "Plain text", "<h1>HTML</h1>", TEST_ADMIN_EMAIL
        ));
        mockServer.verify();
    }

    // -------------------------------------------------------------------------
    // HTTP error handling
    // -------------------------------------------------------------------------

    @Test
    void testSendDonorReceipt_TrimsWhitespaceFromApiKeyHeader() throws Exception {
        // Test key with leading and trailing spaces
        ReflectionTestUtils.setField(brevoEmailProvider, "apiKey", "   " + TEST_API_KEY + "   \n");

        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("api-key", TEST_API_KEY))  // Header must receive trimmed key
                .andRespond(withSuccess("{\"messageId\":\"<msg-trim@brevo>\"}", MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() -> brevoEmailProvider.sendDonorReceipt(
                donation, receipt, DONOR_EMAIL, "Thank You", "Plain text", "<h1>HTML</h1>",
                null, false
        ));
        mockServer.verify();
    }

    // -------------------------------------------------------------------------
    // HTTP error handling
    // -------------------------------------------------------------------------

    @Test
    void testSendDonorReceipt_Http401_ThrowsClearAuthenticationException() {
        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withStatus(HttpStatus.UNAUTHORIZED)
                        .body("{\"code\":\"unauthorized\",\"message\":\"Invalid API key: " + TEST_API_KEY + "\"}")
                        .contentType(MediaType.APPLICATION_JSON));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                brevoEmailProvider.sendDonorReceipt(
                        donation, receipt, DONOR_EMAIL, "Subject", "Plain", "<h1>HTML</h1>",
                        null, false
                )
        );

        assertTrue(ex.getMessage().contains("Brevo authentication failed. Check BREVO_API_KEY in Render."),
                "Exception message should give clear Render instruction. Actual: " + ex.getMessage());
        assertFalse(ex.getMessage().contains(TEST_API_KEY),
                "Exception message must sanitize secret API key.");
        mockServer.verify();
    }

    @Test
    void testSendDonorReceipt_Http400_ThrowsValidationException() {
        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withStatus(HttpStatus.BAD_REQUEST)
                        .body("{\"code\":\"invalid_parameter\",\"message\":\"Invalid sender email\"}")
                        .contentType(MediaType.APPLICATION_JSON));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                brevoEmailProvider.sendDonorReceipt(
                        donation, receipt, DONOR_EMAIL, "Subject", "Plain", "<h1>HTML</h1>",
                        null, false
                )
        );

        assertTrue(ex.getMessage().contains("Brevo request validation failed (HTTP 400)"),
                "Exception message should identify HTTP 400 validation error. Actual: " + ex.getMessage());
        mockServer.verify();
    }

    @Test
    void testSendDonorReceipt_Http403_ThrowsPermissionException() {
        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withStatus(HttpStatus.FORBIDDEN)
                        .body("{\"code\":\"forbidden\",\"message\":\"Account suspended or restricted\"}")
                        .contentType(MediaType.APPLICATION_JSON));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                brevoEmailProvider.sendDonorReceipt(
                        donation, receipt, DONOR_EMAIL, "Subject", "Plain", "<h1>HTML</h1>",
                        null, false
                )
        );

        assertTrue(ex.getMessage().contains("Brevo account/permission restricted (HTTP 403)"),
                "Exception message should identify HTTP 403 account restriction. Actual: " + ex.getMessage());
        mockServer.verify();
    }

    @Test
    void testSendDonorReceipt_Http5xx_ThrowsRuntimeException() {
        mockServer.expect(requestTo(BREVO_URL))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withServerError()
                        .body("{\"code\":\"server_error\",\"message\":\"Internal Server Error\"}")
                        .contentType(MediaType.APPLICATION_JSON));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                brevoEmailProvider.sendDonorReceipt(
                        donation, receipt, DONOR_EMAIL, "Subject", "Plain", "<h1>HTML</h1>",
                        null, false
                )
        );

        assertTrue(ex.getMessage().contains("Brevo API failed with status 500"),
                "Exception message should reference HTTP 500. Actual: " + ex.getMessage());
        mockServer.verify();
    }

    @Test
    void testSendDonorReceipt_Unconfigured_ThrowsIllegalStateException() {
        ReflectionTestUtils.setField(brevoEmailProvider, "apiKey", "");

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                brevoEmailProvider.sendDonorReceipt(
                        donation, receipt, DONOR_EMAIL, "Subject", "Plain", "<h1>HTML</h1>",
                        null, false
                )
        );

        assertTrue(ex.getMessage().contains("Brevo HTTPS email configuration is incomplete"));
    }

    // -------------------------------------------------------------------------
    // getStatusMap() — safe diagnostics, no secrets exposed
    // -------------------------------------------------------------------------

    @Test
    void testGetStatusMap_ContainsBrevoProviderAndSafeDiagnostics() {
        var statusMap = brevoEmailProvider.getStatusMap();
        assertEquals("brevo", statusMap.get("provider"));
        assertEquals("https", statusMap.get("transport"));
        assertEquals("CONFIGURED", statusMap.get("status"));
        assertEquals("UNVERIFIED", statusMap.get("connectivity"));
        assertTrue((Boolean) statusMap.get("configured"));
        assertTrue((Boolean) statusMap.get("keyPresent"));
        assertEquals(TEST_API_KEY.length(), statusMap.get("keyLength"));
        assertNotNull(statusMap.get("keyFingerprint"));
        assertNotEquals("NONE", statusMap.get("keyFingerprint"));
        assertTrue((Boolean) statusMap.get("fromConfigured"));
        assertTrue((Boolean) statusMap.get("adminRecipientConfigured"));
    }

    @Test
    void testGetStatusMap_DoesNotExposeApiKey() {
        var statusMap = brevoEmailProvider.getStatusMap();
        // The actual API key value must NOT appear anywhere in the status map
        for (Object value : statusMap.values()) {
            if (value instanceof String s) {
                assertFalse(s.contains(TEST_API_KEY),
                        "API key value must not appear in status map. Found in: " + s);
            }
        }
    }
}
