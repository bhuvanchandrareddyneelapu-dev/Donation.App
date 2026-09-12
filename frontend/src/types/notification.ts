export type NotificationType =
  | 'FESTIVAL_COUNTDOWN'
  | 'PUJA_REMINDER'
  | 'EVENT_REMINDER'
  | 'EVENT_STARTED'
  | 'DECORATION'
  | 'CULTURAL_PROGRAM'
  | 'DANCE_PROGRAM'
  | 'MUSIC_PROGRAM'
  | 'PRASAD'
  | 'VOLUNTEER_REQUEST'
  | 'PRIEST_DELAY'
  | 'EVENT_DELAY'
  | 'NIMAJJANAM_UPDATE'
  | 'IMPORTANT_NOTICE'
  | 'GENERAL_ANNOUNCEMENT';

export type NotificationPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type RepeatMode =
  | 'ONCE_PER_SESSION'
  | 'ONCE_PER_DAY'
  | 'EVERY_OPEN'
  | 'UNTIL_DISMISSED'
  | 'SCHEDULED_WINDOW';

export interface FestivalNotification {
  id: number;
  festivalId: number;
  title: string;
  message: string;
  notificationType: NotificationType;
  priority: NotificationPriority;
  scheduledStart?: string;
  scheduledEnd?: string;
  eventDate?: string;
  eventTime?: string;
  enabled: boolean;
  dismissible: boolean;
  repeatMode: RepeatMode;
  displayDurationSeconds?: number;
  actionLabel?: string;
  actionUrl?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  sendPush?: boolean;
  pushSent?: boolean;
  pushSentAt?: string;
  countdownText?: string;
  timeToEventMinutes?: number;
}

export interface FestivalNotificationRequest {
  festivalId: number;
  title: string;
  message: string;
  notificationType: NotificationType;
  priority?: NotificationPriority;
  scheduledStart?: string;
  scheduledEnd?: string;
  eventDate?: string;
  eventTime?: string;
  enabled?: boolean;
  dismissible?: boolean;
  repeatMode?: RepeatMode;
  displayDurationSeconds?: number;
  actionLabel?: string;
  actionUrl?: string;
  sendPush?: boolean;
}
