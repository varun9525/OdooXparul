import { Trip } from './types';

export const mockTrips: Trip[] = [
  {
    id: 't1',
    title: 'Neon Nights & Temples',
    destination: 'Tokyo, Japan',
    startDate: '2026-06-10',
    endDate: '2026-06-24',
    imageUrl: 'https://images.unsplash.com/photo-1730385835399-4d0f24898919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMG5pZ2h0JTIwc3RyZWV0JTIwbmVvbnxlbnwxfHx8fDE3NzgzODQyMjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'upcoming',
    budget: {
      total: 3500,
      currency: 'USD',
      items: [
        { id: 'b1', category: 'Flights', amount: 1200, date: '2026-01-15', description: 'Round trip LAX to HND' },
        { id: 'b2', category: 'Accommodation', amount: 800, date: '2026-02-10', description: 'Shinjuku Hotel' },
        { id: 'b3', category: 'Activities', amount: 300, date: '2026-06-12', description: 'TeamLab Planets & DisneySea' },
        { id: 'b4', category: 'Food', amount: 500, date: '2026-06-15', description: 'Sushi, Ramen, Street Food' },
      ],
    },
    itinerary: [
      { id: 'i1', title: 'Arrival at HND', description: 'Land at Haneda Airport, pick up pocket wifi.', time: '14:30', date: '2026-06-10', location: 'Haneda Airport', type: 'flight' },
      { id: 'i2', title: 'Check-in', description: 'Settle into the hotel in Shinjuku.', time: '16:00', date: '2026-06-10', location: 'Shinjuku', type: 'accommodation' },
      { id: 'i3', title: 'Golden Gai', description: 'Explore narrow alleys and grab yakitori.', time: '19:00', date: '2026-06-10', location: 'Golden Gai, Shinjuku', type: 'dining' },
      { id: 'i4', title: 'Senso-ji Temple', description: 'Visit Tokyo’s oldest temple.', time: '09:00', date: '2026-06-11', location: 'Asakusa', type: 'activity' },
    ],
    packingList: [
      { id: 'p1', name: 'Passport', packed: true, category: 'Essentials' },
      { id: 'p2', name: 'Power Bank', packed: false, category: 'Electronics' },
      { id: 'p3', name: 'Comfortable Shoes', packed: false, category: 'Clothing' },
      { id: 'p4', name: 'Yen Cash', packed: false, category: 'Essentials' },
    ],
  },
  {
    id: 't2',
    title: 'Alpine Escape',
    destination: 'Swiss Alps',
    startDate: '2026-08-05',
    endDate: '2026-08-15',
    imageUrl: 'https://images.unsplash.com/photo-1723045278433-9377b73e8e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzgzODQyMjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'upcoming',
    budget: {
      total: 4200,
      currency: 'USD',
      items: [
        { id: 'b5', category: 'Flights', amount: 950, date: '2026-03-01', description: 'JFK to ZRH' },
        { id: 'b6', category: 'Accommodation', amount: 1500, date: '2026-03-15', description: 'Zermatt Chalet' },
        { id: 'b7', category: 'Transport', amount: 450, date: '2026-04-01', description: 'Swiss Travel Pass' },
      ],
    },
    itinerary: [
      { id: 'i5', title: 'Matterhorn Glacier Paradise', description: 'Cable car to the highest station in Europe.', time: '10:00', date: '2026-08-06', location: 'Zermatt', type: 'activity' },
    ],
    packingList: [
      { id: 'p5', name: 'Hiking Boots', packed: true, category: 'Clothing' },
      { id: 'p6', name: 'Windbreaker', packed: false, category: 'Clothing' },
    ],
  },
  {
    id: 't3',
    title: 'Aegean Sunsets',
    destination: 'Santorini, Greece',
    startDate: '2025-09-10',
    endDate: '2025-09-20',
    imageUrl: 'https://images.unsplash.com/photo-1676730056228-7e38cbb88edc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3JpbmklMjBncmVlY2UlMjBzdW5zZXR8ZW58MXx8fHwxNzc4MzUxMDcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'past',
    budget: {
      total: 2800,
      currency: 'USD',
      items: [
        { id: 'b8', category: 'Accommodation', amount: 1200, date: '2025-05-10', description: 'Oia Cave Hotel' },
      ],
    },
    itinerary: [],
    packingList: [],
  }
];