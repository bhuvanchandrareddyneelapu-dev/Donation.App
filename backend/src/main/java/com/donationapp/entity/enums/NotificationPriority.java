package com.donationapp.entity.enums;

public enum NotificationPriority {
    CRITICAL,
    HIGH,
    NORMAL,
    LOW;

    public int getRank() {
        return switch (this) {
            case CRITICAL -> 0;
            case HIGH -> 1;
            case NORMAL -> 2;
            case LOW -> 3;
        };
    }
}
