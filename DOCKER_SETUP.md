# DataGuard Stellar Development Setup

Quick setup guide using Docker Compose.

## Prerequisites

- Docker
- Docker Compose
- Git

## Quick Start

### 1. Clone Repository
```bash
git clone <repo-url>
cd "Stellar DataGuard"
```

### 2. Create Environment Files

**.env**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STELLAR_NETWORK=testnet
```

**backend/.env**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://mongodb:27017/dataguard
STELLAR_NETWORK=testnet
FRONTEND_URL=http://localhost:5173
JWT_SECRET=dev-secret-key
```

### 3. Start Services
```bash
docker-compose up -d
```

Services available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### 4. Stop Services
```bash
docker-compose down
```

## Common Commands

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Rebuild
```bash
docker-compose up --build
```

### Clean Everything
```bash
docker-compose down -v
```

### Access MongoDB
```bash
docker exec -it dataguard_mongodb mongosh
```

## Manual Installation (No Docker)

### Install Dependencies
```bash
npm install-all
```

### Start MongoDB
```bash
mongod
```

### Start Backend (Terminal 1)
```bash
cd backend
node server.js
```

### Start Frontend (Terminal 2)
```bash
npm run dev
```

## Troubleshooting

### Port Already in Use
```bash
# Change port in docker-compose.yml or .env
```

### Container Won't Start
```bash
docker-compose down -v
docker-compose up --build
```

### Database Connection Failed
```bash
# Wait for MongoDB to fully start (5-10 seconds)
docker-compose logs mongodb
```

## Next Steps

1. Install Freighter Wallet
2. Get testnet funds from Friendbot
3. Deploy smart contracts
4. Start using the app!

See QUICKSTART.md for full instructions.
