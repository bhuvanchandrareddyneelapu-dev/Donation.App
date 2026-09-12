package com.donationapp.dto.resp;

public class PushStatusResponse {

    private boolean supported;
    private String permission;
    private boolean subscribed;
    private String vapidPublicKey;

    public PushStatusResponse() {}

    public PushStatusResponse(boolean supported, String permission, boolean subscribed, String vapidPublicKey) {
        this.supported = supported;
        this.permission = permission;
        this.subscribed = subscribed;
        this.vapidPublicKey = vapidPublicKey;
    }

    public boolean isSupported() { return supported; }
    public void setSupported(boolean supported) { this.supported = supported; }

    public String getPermission() { return permission; }
    public void setPermission(String permission) { this.permission = permission; }

    public boolean isSubscribed() { return subscribed; }
    public void setSubscribed(boolean subscribed) { this.subscribed = subscribed; }

    public String getVapidPublicKey() { return vapidPublicKey; }
    public void setVapidPublicKey(String vapidPublicKey) { this.vapidPublicKey = vapidPublicKey; }
}
