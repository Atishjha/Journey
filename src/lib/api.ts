// src/lib/api.ts
const API_BASE_URL = 'http://localhost:5000/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface TravelPlan {
  id: string;
  user_id: string;
  destination: string;
  budget: number;
  duration: number;
  interests: string[];
  start_date: string;
  end_date: string;
  itinerary?: any;
  total_cost?: number;
  created_at: string;
  updated_at: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async register(email: string, name: string, password: string) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/auth/me');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Travel Plans
  async getTravelPlans(): Promise<TravelPlan[]> {
    return this.request('/travel-plans');
  }

  async createTravelPlan(planData: {
    destination: string;
    budget: number;
    duration: number;
    interests: string[];
    start_date: string;
    end_date: string;
  }): Promise<TravelPlan> {
    return this.request('/travel-plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async getTravelPlan(id: string): Promise<TravelPlan> {
    return this.request(`/travel-plans/${id}`);
  }

  async updateTravelPlan(id: string, updates: Partial<TravelPlan>): Promise<TravelPlan> {
    return this.request(`/travel-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTravelPlan(id: string): Promise<void> {
    return this.request(`/travel-plans/${id}`, {
      method: 'DELETE',
    });
  }

  // AI Itinerary
  async generateItinerary(data: {
    destination: string;
    budget: number;
    duration: number;
    interests: string[];
  }) {
    return this.request('/generate-itinerary', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Places
  async searchPlaces(query: string, location?: string) {
    const params = new URLSearchParams({ query });
    if (location) params.append('location', location);
    
    return fetch(`${API_BASE_URL}/places/search?${params}`)
      .then(res => res.json());
  }

  // Activities
  async addActivity(activityData: {
    plan_id: string;
    name: string;
    description?: string;
    location?: any;
    cost?: number;
    duration?: number;
    category?: string;
    day?: number;
    time_slot?: string;
  }) {
    return this.request('/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  }

  // Expenses
  async getExpenses(planId: string) {
    return this.request(`/expenses?plan_id=${planId}`);
  }

  async addExpense(expenseData: {
    plan_id: string;
    category: string;
    amount: number;
    description: string;
    date: string;
  }) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }
}

export const apiService = new ApiService();
export type { User, TravelPlan, AuthResponse };