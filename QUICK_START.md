# 🚀 Quick Start - Backend & Frontend

## Step 1: Start Backend Server

Open a terminal and run:

```bash
cd c:\Users\DELL\Desktop\odoo\backend
npm run dev
```

**Expected Output:**
```
[nodemon] 3.1.14
[nodemon] watching path(s): src\**\*
[nodemon] watching extensions: ts
[nodemon] starting `node --loader ts-node/esm src/server.ts`
(node:XXXX) ExperimentalWarning: `--experimental-loader`...
✓ Server is running on http://localhost:5000
✓ Frontend URL configured: http://localhost:5173
```

✅ **If you see this, backend is working!**

---

## Step 2: Test Backend API

In another terminal, test the health endpoint:

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"status":"OK","message":"Traveloop backend is running"}
```

---

## Step 3: Start Frontend Server

Open a new terminal:

```bash
cd c:\Users\DELL\Desktop\odoo\frontend
npm install
npm run dev
```

**Expected Output:**
```
  VITE v5.X.X  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ **Frontend is ready!**

---

## Step 4: Access the App

Open your browser and go to:
```
http://localhost:5173
```

You should see the **Traveloop** travel planning app!

---

## Technology Stack Used

### Backend 🔧
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | Runtime | 20+ |
| **Express.js** | HTTP Server Framework | 4.18.2 |
| **TypeScript** | Type-safe JavaScript | 5.3.3 |
| **PostgreSQL** | Primary Database | 12+ |
| **SQLite** (better-sqlite3) | Fallback Database | 8.4.0 |
| **JWT** | Authentication Tokens | 9.0.2 |
| **bcryptjs** | Password Hashing | 2.4.3 |
| **ts-node** | Run TypeScript directly | 10.9.2 |
| **Nodemon** | Auto-reload Dev Server | 3.0.2 |

### Frontend 🎨
| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Framework | 18+ |
| **TypeScript** | Type-safe JavaScript | Latest |
| **Vite** | Build Tool | 5+ |
| **React Router** | Client-side Routing | Latest |
| **Tailwind CSS** | Styling | Latest |
| **Shadcn/UI** | Component Library | Latest |
| **Framer Motion** | Animations | 12+ |
| **Lucide Icons** | Icon Library | Latest |

### Database Architecture 🗄️
- **PostgreSQL**: Production database with proper relationships
- **SQLite**: Local development fallback (auto-selected if Postgres unavailable)
- **UUID**: For globally unique IDs
- **Auto-Migration**: Tables created on first run

---

## API Testing

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a Trip (with token from login)
```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Summer Vacation",
    "destination": "Paris",
    "startDate": "2026-06-01",
    "endDate": "2026-06-15",
    "description": "Exploring Paris in summer",
    "totalBudget": 2000,
    "currency": "EUR"
  }'
```

---

## Authentication Flow

```
User Registration
        ↓
[Email, Username, Password]
        ↓
Password Hashed (bcrypt)
        ↓
User Created in Database
        ↓
JWT Token Generated
        ↓
Token Sent to Frontend
        ↓
Frontend Stores Token (localStorage)
        ↓
All Future Requests Include Token
        ↓
Backend Validates Token
        ↓
Protected Route Access Granted ✓
```

---

## Database Schema

```
Users
├── id (UUID)
├── email (unique)
├── username (unique)
├── password (hashed)
├── first_name, last_name
└── avatar_url

Trips (owns many)
├── id (UUID)
├── user_id (FK to Users)
├── title, destination
├── start_date, end_date
├── status (upcoming/active/past)
├── total_budget, currency
└── created_at, updated_at

Budget Items
├── trip_id (FK)
├── category, amount, date

Itinerary Items
├── trip_id (FK)
├── title, description, date, time

Packing Items
├── trip_id (FK)
├── name, category, packed (boolean)
```

---

## Folder Structure

```
🏠 odoo/
│
├─ 📁 backend/                    # ← Node.js + Express API Server
│  ├─ src/
│  │  ├─ config/                  # Database & initialization
│  │  ├─ controllers/             # Business logic (auth, trips, etc.)
│  │  ├─ middleware/              # Auth validation, CORS
│  │  ├─ routes/                  # API endpoint definitions
│  │  ├─ utils/                   # Helper functions (hashing, tokens)
│  │  └─ server.ts                # Express app entry point
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ .env                        # Configuration (add this)
│  └─ README.md
│
├─ 📁 frontend/                   # ← React + Vite App
│  ├─ src/
│  │  ├─ app/
│  │  │  ├─ pages/               # Page components (Dashboard, Login, etc.)
│  │  │  ├─ components/          # Reusable UI components
│  │  │  └─ routes.tsx           # Route definitions
│  │  └─ main.tsx
│  ├─ package.json
│  ├─ vite.config.ts
│  └─ README.md
│
├─ 📄 SETUP_GUIDE.md              # Complete setup instructions
├─ 📄 TECH_STACK.md               # This file
└─ 📄 API_TESTING.md              # API endpoint examples
```

---

## Common Commands

### Backend
```bash
npm run dev          # Start dev server with auto-reload
npm run build        # Compile TypeScript
npm start            # Run compiled code
```

### Frontend
```bash
npm run dev          # Start dev server on :5173
npm run build        # Build for production
npm preview          # Preview production build
```

---

## Environment Variables (.env)

Create `.env` file in the `backend/` folder:

```env
# Database (PostgreSQL - optional)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=traveloop

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## ✅ Checklist

- [x] Backend created with Node.js + Express
- [x] TypeScript configuration complete
- [x] PostgreSQL with SQLite fallback
- [x] JWT authentication implemented
- [x] All API endpoints created
- [x] Database schema designed
- [x] Input validation added
- [x] CORS configured
- [x] Frontend cloned from GitHub
- [ ] Run `npm run dev` in backend
- [ ] Run `npm run dev` in frontend
- [ ] Test registration at http://localhost:5173
- [ ] Test login flow
- [ ] Create a trip and test features
- [ ] Customize as needed!

---

## 🎯 Next Steps

1. **Start the backend** (see Step 1)
2. **Start the frontend** (see Step 3)
3. **Test registration** - Create an account in the UI
4. **Test login** - Login with your credentials
5. **Test features** - Create a trip, add budget items, etc.
6. **Customize** - Modify UI, add more features, deploy!

---

## 🚀 Production Deployment

When ready to deploy:

1. Set `NODE_ENV=production`
2. Update `FRONTEND_URL` to your production domain
3. Change `JWT_SECRET` to a strong random string
4. Set up PostgreSQL (don't rely on SQLite in production)
5. Use a process manager like PM2
6. Deploy frontend to Vercel, Netlify, or similar
7. Deploy backend to Heroku, AWS, DigitalOcean, etc.

---

## 📞 Support

If you encounter issues:

1. Check terminal output for errors
2. Verify `.env` file exists in backend/
3. Ensure port 5000 (backend) and 5173 (frontend) are free
4. Try: `npm install` in both folders
5. Restart both dev servers

**Happy coding! 🎉**
