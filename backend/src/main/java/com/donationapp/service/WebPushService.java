package com.donationapp.service;

import com.donationapp.entity.PushSubscription;
import org.bouncycastle.jce.ECNamedCurveTable;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.spec.ECNamedCurveParameterSpec;
import org.bouncycastle.jce.spec.ECPrivateKeySpec;
import org.bouncycastle.jce.spec.ECPublicKeySpec;
import org.bouncycastle.math.ec.ECPoint;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import javax.crypto.Cipher;
import javax.crypto.KeyAgreement;
import javax.crypto.Mac;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigInteger;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Base64;

/**
 * WebPushService — RFC 8291 / VAPID Web Push Implementation using BouncyCastle & Java HttpClient.
 */
@Service
public class WebPushService {

    private static final Logger log = LoggerFactory.getLogger(WebPushService.class);
    private static final Base64.Encoder URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder URL_DECODER = Base64.getUrlDecoder();

    @Value("${VAPID_PUBLIC_KEY:}")
    private String configuredPublicKey;

    @Value("${VAPID_PRIVATE_KEY:}")
    private String configuredPrivateKey;

    @Value("${VAPID_SUBJECT:mailto:admin@unicodeestates.in}")
    private String vapidSubject;

    private String publicKey;
    private String privateKey;
    private PrivateKey vapidPrivateKeyObj;
    private HttpClient httpClient;

    @PostConstruct
    public void init() {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();

        try {
            if (configuredPublicKey != null && !configuredPublicKey.isBlank() &&
                configuredPrivateKey != null && !configuredPrivateKey.isBlank()) {
                this.publicKey = configuredPublicKey.trim();
                this.privateKey = configuredPrivateKey.trim();
                this.vapidPrivateKeyObj = parsePrivateKey(this.privateKey);
                log.info("[WebPush] Initialized VAPID KeyPair from environment variables.");
            } else {
                KeyPair keyPair = generateVapidKeyPair();
                this.publicKey = encodePublicKey((java.security.interfaces.ECPublicKey) keyPair.getPublic());
                this.privateKey = encodePrivateKey((java.security.interfaces.ECPrivateKey) keyPair.getPrivate());
                this.vapidPrivateKeyObj = keyPair.getPrivate();
                log.info("[WebPush] Generated dynamic VAPID KeyPair (Public Key: {})", publicKey);
            }
        } catch (Exception e) {
            log.error("[WebPush] Failed to initialize WebPush VAPID keypair: {}", e.getMessage(), e);
        }
    }

    public String getPublicKey() {
        return publicKey;
    }

    /**
     * Dispatches WebPush notification to target browser subscription.
     * Returns true if sent successfully, false if endpoint expired (410/404) or failed.
     */
    public boolean sendPushNotification(PushSubscription subscription, String title, String body, String actionUrl, Long festivalId) {
        if (subscription == null || !subscription.isEnabled() || subscription.getEndpoint() == null) {
            return false;
        }

        try {
            URI endpointUri = URI.create(subscription.getEndpoint());
            String origin = endpointUri.getScheme() + "://" + endpointUri.getAuthority();

            JSONObject payload = new JSONObject();
            payload.put("title", title);
            payload.put("body", body);
            payload.put("icon", "/assets/images/unicode-estates-ganesh-idol.png");
            payload.put("badge", "/assets/images/unicode-estates-ganesh-idol.png");

            JSONObject data = new JSONObject();
            data.put("actionUrl", actionUrl != null ? actionUrl : "/");
            data.put("festivalId", festivalId != null ? festivalId : 1L);
            payload.put("data", data);

            byte[] payloadBytes = payload.toString().getBytes(StandardCharsets.UTF_8);
            byte[] encryptedPayload = encryptPayload(payloadBytes, subscription.getP256dhKey(), subscription.getAuthKey());

            String vapidToken = createVapidToken(origin);
            String authHeader = "vapid t=" + vapidToken + ", k=" + publicKey;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(endpointUri)
                    .timeout(Duration.ofSeconds(10))
                    .header("Authorization", authHeader)
                    .header("Content-Type", "application/octet-stream")
                    .header("Content-Encoding", "aes128gcm")
                    .header("TTL", "86400")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(encryptedPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            int statusCode = response.statusCode();

            if (statusCode == 201 || statusCode == 200 || statusCode == 202) {
                subscription.setLastSuccessAt(LocalDateTime.now());
                subscription.setFailureCount(0);
                log.info("[WebPush] Delivered push notification to subscription ID {} (HTTP {})", subscription.getId(), statusCode);
                return true;
            } else if (statusCode == 410 || statusCode == 404) {
                log.warn("[WebPush] Subscription expired or unsubscribed (HTTP {}). Disabling subscription ID {}", statusCode, subscription.getId());
                subscription.setEnabled(false);
                subscription.setLastFailureAt(LocalDateTime.now());
                return false;
            } else {
                log.warn("[WebPush] Push delivery failed (HTTP {}) for subscription ID {}: {}", statusCode, subscription.getId(), response.body());
                subscription.setLastFailureAt(LocalDateTime.now());
                subscription.setFailureCount((subscription.getFailureCount() != null ? subscription.getFailureCount() : 0) + 1);
                if (subscription.getFailureCount() >= 5) {
                    subscription.setEnabled(false);
                }
                return false;
            }
        } catch (Exception e) {
            log.error("[WebPush] Error sending push to subscription ID {}: {}", subscription.getId(), e.getMessage());
            subscription.setLastFailureAt(LocalDateTime.now());
            subscription.setFailureCount((subscription.getFailureCount() != null ? subscription.getFailureCount() : 0) + 1);
            if (subscription.getFailureCount() >= 5) {
                subscription.setEnabled(false);
            }
            return false;
        }
    }

    // ==========================================
    // VAPID & ECE ENCRYPTION HELPERS
    // ==========================================

    private KeyPair generateVapidKeyPair() throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC", BouncyCastleProvider.PROVIDER_NAME);
        ECGenParameterSpec ecSpec = new ECGenParameterSpec("prime256v1");
        kpg.initialize(ecSpec);
        return kpg.generateKeyPair();
    }

