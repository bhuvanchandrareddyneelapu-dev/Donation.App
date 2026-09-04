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

export interface FestivalConfig {
  communityName: string;
  festivalName: string;
  tagline: string;
  welcomeMessage: string;
  darshanHeading: string;
  darshanMessage: string;
  venue: string;
  organizer: string;
  datesText: string;
  idolImageUrl: string;
  mandapImageUrl: string;
  donationHeading: string;
  donationMessage: string;
  donationPresets: number[];
  contactEmail: string;
  contactPhone: string;
  festivalId: number;
  notifications: FestivalNotification[];
  updates: FestivalUpdateCategory[];
}

export const defaultFestivalConfig: FestivalConfig = {
  communityName: 'Unicode Estates',
  festivalName: 'Ganesh Chaturthi',
  tagline: 'Celebrating Ganesh Chaturthi Together',
  welcomeMessage:
    'Welcome to our Ganesh Chaturthi celebration — a festival of devotion, togetherness and new beginnings.',
  darshanHeading: 'Ganpati Bappa Morya! 🙏',
  darshanMessage:
    'Join the Unicode Estates community as we celebrate Ganesh Chaturthi together with devotion, joy and togetherness.',
  venue: 'Unicode Estates Main Courtyard & Clubhouse',
  organizer: 'Unicode Estates Cultural & Festival Committee',
  datesText: 'Ganesh Chaturthi Festival 2026',
  idolImageUrl: 'https://images.unsplash.com/photo-1605626830588-4663e26b1c5a?w=1200',
  mandapImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200',
  donationHeading: 'Support Our Ganesh Chaturthi Celebration',
  donationMessage:
    'Your contribution helps us celebrate together and support the arrangements and activities of our community festival.',
  donationPresets: [101, 501, 1001, 2001],
  contactEmail: 'events@unicodeestates.org',
  contactPhone: '+91 98765 43210',
  festivalId: 1,
  notifications: [
    {
      id: 'notif-1',
      title: 'Ganesh Chaturthi celebration begins soon',
      category: 'Announcement',
      date: 'Placeholder - Dates coming soon',
      content:
        'We are excited to welcome Lord Ganesha to Unicode Estates. The complete festival schedule will be updated shortly.',
      isImportant: true,
    },
    {
      id: 'notif-2',
      title: 'Puja schedule will be announced',
      category: 'Puja Schedule',
      date: 'Placeholder - Timings coming soon',
      content:
        'Sthapana puja, daily morning & evening aarti timings will be published here for all residents.',
      isImportant: false,
    },
    {
      id: 'notif-3',
      title: 'Mahaprasad timings will be updated here',
      category: 'Prasadam',
      date: 'Placeholder - Details coming soon',
      content:
        'Mahaprasad distribution dates, menu, and volunteer coordination details will be shared soon.',
      isImportant: false,
    },
    {
      id: 'notif-4',
      title: 'Important festival announcements will appear here',
      category: 'Community',
      date: 'Placeholder - Updates coming soon',
      content:
        'Cultural events, eco-friendly visarjan procession, and resident safety guidelines will be communicated here.',
      isImportant: false,
    },
  ],
  updates: [
    {
      id: 'puja',
      title: 'Puja & Rituals',
      iconName: 'flower',
      badge: 'Vedic Pujas',
      description: 'Daily morning and evening Vedic pujas conducted by traditional priests.',
      placeholderText: 'Puja schedule & priest details coming soon',
      items: [
        {
          timeOrDate: 'Day 1 - Morning',
          title: 'Ganesh Prana Pratishtha & Sthapana Puja',
          details: 'Details & priest schedule coming soon for Unicode Estates residents.',
          location: 'Unicode Estates Central Mandap',
        },
        {
          timeOrDate: 'Daily - Morning & Evening',
          title: 'Daily Archana & Nitya Puja',
          details: 'Timings coming soon.',
          location: 'Central Mandap',
        },
      ],
    },
    {
      id: 'aarti',
      title: 'Aarti Timings',
      iconName: 'flame',
      badge: 'Daily Aarti',
      description: 'Join resident families for collective bhajan and evening sandhya aarti.',
      placeholderText: 'Aarti timings coming soon',
      items: [
        {
          timeOrDate: 'Morning Aarti',
          title: 'Prabhat Morning Aarti',
          details: 'Timings coming soon.',
          location: 'Central Mandap',
        },
        {
          timeOrDate: 'Evening Aarti',
          title: 'Maha Sandhya Aarti & Bhajan',
          details: 'Timings coming soon.',
          location: 'Central Mandap',
        },
      ],
    },
    {
      id: 'prasad',
      title: 'Mahaprasadam',
      iconName: 'utensils',
      badge: 'Bhog & Prasad',
      description: 'Community Mahaprasad distribution for all society members and guests.',
      placeholderText: 'Prasad distribution timings coming soon',
      items: [
        {
          timeOrDate: 'Festival Days',
          title: 'Daily Mahaprasadam Kitchen & Modak Distribution',
          details: 'Timings & volunteer serving slots coming soon.',
          location: 'Clubhouse Banquet Hall',
        },
      ],
    },
    {
      id: 'cultural',
      title: 'Cultural Programs',
      iconName: 'music',
      badge: 'Events',
      description: 'Children drawing competitions, bhajan sandhya, and community talent shows.',
      placeholderText: 'Cultural program schedule coming soon',
      items: [
        {
          timeOrDate: 'Evening Events',
          title: 'Unicode Estates Talent Night & Children Competitions',
          details: 'Registration link and program details coming soon.',
          location: 'Amphitheatre / Clubhouse',
        },
      ],
    },
    {
      id: 'visarjan',
      title: 'Visarjan Procession',
      iconName: 'waves',
      badge: 'Immersion',
      description: 'Eco-friendly Ganesha immersion procession and celebration.',
      placeholderText: 'Visarjan route and timings coming soon',
      items: [
        {
          timeOrDate: 'Final Day',
          title: 'Grand Visarjan Shobha Yatra',
          details: 'Procession start time and immersion tank route coming soon.',
          location: 'Unicode Estates Premises',
        },
      ],
    },
    {
      id: 'community',
      title: 'Community Announcements',
      iconName: 'megaphone',
      badge: 'General Info',
      description: 'Volunteer registration, visitor passes, and security guidelines.',
      placeholderText: 'Community guidelines coming soon',
      items: [
        {
          timeOrDate: 'General Info',
          title: 'Volunteer Sign-up & Helpdesk Desk',
          details: 'Contact details and coordinator numbers coming soon.',
          location: 'Society Office',
        },
      ],
    },
  ],
};
