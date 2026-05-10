# Traveloop Backend API

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd backend
npm install
```

2. **Create PostgreSQL Database**
```sql
CREATE DATABASE traveloop;
```

3. **Configure Environment Variables**
```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=traveloop
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
FRONTEND_URL=http://localhost:5173
```

4. **Build and Run**
```bash
npm run build
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Trips
- `GET /api/trips` - Get all user trips (requires auth)
- `POST /api/trips` - Create new trip (requires auth)
- `GET /api/trips/:tripId` - Get trip details (requires auth)
- `PUT /api/trips/:tripId` - Update trip (requires auth)
- `DELETE /api/trips/:tripId` - Delete trip (requires auth)

### Budget Items
- `POST /api/trips/:tripId/budget` - Add budget item
- `DELETE /api/trips/:tripId/budget/:itemId` - Delete budget item

### Itinerary
- `POST /api/trips/:tripId/itinerary` - Add itinerary item
- `DELETE /api/trips/:tripId/itinerary/:itemId` - Delete itinerary item

### Packing List
- `POST /api/trips/:tripId/packing` - Add packing item
- `PUT /api/trips/:tripId/packing/:itemId` - Update packing item (toggle packed)
- `DELETE /api/trips/:tripId/packing/:itemId` - Delete packing item

## Database Schema

### Users Table
- `id` (UUID)
- `email` (VARCHAR, unique)
- `username` (VARCHAR, unique)
- `password` (VARCHAR, hashed)
- `first_name`, `last_name` (VARCHAR)
- `bio` (TEXT)
- `avatar_url` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### Trips Table
- `id` (UUID)
- `user_id` (UUID, foreign key)
- `title`, `destination` (VARCHAR)
- `start_date`, `end_date` (DATE)
- `description` (TEXT)
- `image_url` (VARCHAR)
- `status` ('upcoming', 'active', 'past')
- `total_budget` (DECIMAL)
- `currency` (VARCHAR, default 'USD')
- `created_at`, `updated_at` (TIMESTAMP)

### Budget Items, Itinerary Items, Packing Items Tables
- Store associated data for each trip
- Foreign key relationship to trips table

## Authentication Flow

1. User registers with email, username, and password
2. Password is hashed using bcryptjs
3. On login, user receives JWT token
4. Include token in Authorization header: `Bearer {token}`
5. Server validates token for protected routes

## Error Handling

All errors are returned in format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## CORS Configuration

Backend is configured to accept requests from:
- `http://localhost:5173` (development frontend)
- Change `FRONTEND_URL` in `.env` for production

---
For frontend integration, ensure to send JWT token in Authorization header for all protected routes.
