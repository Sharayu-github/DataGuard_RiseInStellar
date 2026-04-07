# DataGuard Stellar - Backend Setup Guide

## Quick Start

```bash
cd backend
npm install
node server.js
```

Server runs at: `http://localhost:5000`

## Project Structure

```
backend/
├── server.js                # Express server entry point
├── package.json             # Dependencies
├── .env.example             # Environment template
│
├── routes/                  # API endpoints
│   ├── dataset.routes.js    # Dataset CRUD
│   ├── verify.routes.js     # Verification endpoints
│   ├── wallet.routes.js     # Wallet operations
│   └── auth.routes.js       # Authentication
│
├── controllers/             # Business logic
│   └── dataset.controller.js
│
├── models/                  # Database schemas
│   ├── Dataset.model.js
│   └── User.model.js
│
├── services/                # Helper services
│   ├── hashService.js
│   └── stellarService.js
│
└── middleware/              # Express middleware
    └── auth.middleware.js
```

## Environment Setup

Create `.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/dataguard

# JWT
JWT_SECRET=your-secret-key

# Stellar
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# Smart Contracts (after deployment)
DATASET_REGISTRY_CONTRACT=C...
DATA_VERIFICATION_CONTRACT=C...
```

## API Documentation

### Datasets

#### Register Dataset
```bash
POST /api/datasets/register
Content-Type: application/json

{
  "datasetId": "dsg_123456",
  "name": "My Dataset",
  "ownerWallet": "GXXX...",
  "fileHash": "abc123...",
  "storageUrl": "https://s3.example.com/data.csv",
  "description": "Dataset description",
  "fileName": "data.csv",
  "fileSize": 5242880
}
```

#### Get Dataset
```bash
GET /api/datasets/dsg_123456
```

#### List Datasets
```bash
GET /api/datasets?limit=50&skip=0
```

#### Update Dataset
```bash
PUT /api/datasets/dsg_123456
Content-Type: application/json

{
  "fileHash": "new_hash...",
  "changeDescription": "Added more data",
  "updatedByWallet": "GXXX..."
}
```

#### Delete Dataset
```bash
DELETE /api/datasets/dsg_123456
Content-Type: application/json

{
  "ownerWallet": "GXXX..."
}
```

### Verification

#### Verify Dataset
```bash
POST /api/verify/dsg_123456
Content-Type: application/json

{
  "hash": "abc123..."
}
```

#### Verification History
```bash
GET /api/verify/dsg_123456/history
```

### Wallet

#### Get Balance
```bash
GET /api/wallet/balance/GXXX...
```

#### Get Datasets by Wallet
```bash
GET /api/wallet/GXXX.../datasets
```

### Authentication

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "walletAddress": "GXXX..."
}
```

#### Logout
```bash
POST /api/auth/logout
```

#### Get Profile
```bash
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

## Database Models

### Dataset

- `datasetId` (String, unique): Unique identifier
- `name` (String): Human-readable name
- `ownerWallet` (String): Owner's wallet address
- `fileHash` (String): SHA-256 file hash
- `storageUrl` (String): Where file is stored
- `description` (String): Dataset description
- `version` (Number): Current version number
- `versions` (Array): Version history
- `createdAt` (Date): Creation timestamp
- `updatedAt` (Date): Last update timestamp
- `blockchainVerified` (Boolean): Verified on-chain

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin requests
- **dotenv**: Environment variables
- **mongoose**: MongoDB ODM
- **crypto-js**: Cryptographic operations
- **jsonwebtoken**: JWT tokens
- **axios**: HTTP client
- **stellar-sdk**: Stellar blockchain

## Development

### Run Development Server
```bash
npm run dev  # Uses nodemon for auto-reload
```

### API Testing

Using curl:
```bash
curl -X POST http://localhost:5000/api/datasets/register \
  -H "Content-Type: application/json" \
  -d '{
    "datasetId": "test_1",
    "name": "Test",
    "ownerWallet": "GXXX...",
    "fileHash": "abc123...",
    "storageUrl": "https://example.com/test.csv"
  }'
```

## Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -i :5000
# Kill process
kill -9 <PID>
```

### MongoDB Connection Error
```bash
# Check MongoDB running
mongod --version

# Test connection
mongo mongodb://localhost:27017/dataguard
```

### Missing Dependencies
```bash
npm install
```

### Environment Variables
```bash
# Create .env from example
cp .env.example .env

# Edit with your values
nano .env
```

## Production Deployment

### Environment
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-very-secret-key-change-this
MONGODB_URI=mongodb+srv://...  # Use MongoDB Atlas
STELLAR_NETWORK=public
```

### Deployment Options

**Heroku:**
```bash
heroku create your-app
git push heroku main
```

**AWS:**
```bash
# Use Elastic Beanstalk or Lambda
```

**Docker:**
```bash
docker build -t dataguard-api .
docker run -p 5000:5000 dataguard-api
```

## Monitoring

### Logs
```bash
# Check server output for logs
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

## Contributing

Follow existing code style and add tests for new features.

## Support

For issues, check GitHub or contact: nishitbhalerao@gmail.com
