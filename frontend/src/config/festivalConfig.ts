export interface SthapanaInfo {
  date: string;
  time: string;
  location: string;
}

export interface TimeSlot {
  morning: string;
  evening: string;
}

export interface PrasadInfo extends TimeSlot {
  frequency: string;
}

export interface CulturalProgramsInfo {
  numberOfDays: number;
  events: string[];
  dates: string;
  times: string;
  status: string;
}

export interface VisarjanInfo {
  possibleDurations: string;
  selectedDuration: string | null;
  startingTime: string;
  route: string;
  status: string;
}

export interface FestivalNotification {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  isImportant?: boolean;
}

export interface FestivalScheduleItem {
  timeOrDate: string;
  title: string;
  details: string;
  location?: string;
}

export interface FestivalUpdateCategory {
  id: string;
  title: string;
  iconName: 'flower' | 'flame' | 'utensils' | 'music' | 'waves' | 'megaphone';
  badge: string;
  description: string;
  placeholderText: string;
  items: FestivalScheduleItem[];
}

export interface NimajjanClosingMessage {
  lines: string[];
  communityText: string;
  gratitudeText: string;
}

export interface NimajjanInfo {
  title: string;
  subheading: string;
  startingTime: string;
  duration: string;
  route: string;
  chants: string[];
  closingMessage: NimajjanClosingMessage;
}

export interface FestivalConfig {
  communityName: string;
  festivalName: string;
  festivalType: string;
  festivalYear: string;
  tagline: string;
  welcomeMessage: string;
  darshanHeading: string;
  darshanSubheading: string;
  darshanMessage: string;
  venue: string;
  organizer: string;
  datesText: string;
  idolImageUrl: string;
  mandapImageUrl: string;
  images: {
    ganeshIdol: string;
  };
  donationHeading: string;
  donationMessage: string;
  donationPresets: number[];
  donationPurposes: string[];
  contactEmail: string;
  contactPhone: string;
  festivalId: number;

  // Specific structured sections
  sthapana: SthapanaInfo;
  puja: TimeSlot;
  aarti: TimeSlot;
  prasad: PrasadInfo;
  culturalPrograms: CulturalProgramsInfo;
  visarjan: VisarjanInfo;
  nimajjan: NimajjanInfo;

  notifications: FestivalNotification[];
  updates: FestivalUpdateCategory[];
}