    private String encodePublicKey(java.security.interfaces.ECPublicKey pk) {
        ECPoint q = ECNamedCurveTable.getParameterSpec("prime256v1").getCurve()
                .createPoint(pk.getW().getAffineX(), pk.getW().getAffineY());
        byte[] encoded = q.getEncoded(false);
        return URL_ENCODER.encodeToString(encoded);
    }

    private String encodePrivateKey(java.security.interfaces.ECPrivateKey pk) {
        byte[] d = pk.getS().toByteArray();
        if (d.length > 32 && d[0] == 0) {
            byte[] tmp = new byte[32];
            System.arraycopy(d, 1, tmp, 0, 32);
            d = tmp;
        }
        return URL_ENCODER.encodeToString(d);
    }

    private PrivateKey parsePrivateKey(String base64PrivateKey) throws Exception {
        byte[] dBytes = URL_DECODER.decode(base64PrivateKey);
        BigInteger d = new BigInteger(1, dBytes);
        ECNamedCurveParameterSpec spec = ECNamedCurveTable.getParameterSpec("prime256v1");
        ECPrivateKeySpec priSpec = new ECPrivateKeySpec(d, spec);
        KeyFactory kf = KeyFactory.getInstance("EC", BouncyCastleProvider.PROVIDER_NAME);
        return kf.generatePrivate(priSpec);
    }

    private String createVapidToken(String audience) throws Exception {
        long now = Instant.now().getEpochSecond();
        long exp = now + 43200; // 12 hours

        JSONObject header = new JSONObject();
        header.put("alg", "ES256");
        header.put("typ", "JWT");

        JSONObject payload = new JSONObject();
        payload.put("aud", audience);
        payload.put("exp", exp);
        payload.put("sub", vapidSubject);

        String headerEnc = URL_ENCODER.encodeToString(header.toString().getBytes(StandardCharsets.UTF_8));
        String payloadEnc = URL_ENCODER.encodeToString(payload.toString().getBytes(StandardCharsets.UTF_8));
        String unsignedToken = headerEnc + "." + payloadEnc;

        Signature dsa = Signature.getInstance("SHA256withECDSA", BouncyCastleProvider.PROVIDER_NAME);
        dsa.initSign(vapidPrivateKeyObj);
        dsa.update(unsignedToken.getBytes(StandardCharsets.UTF_8));
        byte[] signature = dsa.sign();

        byte[] joseSignature = derToJoseSignature(signature);

        return unsignedToken + "." + URL_ENCODER.encodeToString(joseSignature);
    }

    private byte[] derToJoseSignature(byte[] derSignature) {
        int rLength = derSignature[3];
        int rOffset = 4;
        int sLength = derSignature[rOffset + rLength + 1];
        int sOffset = rOffset + rLength + 2;

        byte[] joseSignature = new byte[64];
        int rPad = 32 - (rLength > 32 ? 32 : rLength);
        int rStart = rLength > 32 ? rOffset + (rLength - 32) : rOffset;
        int rLen = Math.min(rLength, 32);
        System.arraycopy(derSignature, rStart, joseSignature, rPad, rLen);

        int sPad = 64 - (sLength > 32 ? 32 : sLength);
        int sStart = sLength > 32 ? sOffset + (sLength - 32) : sOffset;
        int sLen = Math.min(sLength, 32);
        System.arraycopy(derSignature, sStart, joseSignature, sPad, sLen);

        return joseSignature;
    }

