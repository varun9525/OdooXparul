const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  imageUrl?: string;
  status: string;
  totalBudget: number;
  currency: string;
  budget?: {
    total: number;
    currency: string;
    items: Array<{
      id: string;
      category: string;
      amount: number;
      date: string;
      description?: string;
    }>;
  };
  itinerary?: Array<{
    id: string;
    title: string;
    description?: string;
    time?: string;
    date: string;
    location?: string;
    type: string;
  }>;
  packingList?: Array<{
    id: string;
    name: string;
    packed: boolean;
    category?: string;
  }>;
  createdAt: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
}

export interface ItineraryItem {
  id: string;
  title: string;
  description?: string;
  time?: string;
  date: string;
  location?: string;
  type: string;
}

export interface PackingItem {
  id: string;
  name: string;
  packed: boolean;
  category?: string;
}

// Helper function to get auth token
const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to get headers with auth
const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Auth APIs
export const authAPI = {
  register: async (email: string, username: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({
        email,
        username,
        password,
        firstName,
        lastName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  getProfile: async (): Promise<{ success: boolean; data: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  updateProfile: async (firstName: string, lastName: string, bio?: string, avatarUrl?: string): Promise<{ success: boolean; data: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ firstName, lastName, bio, avatarUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  },
};

// Trip APIs
export const tripAPI = {
  createTrip: async (tripData: {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    description?: string;
    imageUrl?: string;
    totalBudget?: number;
    currency?: string;
  }): Promise<{ success: boolean; data: Trip }> => {
    const response = await fetch(`${API_BASE_URL}/trips`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(tripData),
    });

    if (!response.ok) {
      throw new Error('Failed to create trip');
    }

    return response.json();
  },

  getTrips: async (status?: string): Promise<{ success: boolean; data: Trip[] }> => {
    let url = `${API_BASE_URL}/trips`;
    if (status) {
      url += `?status=${status}`;
    }

    const response = await fetch(url, {
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trips');
    }

    return response.json();
  },

  getTripById: async (tripId: string): Promise<{ success: boolean; data: Trip }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trip');
    }

    return response.json();
  },

  updateTrip: async (tripId: string, tripData: Partial<Trip>): Promise<{ success: boolean; data: Trip }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(tripData),
    });

    if (!response.ok) {
      throw new Error('Failed to update trip');
    }

    return response.json();
  },

  deleteTrip: async (tripId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to delete trip');
    }

    return response.json();
  },
};

// Budget APIs
export const budgetAPI = {
  addBudgetItem: async (tripId: string, itemData: {
    category: string;
    amount: number;
    date: string;
    description?: string;
  }): Promise<{ success: boolean; data: BudgetItem }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/budget`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error('Failed to add budget item');
    }

    return response.json();
  },

  deleteBudgetItem: async (tripId: string, itemId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/budget/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to delete budget item');
    }

    return response.json();
  },
};

// Itinerary APIs
export const itineraryAPI = {
  addItineraryItem: async (tripId: string, itemData: {
    title: string;
    description?: string;
    time?: string;
    date: string;
    location?: string;
    type: string;
  }): Promise<{ success: boolean; data: ItineraryItem }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/itinerary`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error('Failed to add itinerary item');
    }

    return response.json();
  },

  deleteItineraryItem: async (tripId: string, itemId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/itinerary/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to delete itinerary item');
    }

    return response.json();
  },
};

// Packing APIs
export const packingAPI = {
  addPackingItem: async (tripId: string, itemData: {
    name: string;
    category?: string;
  }): Promise<{ success: boolean; data: PackingItem }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/packing`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error('Failed to add packing item');
    }

    return response.json();
  },

  updatePackingItem: async (tripId: string, itemId: string, packed: boolean): Promise<{ success: boolean; data: PackingItem }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/packing/${itemId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ packed }),
    });

    if (!response.ok) {
      throw new Error('Failed to update packing item');
    }

    return response.json();
  },

  deletePackingItem: async (tripId: string, itemId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/packing/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to delete packing item');
    }

    return response.json();
  },
};
