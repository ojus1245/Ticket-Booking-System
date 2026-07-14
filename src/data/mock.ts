import { addDays, format } from 'date-fns';

export interface Event {
  id: string;
  title: string;
  category: 'Concert' | 'Sports' | 'Theater' | 'Conference' | 'Festival';
  date: string;
  time: string;
  location: string;
  venue: string;
  price: number;
  image: string;
  description: string;
  organizer: string;
  availableTickets: number;
  availableSeats?: number;
  rating?: number;
  amenities?: string[];
}

const today = new Date();

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Neon Nights Music Festival',
    category: 'Festival',
    date: format(addDays(today, 14), 'yyyy-MM-dd'),
    time: '18:00',
    location: 'Miami, FL',
    venue: 'Bayfront Park',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Experience the ultimate electronic music festival with top DJs from around the world. Three days of non-stop music, immersive art installations, and unforgettable memories under the Miami sky.',
    organizer: 'RaveNation',
    availableTickets: 250,
    availableSeats: 250,
    rating: 4.8,
    amenities: ['Open Bar', 'VIP Lounge', 'Food Court', 'Parking'],
  },
  {
    id: 'e2',
    title: 'Symphony Under The Stars',
    category: 'Concert',
    date: format(addDays(today, 5), 'yyyy-MM-dd'),
    time: '19:30',
    location: 'New York, NY',
    venue: 'Central Park Great Lawn',
    price: 85.00,
    image: 'https://images.unsplash.com/photo-1541445976433-f466f228a409?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'A magical evening featuring the New York Philharmonic performing classical masterpieces as the sun sets over the city skyline.',
    organizer: 'NY Philharmonic',
    availableTickets: 120,
    availableSeats: 120,
    rating: 4.6,
    amenities: ['Reserved Seating', 'Program Guide', 'Bar Access'],
  },
  {
    id: 'e3',
    title: 'Championship Finals: East vs West',
    category: 'Sports',
    date: format(addDays(today, 20), 'yyyy-MM-dd'),
    time: '20:00',
    location: 'Chicago, IL',
    venue: 'United Center',
    price: 299.50,
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'The ultimate showdown between the two top teams of the season. Witness history in the making with high-stakes action and incredible athleticism.',
    organizer: 'National League',
    availableTickets: 45,
    availableSeats: 45,
    rating: 4.9,
    amenities: ['Premium View', 'Concessions', 'Merchandise Stand'],
  },
  {
    id: 'e4',
    title: 'TechFuture Summit 2026',
    category: 'Conference',
    date: format(addDays(today, 30), 'yyyy-MM-dd'),
    time: '09:00',
    location: 'San Francisco, CA',
    venue: 'Moscone Center',
    price: 499.00,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'Join industry leaders, innovators, and visionaries for a three-day summit exploring the cutting-edge technologies shaping our tomorrow. Keynotes, workshops, and networking.',
    organizer: 'Tech Innovators Org',
    availableTickets: 500,
    availableSeats: 500,
    rating: 4.5,
    amenities: ['Meals Included', 'Workshop Access', 'Certificate', 'Networking Dinner'],
  },
  {
    id: 'e5',
    title: 'Hamlet: A Modern Interpretation',
    category: 'Theater',
    date: format(addDays(today, 10), 'yyyy-MM-dd'),
    time: '19:00',
    location: 'London, UK',
    venue: 'Globe Theatre',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'A breathtaking contemporary staging of Shakespeare\'s classic tragedy, exploring themes of madness, revenge, and moral corruption in a modern corporate setting.',
    organizer: 'Royal Shakespeare Company',
    availableTickets: 80,
    availableSeats: 80,
    rating: 4.7,
    amenities: ['Pre-Show Drinks', 'Program', 'Coat Check'],
  },
  {
    id: 'e6',
    title: 'Indie Rock Showcase',
    category: 'Concert',
    date: format(addDays(today, 2), 'yyyy-MM-dd'),
    time: '21:00',
    location: 'Austin, TX',
    venue: 'The Moody Theater',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'Discover the next big sound with a lineup of the most promising emerging indie rock bands from across the country.',
    organizer: 'Austin Live Sounds',
    availableTickets: 15,
    availableSeats: 15,
    rating: 4.3,
    amenities: ['Standing Area', 'Bar', 'Merch Table'],
  }
];

export const CATEGORIES = [
  'All',
  'Concert',
  'Sports',
  'Theater',
  'Conference',
  'Festival'
];

// Mock booking data for Dashboard
export interface Booking {
  id: string;
  eventId: string;
  bookingDate: string;
  seats: string[];
  total: number;
  status: 'upcoming' | 'past' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'BK001', eventId: 'e1', bookingDate: format(addDays(today, -2), 'yyyy-MM-dd'), seats: ['C4', 'C5'], total: 329.98, status: 'upcoming', paymentStatus: 'paid' },
  { id: 'BK002', eventId: 'e2', bookingDate: format(addDays(today, -5), 'yyyy-MM-dd'), seats: ['A1'], total: 93.50, status: 'upcoming', paymentStatus: 'paid' },
  { id: 'BK003', eventId: 'e5', bookingDate: format(addDays(today, -30), 'yyyy-MM-dd'), seats: ['D3', 'D4', 'D5'], total: 396.00, status: 'past', paymentStatus: 'paid' },
  { id: 'BK004', eventId: 'e6', bookingDate: format(addDays(today, -60), 'yyyy-MM-dd'), seats: ['B2'], total: 49.50, status: 'cancelled', paymentStatus: 'refunded' },
];
