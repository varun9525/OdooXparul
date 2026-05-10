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
  notes?: TripNote[];
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

export interface TripNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  destination?: string;
  likesCount: number;
  createdAt: string;
  author?: {
    username: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

const normalizeUser = (user: any): User => ({
  id: user.id,
  email: user.email,
  username: user.username,
  firstName: user.firstName ?? user.first_name ?? '',
  lastName: user.lastName ?? user.last_name ?? '',
  bio: user.bio,
  avatarUrl: user.avatarUrl ?? user.avatar_url,
});

const normalizeTrip = (trip: any): Trip => ({
  id: trip.id,
  title: trip.title,
  destination: trip.destination,
  startDate: trip.startDate ?? trip.start_date,
  endDate: trip.endDate ?? trip.end_date,
  description: trip.description ?? '',
  imageUrl: trip.imageUrl ?? trip.image_url,
  status: trip.status ?? 'upcoming',
  totalBudget: Number(trip.totalBudget ?? trip.total_budget ?? trip.budget?.total ?? 0),
  currency: trip.currency ?? trip.budget?.currency ?? 'USD',
  budget: trip.budget
    ? {
        total: Number(trip.budget.total ?? 0),
        currency: trip.budget.currency ?? trip.currency ?? 'USD',
        items: (trip.budget.items ?? []).map((item: any) => ({
          ...item,
          amount: Number(item.amount ?? 0),
        })),
      }
    : undefined,
  itinerary: trip.itinerary,
  packingList: trip.packingList?.map((item: any) => ({
    ...item,
    packed: Boolean(item.packed),
  })),
  notes: trip.notes,
  createdAt: trip.createdAt ?? trip.created_at,
});

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

    const payload = await response.json();
    return {
      ...payload,
      data: {
        ...payload.data,
        user: normalizeUser(payload.data.user),
      },
    };
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

    const payload = await response.json();
    return {
      ...payload,
      data: {
        ...payload.data,
        user: normalizeUser(payload.data.user),
      },
    };
  },

  getProfile: async (): Promise<{ success: boolean; data: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const payload = await response.json();
    return {
      ...payload,
      data: normalizeUser(payload.data),
    };
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

    const payload = await response.json();
    return {
      ...payload,
      data: normalizeUser(payload.data),
    };
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

    const payload = await response.json();
    return {
      ...payload,
      data: normalizeTrip(payload.data),
    };
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

    const payload = await response.json();
    return {
      ...payload,
      data: (payload.data ?? []).map(normalizeTrip),
    };
  },

  getTripById: async (tripId: string): Promise<{ success: boolean; data: Trip }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trip');
    }

    const payload = await response.json();
    return {
      ...payload,
      data: normalizeTrip(payload.data),
    };
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

    const payload = await response.json();
    return {
      ...payload,
      data: normalizeTrip(payload.data),
    };
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

  updateBudgetItem: async (tripId: string, itemId: string, itemData: {
    category?: string;
    amount?: number;
    date?: string;
    description?: string;
  }): Promise<{ success: boolean; data: BudgetItem }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/budget/${itemId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error('Failed to update budget item');
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

  updateItineraryItem: async (tripId: string, itemId: string, itemData: {
    title?: string;
    description?: string;
    time?: string;
    date?: string;
    location?: string;
    type?: string;
  }): Promise<{ success: boolean; data: ItineraryItem }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/itinerary/${itemId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error('Failed to update itinerary item');
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

// Notes APIs
export const notesAPI = {
  addNote: async (tripId: string, noteData: {
    title: string;
    content: string;
  }): Promise<{ success: boolean; data: TripNote }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/notes`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      throw new Error('Failed to add note');
    }

    return response.json();
  },

  deleteNote: async (tripId: string, noteId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/notes/${noteId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to delete note');
    }

    return response.json();
  },

  updateNote: async (tripId: string, noteId: string, noteData: {
    title?: string;
    content?: string;
  }): Promise<{ success: boolean; data: TripNote }> => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/notes/${noteId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      throw new Error('Failed to update note');
    }

    return response.json();
  },

  getSummary: async (): Promise<{ success: boolean; data: any }> => {
    const response = await fetch(`${API_BASE_URL}/trips/stats/summary`, {
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trip summary');
    }

    return response.json();
  },
};

export const publicAPI = {
  getSharedTrip: async (tripId: string): Promise<{ success: boolean; data: Trip }> => {
    const response = await fetch(`${API_BASE_URL}/public/trips/${tripId}`, {
      headers: getHeaders(false),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch shared trip');
    }

    const payload = await response.json();
    return {
      ...payload,
      data: normalizeTrip(payload.data),
    };
  },
};

export const communityAPI = {
  getPosts: async (): Promise<{ success: boolean; data: CommunityPost[] }> => {
    const response = await fetch(`${API_BASE_URL}/community`, {
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch community posts');
    }

    return response.json();
  },

  createPost: async (post: { title: string; content: string; destination?: string }): Promise<{ success: boolean; data: CommunityPost }> => {
    const response = await fetch(`${API_BASE_URL}/community`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error('Failed to create community post');
    }

    return response.json();
  },

  likePost: async (postId: string): Promise<{ success: boolean; data: { id: string; likesCount: number } }> => {
    const response = await fetch(`${API_BASE_URL}/community/${postId}/like`, {
      method: 'POST',
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to like post');
    }

    return response.json();
  },
};
