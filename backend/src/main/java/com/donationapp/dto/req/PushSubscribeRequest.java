package com.donationapp.dto.req;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PushSubscribeRequest {

    @NotBlank(message = "Endpoint is required")
    private String endpoint;

    @NotNull(message = "Keys are required")
    private PushKeys keys;

    private Long festivalId = 1L;

    public static class PushKeys {
        @NotBlank(message = "p256dh is required")
        private String p256dh;

        @NotBlank(message = "auth is required")
        private String auth;

        public String getP256dh() { return p256dh; }
        public void setP256dh(String p256dh) { this.p256dh = p256dh; }

        public String getAuth() { return auth; }
        public void setAuth(String auth) { this.auth = auth; }
    }

    public String getEndpoint() { return endpoint; }
    public void setEndpoint(String endpoint) { this.endpoint = endpoint; }

    public PushKeys getKeys() { return keys; }
    public void setKeys(PushKeys keys) { this.keys = keys; }

    public Long getFestivalId() { return festivalId; }
    public void setFestivalId(Long festivalId) { this.festivalId = festivalId; }
}
