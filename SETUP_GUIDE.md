# 🚀 Traveloop - Full Stack Setup Guide

## Project Structure

```
odoo/
├── frontend/          # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/           # Node.js + Express backend
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── ...
└── SETUP_GUIDE.md    # This file
```

## Phase 1: Backend Setup

### Step 1: Install PostgreSQL

**On Windows:**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and choose:
   - Password: `postgres` (or remember your password)
   - Port: `5432` (default)
3. After installation, open pgAdmin or Command Prompt

**Create Database:**
```sql
-- Open pgAdmin or psql and run:
CREATE DATABASE traveloop;
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables

The `.env` file is already created. Update it if needed:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres         # Change if you set different password
DB_NAME=traveloop
PORT=5000
JWT_SECRET=traveloop_super_secret_key_change_this_in_production_12345
FRONTEND_URL=http://localhost:5173
```

### Step 4: Build and Run Backend

**First time setup (build TypeScript):**
```bash
npm run build
```

**Run the server:**
```bash
npm start
```

**Development mode (with auto-reload):**
```bash
npm run dev
```

You should see:
```
✓ Server is running on http://localhost:5000
✓ Frontend URL configured: http://localhost:5173
```

### Step 5: Test Backend API

Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/api/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Should return something like:
# {"success":true,"data":{"user":{...},"token":"eyJhbGc..."}}
```

---

## Phase 2: Frontend Integration

### Step 1: Set Up API Client

Create a new file: `frontend/src/services/api.ts`

```typescript
const API_URL = 'http://localhost:5000/api';

export const api = {
  // Auth
  register: (data: any) => 
    fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  login: (email: string, password: string) =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(r => r.json()),

  getProfile: (token: string) =>
    fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()),

  // Trips
  getTrips: (token: string) =>
    fetch(`${API_URL}/trips`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()),

  createTrip: (token: string, data: any) =>
    fetch(`${API_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  getTrip: (token: string, tripId: string) =>
    fetch(`${API_URL}/trips/${tripId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()),

  // Budget
  addBudgetItem: (token: string, tripId: string, data: any) =>
    fetch(`${API_URL}/trips/${tripId}/budget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),
};
```

### Step 2: Update Login Component

In your `Login.tsx` or wherever you handle authentication:

```typescript
import { api } from '../services/api';

// On login submit:
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await api.login(email, password);
    if (response.success) {
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Redirect to dashboard
      navigate('/');
    } else {
      // Show error message
      console.error(response.message);
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Step 3: Protect Routes with Auth

```typescript
// Add to your routes.tsx
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};

// Use in routes:
{
  path: '/dashboard',
  element: <ProtectedRoute element={<Dashboard />} />
}
```

### Step 4: Create a Context for Auth State (Optional but recommended)

```typescript
// frontend/src/context/AuthContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    if (response.success) {
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
```

---

## Phase 3: Running Everything Together

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### Access Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Health Check: `http://localhost:5000/api/health`

---

## Authentication Flow

1. **Register:**
   - User enters email, username, password
   - Backend hashes password with bcryptjs
   - Creates user in database
   - Returns JWT token

2. **Login:**
   - User enters email, password
   - Backend verifies password
   - Returns JWT token
   - Frontend stores token in localStorage

3. **Protected Requests:**
   - Include token in Authorization header
   - Format: `Bearer {token}`
   - Backend validates token
   - If valid, processes request
   - If invalid, returns 401 Unauthorized

---

## Database Schema Visualization

```
Users
├─ id (UUID, PK)
├─ email
├─ username
├─ password (hashed)
├─ first_name, last_name
└─ avatar_url

Trips (user_id FK)
├─ id (UUID, PK)
├─ title, destination
├─ start_date, end_date
├─ status (upcoming/active/past)
└─ total_budget

Budget Items (trip_id FK)
├─ id (UUID, PK)
├─ category, amount
├─ date, description

Itinerary Items (trip_id FK)
├─ id (UUID, PK)
├─ title, description
├─ date, time, location

Packing Items (trip_id FK)
├─ id (UUID, PK)
├─ name, category
├─ packed (boolean)
```

---

## Common Issues & Solutions

### Issue: "Cannot find module 'pg'"
**Solution:** Run `npm install` in backend directory

### Issue: "ECONNREFUSED - PostgreSQL connection failed"
**Solution:**
1. Ensure PostgreSQL is running
2. Check DB credentials in `.env`
3. Verify database exists: `psql -U postgres -l`

### Issue: "JWT token expired"
**Solution:** User needs to login again to get a new token

### Issue: CORS error from frontend
**Solution:** 
1. Ensure `FRONTEND_URL` in `.env` matches your frontend URL
2. Restart backend after changing .env

---

## Next Steps

1. ✅ Backend API ready
2. ✅ Database set up
3. ✅ Authentication implemented
4. Next: Integrate frontend with API
5. Next: Add community features
6. Next: Deploy to production

---

## API Documentation

### Base URL: `http://localhost:5000/api`

### Auth Endpoints
```
POST   /auth/register       - Register user
POST   /auth/login          - Login user
GET    /auth/profile        - Get user profile
PUT    /auth/profile        - Update user profile
```

### Trip Endpoints (All require auth header)
```
GET    /trips               - Get all user's trips
POST   /trips               - Create new trip
GET    /trips/:tripId       - Get trip details
PUT    /trips/:tripId       - Update trip
DELETE /trips/:tripId       - Delete trip

POST   /trips/:tripId/budget       - Add budget item
DELETE /trips/:tripId/budget/:id   - Delete budget item

POST   /trips/:tripId/itinerary    - Add itinerary item
DELETE /trips/:tripId/itinerary/:id- Delete itinerary item

POST   /trips/:tripId/packing      - Add packing item
PUT    /trips/:tripId/packing/:id  - Update packing status
DELETE /trips/:tripId/packing/:id  - Delete packing item
```

---

## Need Help?

- Check backend console for errors
- Use browser DevTools Network tab to inspect API calls
- Verify `.env` configuration
- Check PostgreSQL is running: `psql -U postgres`

Good luck with your hackathon! 🚀