    /**
     * RFC 8291 AES-128-GCM Payload Encryption
     */
    private byte[] encryptPayload(byte[] plainText, String p256dhBase64, String authBase64) throws Exception {
        byte[] userPublicKeyBytes = URL_DECODER.decode(p256dhBase64);
        byte[] userAuthBytes = URL_DECODER.decode(authBase64);

        ECNamedCurveParameterSpec spec = ECNamedCurveTable.getParameterSpec("prime256v1");
        ECPoint userPoint = spec.getCurve().decodePoint(userPublicKeyBytes);
        ECPublicKeySpec pubSpec = new ECPublicKeySpec(userPoint, spec);
        KeyFactory kf = KeyFactory.getInstance("EC", BouncyCastleProvider.PROVIDER_NAME);
        PublicKey userPublicKey = kf.generatePublic(pubSpec);

        KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC", BouncyCastleProvider.PROVIDER_NAME);
        kpg.initialize(new ECGenParameterSpec("prime256v1"));
        KeyPair senderKeyPair = kpg.generateKeyPair();
        byte[] senderPublicKeyBytes = ((org.bouncycastle.jce.interfaces.ECPublicKey) senderKeyPair.getPublic()).getQ().getEncoded(false);

        KeyAgreement keyAgreement = KeyAgreement.getInstance("ECDH", BouncyCastleProvider.PROVIDER_NAME);
        keyAgreement.init(senderKeyPair.getPrivate());
        keyAgreement.doPhase(userPublicKey, true);
        byte[] sharedSecret = keyAgreement.generateSecret();

        byte[] salt = new byte[16];
        SecureRandom.getInstanceStrong().nextBytes(salt);

        byte[] ikm = hkdf(sharedSecret, userAuthBytes, combine(
                "WebPush: info".getBytes(StandardCharsets.UTF_8),
                new byte[]{0},
                userPublicKeyBytes,
                senderPublicKeyBytes
        ), 32);

        byte[] prk = hkdfExtract(salt, ikm);
        byte[] cek = hkdfExpand(prk, combine("Content-Encoding: aes128gcm".getBytes(StandardCharsets.UTF_8), new byte[]{1}), 16);
        byte[] nonce = hkdfExpand(prk, combine("Content-Encoding: nonce".getBytes(StandardCharsets.UTF_8), new byte[]{1}), 12);

        // Add 2 bytes delimiter padding (RFC 8291)
        byte[] paddedRecord = combine(plainText, new byte[]{2});

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding", BouncyCastleProvider.PROVIDER_NAME);
        GCMParameterSpec gcmSpec = new GCMParameterSpec(128, nonce);
        cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(cek, "AES"), gcmSpec);
        byte[] cipherText = cipher.doFinal(paddedRecord);

        // Header: 16 bytes salt + 4 bytes record size (4096) + 1 byte key length (65) + 65 bytes sender public key
        ByteBuffer headerBuffer = ByteBuffer.allocate(16 + 4 + 1 + 65);
        headerBuffer.put(salt);
        headerBuffer.putInt(4096);
        headerBuffer.put((byte) 65);
        headerBuffer.put(senderPublicKeyBytes);

        return combine(headerBuffer.array(), cipherText);
    }

    private byte[] combine(byte[]... arrays) {
        int length = 0;
        for (byte[] a : arrays) length += a.length;
        byte[] result = new byte[length];
        int pos = 0;
        for (byte[] a : arrays) {
            System.arraycopy(a, 0, result, pos, a.length);
            pos += a.length;
        }
        return result;
    }

    private byte[] hkdf(byte[] ikm, byte[] salt, byte[] info, int length) throws Exception {
        byte[] prk = hkdfExtract(salt, ikm);
        return hkdfExpand(prk, combine(info, new byte[]{1}), length);
    }

    private byte[] hkdfExtract(byte[] salt, byte[] ikm) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256", BouncyCastleProvider.PROVIDER_NAME);
        mac.init(new SecretKeySpec(salt, "HmacSHA256"));
        return mac.doFinal(ikm);
    }

    private byte[] hkdfExpand(byte[] prk, byte[] info, int length) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256", BouncyCastleProvider.PROVIDER_NAME);
        mac.init(new SecretKeySpec(prk, "HmacSHA256"));
        byte[] result = mac.doFinal(info);
        byte[] out = new byte[length];
        System.arraycopy(result, 0, out, 0, length);
        return out;
    }
}
