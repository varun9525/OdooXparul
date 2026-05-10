export type TripStatus = 'upcoming' | 'active' | 'past';

export interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface ItineraryItem {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  location: string;
  type: 'flight' | 'accommodation' | 'activity' | 'dining';
}

export interface PackingItem {
  id: string;
  name: string;
  packed: boolean;
  category: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  status: TripStatus;
  budget: {
    total: number;
    currency: string;
    items: BudgetItem[];
  };
  itinerary: ItineraryItem[];
  packingList: PackingItem[];
}