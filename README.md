# OdooXparul - Traveloop

A full-stack travel planning application that helps users create, manage, and share trip itineraries with collaborative features, budget tracking, and community engagement.

## Features

- **Trip Management**: Create, view, and manage detailed trip itineraries
- **Collaborative Planning**: Share trips with friends and collaborate in real-time
- **Budget Tracking**: Track expenses and manage trip budgets
- **Itinerary Builder**: Organize activities and destinations day by day
- **Packing Checklist**: Create and manage packing lists for trips
- **Weather Widget**: View weather forecasts for trip destinations
- **Destination Maps**: Interactive maps for trip planning
- **Community**: Share trips and explore community itineraries
- **Authentication**: Secure user authentication and profile management
- **Activity Search**: Search and discover activities and locations
- **Notes**: Add notes and details to trips

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL / SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **ORM**: Query builders with raw SQL

### Frontend
- **Framework**: React 18+ with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Context API
- **HTTP Client**: Custom API service layer
- **Additional Libraries**: 
  - Material-UI Icons
  - date-fns (date utilities)
  - embla-carousel (carousels)
  - lucide-react (icons)
  - canvas-confetti (animations)

## Project Structure

```
OdooXparul/
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── server.ts        # Application entry point
│   │   ├── config/          # Database configuration
│   │   ├── controllers/      # Route handlers (auth, trips, community, etc.)
│   │   ├── middleware/       # Express middleware (auth, etc.)
│   │   ├── routes/          # API route definitions
│   │   └── utils/           # Helper functions and utilities
│   ├── tsconfig.json
│   ├── nodemon.json
│   └── package.json
│
├── frontend/                # React + Vite application
│   ├── src/
│   │   ├── main.tsx         # Application entry point
│   │   ├── App.tsx          # Root component
│   │   ├── app/             # App-specific logic
│   │   │   ├── components/  # Reusable React components
│   │   │   ├── pages/       # Page-level components
│   │   │   └── types.ts     # TypeScript type definitions
│   │   ├── context/         # React Context (auth, etc.)
│   │   ├── services/        # API service layer
│   │   └── styles/          # Global styles and themes
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
└── README.md               # This file
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm package manager
- PostgreSQL (for production) or SQLite (for development)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create a `.env` file with the following variables:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/traveloop
# or for SQLite: sqlite:///traveloop.db
JWT_SECRET=your-secret-key
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create a `.env` file with the API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The frontend will be available at `http://localhost:5173`

## Available Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run migrate` - Run database migrations

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Trips
- `GET /api/trips` - Get all user trips
- `POST /api/trips` - Create a new trip
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Community
- `GET /api/community` - Get community trips
- `POST /api/community/share` - Share trip to community

### Trip Details
- `GET /api/trips/:id/details` - Get detailed trip information
- `PUT /api/trips/:id/details` - Update trip details

## Environment Variables

### Backend (.env)
```
PORT=5000
DATABASE_URL=your-database-url
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Development Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and test locally

3. Commit with clear messages:
```bash
git commit -m "feat: add new feature description"
```

4. Push and create a pull request:
```bash
git push origin feature/your-feature-name
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Support

For issues, questions, or contributions, please refer to the repository's issue tracker.


Thankyou