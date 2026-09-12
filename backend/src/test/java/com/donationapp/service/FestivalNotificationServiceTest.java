package com.donationapp.service;

import com.donationapp.dto.req.FestivalNotificationRequest;
import com.donationapp.dto.resp.FestivalNotificationResponse;
import com.donationapp.entity.Festival;
import com.donationapp.entity.FestivalNotification;
import com.donationapp.entity.FestivalSchedule;
import com.donationapp.entity.enums.NotificationPriority;
import com.donationapp.entity.enums.NotificationType;
import com.donationapp.entity.enums.RepeatMode;
import com.donationapp.repository.FestivalNotificationRepository;
import com.donationapp.repository.FestivalRepository;
import com.donationapp.repository.FestivalScheduleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class FestivalNotificationServiceTest {

    @Mock
    private FestivalNotificationRepository notificationRepository;

    @Mock
    private FestivalRepository festivalRepository;

    @Mock
    private FestivalScheduleRepository scheduleRepository;

    @InjectMocks
    private FestivalNotificationService notificationService;

    private Festival festival;

    @BeforeEach
    void setUp() {
        festival = new Festival();
        festival.setId(1L);
        festival.setName("Unicode Estates Ganesh Chaturthi 2026");
        festival.setVenue("Unicode Estates Celebration Grounds");
        festival.setInstallationDate(LocalDate.now(FestivalNotificationService.ASIA_KOLKATA).plusDays(2));
        festival.setImmersionDate(LocalDate.now(FestivalNotificationService.ASIA_KOLKATA).plusDays(10));
    }

    @Test
    void testGetActiveNotifications_IncludesCountdownAndPriorityOrdering() {
        LocalDateTime now = notificationService.getCurrentTime();

        FestivalNotification n1 = new FestivalNotification();
        n1.setId(101L);
        n1.setFestival(festival);
        n1.setTitle("Puja Delayed");
        n1.setMessage("Morning Puja is delayed by 30 mins.");
        n1.setNotificationType(NotificationType.PRIEST_DELAY);
        n1.setPriority(NotificationPriority.CRITICAL);
        n1.setEnabled(true);
        n1.setUpdatedAt(now);

        FestivalNotification n2 = new FestivalNotification();
        n2.setId(102L);
        n2.setFestival(festival);
        n2.setTitle("Mandap Decoration");
        n2.setMessage("Decoration starts at 5 PM.");
        n2.setNotificationType(NotificationType.DECORATION);
        n2.setPriority(NotificationPriority.NORMAL);
        n2.setEnabled(true);
        n2.setUpdatedAt(now);

        when(notificationRepository.findActiveInWindow(eq(1L), any(LocalDateTime.class)))
                .thenReturn(Arrays.asList(n2, n1));
        when(festivalRepository.findById(1L)).thenReturn(Optional.of(festival));
        when(scheduleRepository.findByFestivalIdOrderByDateTimeAsc(1L)).thenReturn(Collections.emptyList());

        List<FestivalNotificationResponse> active = notificationService.getActiveNotifications(1L);

        assertNotNull(active);
        assertFalse(active.isEmpty());
        // Highest priority (CRITICAL) should be first
        assertEquals("Puja Delayed", active.get(0).getTitle());
        assertEquals(NotificationPriority.CRITICAL, active.get(0).getPriority());
    }

    @Test
    void testGenerateCountdownNotification_CalculatesDaysToGo() {
        LocalDate today = notificationService.getCurrentDate();
        LocalDateTime now = notificationService.getCurrentTime();

        festival.setInstallationDate(today.plusDays(2));

        FestivalNotificationResponse countdown = notificationService.generateCountdownNotification(festival, today, now);

        assertNotNull(countdown);
        assertEquals(NotificationType.FESTIVAL_COUNTDOWN, countdown.getNotificationType());
        assertTrue(countdown.getMessage().contains("2 days away"));
        assertEquals("2 DAYS TO GO", countdown.getCountdownText());
    }

    @Test
    void testCreateNotification_SavesAndReturnsDTO() {
        FestivalNotificationRequest req = new FestivalNotificationRequest();
        req.setFestivalId(1L);
        req.setTitle("Nimajjanam Timing Update");
        req.setMessage("Nimajjanam delayed to 7:30 PM.");
        req.setNotificationType(NotificationType.NIMAJJANAM_UPDATE);
        req.setPriority(NotificationPriority.CRITICAL);
        req.setRepeatMode(RepeatMode.UNTIL_DISMISSED);

        when(festivalRepository.findById(1L)).thenReturn(Optional.of(festival));
        when(notificationRepository.save(any(FestivalNotification.class))).thenAnswer(inv -> {
            FestivalNotification fn = inv.getArgument(0);
            fn.setId(201L);
            return fn;
        });

        FestivalNotificationResponse response = notificationService.createNotification(req, "SUPER_ADMIN");

        assertNotNull(response);
        assertEquals(201L, response.getId());
        assertEquals("Nimajjanam Timing Update", response.getTitle());
        assertEquals(NotificationPriority.CRITICAL, response.getPriority());
    }
}