export const defaultFestivalConfig: FestivalConfig = {
  communityName: 'Unicode Estates',
  festivalName: 'Ganesh Chaturthi Celebrations 2026',
  festivalType: 'Ganesh Chaturthi',
  festivalYear: '2026',
  tagline: 'Together in devotion. Together as a community.',
  welcomeMessage: 'Together in devotion. Together as a community.',
  darshanHeading: 'Ganpati Bappa Morya! 🙏',
  darshanSubheading: 'Ganesh Darshan — Unicode Estates',
  darshanMessage:
    'Welcome to the Unicode Estates Ganesh Chaturthi celebration.',
  venue: 'Unicode Estates',
  organizer: 'Unicode Estates Cultural & Festival Committee',
  datesText: '14 September 2026',
  idolImageUrl: '/assets/images/unicode-estates-ganesh-idol.png',
  mandapImageUrl: '/assets/images/unicode-estates-ganesh-idol.png',
  images: {
    ganeshIdol: '/assets/images/unicode-estates-ganesh-idol.png',
  },
  donationHeading: 'Support Unicode Estates Ganesh Chaturthi',
  donationMessage:
    'Your contribution helps our community come together to celebrate Ganpati Bappa.',
  donationPresets: [101, 501, 1001, 2001],
  donationPurposes: [
    'Ganesh idol',
    'Mandap decoration',
    'Puja materials',
    'Prasad & Mahaprasad',
    'Cultural programs',
    'Sound and lighting arrangements',
    'Community activities',
    'Other festival expenses — Update Soon',
  ],
  contactEmail: 'events@unicodeestates.org',
  contactPhone: '+91 98765 43210',
  festivalId: 1,

  // Sthapana details
  sthapana: {
    date: '14 September 2026',
    time: 'Update Soon',
    location: 'Unicode Estates',
  },

  // Puja details
  puja: {
    morning: 'Update Soon',
    evening: 'Update Soon',
  },

  // Aarti details
  aarti: {
    morning: 'Update Soon',
    evening: 'Update Soon',
  },

  // Prasad details
  prasad: {
    frequency: 'Daily',
    morning: 'Update Soon',
    evening: 'Update Soon',
  },

  // Cultural Programs details
  culturalPrograms: {
    numberOfDays: 5,
    events: [
      'Day 1 — Event details coming soon',
      'Day 2 — Event details coming soon',
      'Day 3 — Event details coming soon',
      'Day 4 — Event details coming soon',
      'Day 5 — Event details coming soon',
    ],
    dates: 'Update Soon',
    times: 'Update Soon',
    status: 'One community/cultural event is planned each day for 5 days. Event details will be announced soon.',
  },

  // Visarjan details
  visarjan: {
    possibleDurations: '5 or 7 days',
    selectedDuration: null,
    startingTime: '5:00 PM',
    route: 'Update Soon',
    status: 'Visarjan: 5 or 7-day celebration — final schedule will be announced soon.',
  },

  // Nimajjan details & chants
  nimajjan: {
    title: 'Ganesh Nimajjan Utsav',
    subheading: 'With devotion in our hearts, we bid farewell to Ganpati Bappa.',
    startingTime: '5:00 PM',
    duration: '5 or 7 days — Update Soon',
    route: 'Update Soon',
    chants: [
      'Ganpati Bappa Morya! 🙏',
      'Mangal Murti Morya!',
      'Ganpati Bappa — Morya!',
      'Bappa Morya — Morya!',
      'Ganpati Bappa Morya — Pudchya Varshi Lavkar Ya!',
      'Mangal Murti Morya — Pudchya Varshi Lavkar Ya!',
      'Ganpati Bappa Morya — Unicode Estates Morya!',
      'Bappa Bappa Morya — Mangal Murti Morya!',
      'Ganpati Bappa Morya — Sarvanchya Ghari Anand Yao!',
      'Ganpati Bappa Morya — Pudchya Varshi Lavkar Ya!',
    ],
    closingMessage: {
      lines: [
        'Until we meet again, Bappa. ❤️',
        'Ganpati Bappa Morya!',
        'Pudchya Varshi Lavkar Ya!',
      ],
      communityText: 'From the entire Unicode Estates community',
      gratitudeText: 'Thank you, Bappa, for bringing us together.',
    },
  },

  // Data-driven notifications
  notifications: [
    {
      id: 'notif-sthapana',
      title: 'Ganesh Sthapana',
      category: 'Sthapana',
      date: '14 September 2026',
      content: 'Ganesh Sthapana will take place on 14 September 2026 at Unicode Estates.',
      isImportant: true,
    },
    {
      id: 'notif-puja',
      title: 'Puja Timings',
      category: 'Puja Schedule',
      date: 'Update Soon',
      content: 'Morning and evening puja timings will be announced soon.',
      isImportant: false,
    },
    {
      id: 'notif-aarti',
      title: 'Aarti',
      category: 'Aarti',
      date: 'Update Soon',
      content: 'Aarti timings will be updated soon.',
      isImportant: false,
    },
    {
      id: 'notif-prasad',
      title: 'Mahaprasad',
      category: 'Prasadam',
      date: 'Daily',
      content: 'Mahaprasad will be available daily. Morning and evening timings will be announced soon.',
      isImportant: false,
    },
    {
      id: 'notif-cultural',
      title: 'Cultural Programs',
      category: 'Events',
      date: '5 Days Planned',
      content: 'One community/cultural event is planned each day for 5 days. Event details will be announced soon.',
      isImportant: false,
    },
    {
      id: 'notif-visarjan',
      title: 'Visarjan',
      category: 'Visarjan',
      date: 'Starting 5:00 PM',
      content: 'Visarjan schedule and route will be announced soon.',
      isImportant: false,
    },
  ],

  // Updates categories tabs data
  updates: [
    {
      id: 'puja',
      title: 'Puja',
      iconName: 'flower',
      badge: 'Vedic Pujas',
      description: 'Daily morning and evening pujas.',
      placeholderText: 'Puja schedule details coming soon',
      items: [
        {
          timeOrDate: 'Morning Puja',
          title: 'Morning Puja & Archana',
          details: 'Update Soon',
          location: 'Unicode Estates',
        },
        {
          timeOrDate: 'Evening Puja',
          title: 'Evening Nitya Puja',
          details: 'Update Soon',
          location: 'Unicode Estates',
        },
      ],
    },
    {
      id: 'aarti',
      title: 'Aarti',
      iconName: 'flame',
      badge: 'Daily Aarti',
      description: 'Daily morning and evening sandhya aarti.',
      placeholderText: 'Aarti timings coming soon',
      items: [
        {
          timeOrDate: 'Morning Aarti',
          title: 'Morning Sandhya Aarti',
          details: 'Update Soon',
          location: 'Unicode Estates',
        },
        {
          timeOrDate: 'Evening Aarti',
          title: 'Evening Sandhya Aarti',
          details: 'Update Soon',
          location: 'Unicode Estates',
        },
      ],
    },
    {
      id: 'prasad',
      title: 'Prasad',
      iconName: 'utensils',
      badge: 'Daily Mahaprasad',
      description: 'Mahaprasad will be available daily.',
      placeholderText: 'Prasad timings coming soon',
      items: [
        {
          timeOrDate: 'Morning',
          title: 'Morning Mahaprasad',
          details: 'Update Soon',
          location: 'Unicode Estates',
        },
        {
          timeOrDate: 'Evening',
          title: 'Evening Mahaprasad',
          details: 'Update Soon',
          location: 'Unicode Estates',
        },
      ],
    },
    {
      id: 'cultural',
      title: 'Cultural Programs',
      iconName: 'music',
      badge: '5-Day Celebration',
      description: 'Five days of community and cultural activities are planned.',
      placeholderText: 'Cultural program schedule coming soon',
      items: [
        {
          timeOrDate: 'Day 1',
          title: 'Day 1 Cultural Event',
          details: 'Event details coming soon',
          location: 'Unicode Estates',
        },
        {
          timeOrDate: 'Day 2',
          title: 'Day 2 Cultural Event',
          details: 'Event details coming soon',
          location: 'Unicode Estates',
        },
        {
          timeOrDate: 'Day 3',
          title: 'Day 3 Cultural Event',
          details: 'Event details coming soon',
          location: 'Unicode Estates',
        },
        {
          timeOrDate: 'Day 4',
          title: 'Day 4 Cultural Event',
          details: 'Event details coming soon',
          location: 'Unicode Estates',
        },
        {
          timeOrDate: 'Day 5',
          title: 'Day 5 Cultural Event',
          details: 'Event details coming soon',
          location: 'Unicode Estates',
        },
      ],
    },
    {
      id: 'visarjan',
      title: 'Visarjan',
      iconName: 'waves',
      badge: 'Immersion',
      description: 'Visarjan schedule is currently being finalized.',
      placeholderText: 'Final Visarjan details will be announced soon.',
      items: [
        {
          timeOrDate: 'Duration',
          title: 'Celebration Duration',
          details: '5 or 7-day celebration — final schedule will be announced soon.',
        },
        {
          timeOrDate: 'Start Time',
          title: 'Procession Starting Time',
          details: '5:00 PM',
        },
        {
          timeOrDate: 'Route',
          title: 'Visarjan Route',
          details: 'Update Soon',
        },
      ],
    },
    {
      id: 'announcements',
      title: 'Announcements',
      iconName: 'megaphone',
      badge: 'Updates',
      description: 'Festival announcements will be updated here.',
      placeholderText: 'Official updates will appear here',
      items: [
        {
          timeOrDate: 'General Info',
          title: 'Unicode Estates Community Updates',
          details: 'Festival announcements will be updated here.',
          location: 'Unicode Estates',
        },
      ],
    },
  ],
};
