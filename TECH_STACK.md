# Traveloop - Complete Tech Stack

## Backend Architecture

### Core Framework & Server
- **Runtime**: Node.js v20+ with ES Modules (ESM)
- **Framework**: Express.js (v4.18.2) - Lightweight, fast HTTP server
- **Language**: TypeScript (v5.3.3) - Type-safe JavaScript
- **Dev Server**: Nodemon (v3.0.2) - Auto-restart on file changes
- **TypeScript Runner**: ts-node with ESM loader - Direct .ts execution

### Database Layer
- **Primary DB**: PostgreSQL (v12+) - Production-ready relational database
- **Fallback DB**: SQLite (better-sqlite3 v8.4.0) - For development without PostgreSQL
- **Adapter Pattern**: Custom DB abstraction layer that auto-selects Postgres or SQLite

### Authentication & Security
- **Password Hashing**: bcryptjs (v2.4.3) - Secure password hashing with salt
- **JWT Tokens**: jsonwebtoken (v9.0.2) - Secure token-based authentication
- **Token Expiry**: 7 days (configurable)
- **Auth Middleware**: Custom Express middleware for protected routes

### Input Validation & Error Handling
- **Validator**: express-validator (v7.0.0) - Server-side input validation
- **CORS**: cors (v2.8.5) - Cross-Origin Resource Sharing for frontend

### Utilities
- **UUID**: uuid (v9.0.1) - Unique identifier generation
- **Environment**: dotenv (v16.3.1) - Environment variable management

### TypeScript Configuration
- **Target**: ES2020 JavaScript
- **Module Resolution**: bundler
- **Strict Mode**: Full strict type checking enabled
- **ESM Support**: Fully configured for ES modules

---

## Database Schema

### Users Table
- User authentication and profile management
- Hashed passwords with bcrypt
- Profile fields: email, username, bio, avatar

### Trips Table
- Trip records with dates, destination, status
- Budget tracking per trip
- Status: upcoming, active, or past

### Budget Items Table
- Expense tracking per trip
- Category-based organization
- Amount and date tracking

### Itinerary Items Table
- Activity/flight/accommodation scheduling
- Date, time, and location based
- Type classification

### Packing Items Table
- Packing checklist per trip
- Checkable items with categories
- Packed status tracking

### Community Posts Table
- User-generated travel advice
- Likes tracking
- Destination tagging

### Trip Collaborators Table
- Multi-user trip sharing
- Role-based access (viewer/editor/etc.)

---

## API Endpoints

### Authentication (Public)
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login and get JWT token
```

### Protected Endpoints (Requires JWT Token)
```
GET    /api/auth/profile                     - Get current user profile
PUT    /api/auth/profile                     - Update user profile

GET    /api/trips                             - List all user trips
POST   /api/trips                             - Create new trip
GET    /api/trips/:tripId                    - Get trip details
PUT    /api/trips/:tripId                    - Update trip
DELETE /api/trips/:tripId                    - Delete trip

POST   /api/trips/:tripId/budget             - Add budget item
DELETE /api/trips/:tripId/budget/:itemId     - Delete budget item

POST   /api/trips/:tripId/itinerary          - Add itinerary item
DELETE /api/trips/:tripId/itinerary/:itemId  - Delete itinerary item

POST   /api/trips/:tripId/packing            - Add packing item
PUT    /api/trips/:tripId/packing/:itemId    - Toggle packing status
DELETE /api/trips/:tripId/packing/:itemId    - Delete packing item
```

---

## Frontend Integration

### Frameworks Used
- **React 18** - UI component library
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type-safe frontend code
- **React Router** - Client-side routing
- **Shadcn/UI** - Pre-built component system
- **Radix UI** - Low-level component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Next-themes** - Dark mode support
- **Motion (Framer)** - Smooth animations
- **Lucide Icons** - Clean icon library

---

## Development Workflow

### Starting Backend
```bash
cd backend
npm run dev          # Start with nodemon (auto-reload)
# or
npm start            # Run compiled version
```

### Starting Frontend
```bash
cd frontend
npm run dev          # Start Vite dev server on :5173
```

### Building for Production
```bash
# Backend
npm run build        # Compile TypeScript to JavaScript
npm start

# Frontend
npm run build        # Create production bundle
```

---

## Project Structure

```
odoo/
├── backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts    # PostgreSQL/SQLite adapter
│   │   │   └── initDb.ts      # Database initialization
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # Auth, validation
│   │   ├── routes/             # API endpoint definitions
│   │   ├── utils/              # Helper functions
│   │   └── server.ts           # Express app entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── nodemon.json
│   └── .env                   # Configuration
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/         # Page components
│   │   │   ├── components/    # Reusable components
│   │   │   └── routes.tsx     # Route definitions
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── SETUP_GUIDE.md             # Complete setup instructions
```

---

## Key Features

✅ **Authentication**: Secure JWT-based auth with bcrypt hashing
✅ **Database**: Auto-fallback from PostgreSQL to SQLite
✅ **Type Safety**: Full TypeScript on backend and frontend
✅ **Input Validation**: Server-side validation on all endpoints
✅ **CORS**: Configured for localhost:5173 (frontend)
✅ **ESM**: Modern ES modules throughout
✅ **Environment Config**: .env based configuration
✅ **Dark Mode**: Full light/dark theme support
✅ **Responsive UI**: Mobile-first design with Tailwind CSS
✅ **Modern Build**: Vite for fast HMR and production builds

---

## Environment Variables (.env)

```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=traveloop

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

---

## Performance & Best Practices

- ✅ Async/await for non-blocking operations
- ✅ Connection pooling (PostgreSQL)
- ✅ Prepared statements to prevent SQL injection
- ✅ Password hashing with salt rounds
- ✅ JWT token expiration for security
- ✅ CORS protection against cross-origin attacks
- ✅ Input validation before database operations
- ✅ Error handling with meaningful messages
- ✅ TypeScript strict mode for type safety

---

## Ready to Deploy

The backend is production-ready with:
- PostgreSQL support for scaling
- Environment-based configuration
- Proper error handling
- Security best practices
- Scalable architecture

Switch `NODE_ENV` to `production` and update `FRONTEND_URL` for production deployment.
