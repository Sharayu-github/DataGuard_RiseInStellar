# Complete Setup & Deployment Guide

Comprehensive guide for setting up DataGuard Stellar from scratch.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Frontend Setup](#frontend-setup)
3. [Backend Setup](#backend-setup)
4. [Database Setup](#database-setup)
5. [Smart Contract Deployment](#smart-contract-deployment)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)

## System Requirements

### Minimum
- Node.js v16.0.0+
- npm v8.0.0+
- Rust 1.70+
- MongoDB 5.0+ (optional for dev)
- 4GB RAM
- 2GB disk space

### Recommended
- Node.js v18.0.0+
- npm v9.0.0+
- Rust 1.75+
- MongoDB Atlas (cloud)
- 8GB RAM
- 5GB disk space

## Frontend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create `.env` in project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_FREIGHTER_ENABLED=true
```

### 3. Install Freighter Wallet

1. Go to [freighter.app](https://www.freighter.app/)
2. Install browser extension
3. Create account or import existing wallet
4. Switch to Stellar Testnet

### 4. Development Server

```bash
npm run dev
```

Access at: `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
# Output in dist/ folder
```

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
cd ..
```

### 2. Create Environment File

Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/dataguard

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Stellar
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# Contracts (add after deployment)
DATASET_REGISTRY_CONTRACT=C...
DATA_VERIFICATION_CONTRACT=C...
```

### 3. Start Server

```bash
cd backend
node server.js
```

Server runs at: `http://localhost:5000`

### 4. API Health Check

```bash
curl http://localhost:5000/api/health
```

Expected:
```json
{"status": "ok", "message": "DataGuard Stellar API is running"}
```

## Database Setup

### Option 1: Local MongoDB

#### Install MongoDB

**Windows:**
```bash
# Download from mongodb.com or use Chocolatey
choco install mongodb-community
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
```

#### Start MongoDB

```bash
mongod
# Runs on localhost:27017
```

### Option 2: MongoDB Atlas (Recommended)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster
4. Get connection string
5. Add to `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dataguard
   ```

## Smart Contract Deployment

### 1. Install Soroban CLI

```bash
cargo install --locked soroban-cli
```

### 2. Setup Stellar Account

```bash
# Generate keypair
soroban keys generate --network testnet my_key

# Show public key
soroban keys show my_key
```

### 3. Fund Account

1. Copy your public key
2. Visit [Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
3. Paste key and fund account (get 10,000 XLM test tokens)

### 4. Build Contracts

```bash
# Dataset Registry
cd contracts/dataset_registry
cargo build --target wasm32-unknown-unknown --release

# Data Verification
cd ../data_verification
cargo build --target wasm32-unknown-unknown --release
```

### 5. Deploy Contracts

```bash
# Deploy dataset registry
soroban contract deploy \
  --wasm contracts/dataset_registry/target/wasm32-unknown-unknown/release/dataset_registry.wasm \
  --source my_key \
  --network testnet

# Deploy data verification
soroban contract deploy \
  --wasm contracts/data_verification/target/wasm32-unknown-unknown/release/data_verification.wasm \
  --source my_key \
  --network testnet
```

### 6. Save Contract IDs

Update `backend/.env` with returned contract IDs:

```env
DATASET_REGISTRY_CONTRACT=CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4
DATA_VERIFICATION_CONTRACT=CBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBSQ
```

## Testing

### Frontend Tests

```bash
# Run component tests
npm run test
```

### Backend Tests

```bash
cd backend
npm test
```

### API Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Register dataset
curl -X POST http://localhost:5000/api/datasets/register \
  -H "Content-Type: application/json" \
  -d '{
    "datasetId": "test_1",
    "name": "Test Dataset",
    "ownerWallet": "GXXXX...",
    "filehash": "abc123...",
    "storageUrl": "https://example.com/dataset.csv"
  }'
```

## Production Deployment

### Frontend - Vercel

```bash
npm install -g vercel
vercel
# Follow prompts
```

### Frontend - Netlify

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Backend - Heroku

1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Add environment variables
4. Deploy: `git push heroku main`

### Backend - Docker

Create `Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t dataguard-stellar-api .
docker run -p 5000:5000 dataguard-stellar-api
```

### Database - MongoDB Atlas

1. Create production cluster
2. Whitelist IP addresses
3. Get connection string
4. Add `MONGODB_URI` to production `.env`

### Smart Contracts - Main Network

```bash
# Deploy to Stellar public network
soroban contract deploy \
  --wasm contracts/dataset_registry/target/wasm32-unknown-unknown/release/dataset_registry.wasm \
  --source my_key \
  --network public
```

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use MongoDB Atlas, not local DB
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Use environment-specific .env files
- [ ] Regular backups enabled
- [ ] Monitor error logs
- [ ] Update dependencies regularly
- [ ] Don't commit secrets to git
- [ ] Use service accounts for blockchain

## Monitoring & Maintenance

### Logs

```bash
# Backend logs
# Check console output from 'node server.js'

# Database logs
# Check MongoDB logs

# Frontend logs
# Check browser console (F12)
```

### Health Checks

```bash
# API
curl http://your-api.com/api/health

# Database
# Check MongoDB connection

# Smart Contracts
# Monitor contract events on Stellar
```

### Updates

```bash
# Update dependencies
npm update
cd backend && npm update

# Update smart contracts
# Redeploy to Soroban
```

## Troubleshooting

### Port Already in Use
```bash
# Find process on port
lsof -i :5000
# Kill process
kill -9 <PID>
```

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongod --version

# Test connection
mongo mongodb://localhost:27017/dataguard
```

### Stellar Network Issues
```bash
# Check network status
curl https://horizon-testnet.stellar.org/

# Verify wallet funded
soroban account balance --account my_key --network testnet
```

### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

**For detailed troubleshooting, check [GitHub Issues](https://github.com/nishitbhalerao/DataGuard_Stellar)**
