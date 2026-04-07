# Architecture Guide - DataGuard Stellar

## System Overview

DataGuard Stellar is a three-tier blockchain application:

```
┌─────────────────────────────────────────────────────┐
│               Frontend (React + Vite)                │
│         ├─ Pages: Upload, Verify, Update, Browse   │
│         ├─ Components: Navbar, Toast, Background   │
│         └─ Services: API, Hash, Wallet, Stellar    │
├─────────────────────────────────────────────────────┤
│            Backend (Express + Node.js)              │
│         ├─ Routes: Dataset, Verify, Wallet          │
│         ├─ Models: Dataset, User (MongoDB)          │
│         └─ Services: Hash, Stellar, API             │
├─────────────────────────────────────────────────────┤
│      Smart Contracts (Rust Soroban)                 │
│         ├─ Dataset Registry Contract                │
│         └─ Data Verification Contract               │
├─────────────────────────────────────────────────────┤
│           Blockchain (Stellar Testnet)              │
│         ├─ Freighter Wallet Integration             │
│         ├─ Smart Contract Storage                   │
│         └─ Event Logging                            │
└─────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Directory Structure

```
src/
├── pages/           # Full page components
│   ├── LandingPage.jsx      # Home page
│   ├── UploadPage.jsx       # Register datasets
│   ├── VerifyPage.jsx       # Verify integrity
│   ├── UpdatePage.jsx       # Update datasets
│   ├── BrowsePage.jsx       # Browse all
│   └── Dashboard.jsx        # User dashboard
│
├── components/      # Reusable components
│   ├── Navbar.jsx           # Navigation
│   ├── Toast.jsx            # Toast notifications
│   └── AnimatedBackground.jsx # Visual effects
│
├── context/         # State management
│   ├── WalletContext.jsx    # Wallet state
│   ├── AuthContext.jsx      # Auth state
│   └── ToastContext.jsx     # Toast state
│
├── services/        # API & blockchain
│   ├── apiService.js        # Backend API
│   ├── walletService.js     # Freighter integration
│   ├── stellarService.js    # Stellar blockchain
│   └── hashService.js       # SHA-256 hashing
│
└── utils/          # Helper functions
    └── ...
```

### Data Flow

1. **User Action** (Upload file)
   ↓
2. **Frontend Component** (UploadPage)
   ↓
3. **Hash Service** (Calculate SHA-256)
   ↓
4. **API Service** (Send to backend)
   ↓
5. **Backend Endpoint** (/api/datasets/register)
   ↓
6. **Stellar Service** (Store on blockchain)
   ↓
7. **Smart Contract** (Dataset Registry)
   ↓
8. **Blockchain Storage** (Stellar)
   ↓
9. **Toast Notification** (Success/Error)

## Backend Architecture

### Server Structure

```
backend/
├── server.js            # Express app setup
├── package.json         # Dependencies
│
├── routes/              # API endpoints
│   ├── dataset.routes.js
│   ├── verify.routes.js
│   ├── wallet.routes.js
│   └── auth.routes.js
│
├── controllers/         # Business logic
│   └── dataset.controller.js
│
├── models/              # Database schemas
│   ├── Dataset.model.js
│   └── User.model.js
│
├── services/            # Utility services
│   ├── hashService.js
│   └── stellarService.js
│
└── middleware/          # Express middleware
    ├── auth.middleware.js
    └── ...
```

### Request Flow

```
HTTP Request
    ↓
Express Middleware (CORS, JSON)
    ↓
Route Handler (/api/datasets/register)
    ↓
Controller (datasetController.registerDataset)
    ↓
Business Logic
    ↓
Database/Blockchain Operations
    ↓
HTTP Response (JSON)
```

## Smart Contract Architecture

### Dataset Registry Contract

**Responsibilities:**
- Register new datasets
- Update datasets with version control
- Verify dataset integrity
- Retrieve version history

**Data Structure:**
```rust
struct Dataset {
    dataset_id: String,
    name: String,
    owner: BytesN<32>,
    file_hash: Bytes,
    version: u32,
    timestamp: u64,
}
```

**Storage:**
- Immutable on Stellar blockchain
- Indexed by dataset_id

### Data Verification Contract

**Responsibilities:**
- Record verification checks
- Store verification records
- Compare hashes for integrity verification

**Data Structure:**
```rust
struct VerificationRecord {
    dataset_id: String,
    verifier: BytesN<32>,
    provided_hash: Bytes,
    is_valid: bool,
    timestamp: u64,
}
```

## Database Schema

### Dataset Collection (MongoDB)

```javascript
{
  datasetId: String (unique, indexed),
  name: String,
  ownerWallet: String (indexed),
  fileHash: String,
  storageUrl: String,
  description: String,
  fileName: String,
  fileSize: Number,
  version: Number,
  versions: [{
    version: Number,
    fileHash: String,
    timestamp: Date,
    changeDescription: String
  }],
  blockchainTxId: String,
  blockchainVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Dataset Management

```
POST   /api/datasets/register       Register new dataset
GET    /api/datasets/:datasetId     Get dataset details
GET    /api/datasets                List all datasets
PUT    /api/datasets/:datasetId     Update dataset
DELETE /api/datasets/:datasetId     Delete dataset
GET    /api/datasets/:datasetId/history  Version history
```

### Verification

```
POST   /api/verify/:datasetId       Verify integrity
GET    /api/verify/:datasetId/history  Verification history
```

### Wallet

```
GET    /api/wallet/balance/:address  Get XLM balance
GET    /api/wallet/:address/datasets  Get user's datasets
```

### Authentication

```
POST   /api/auth/login              Login with wallet
POST   /api/auth/logout             Logout
GET    /api/auth/profile            Get user profile
```

## Security Architecture

### Frontend Security
- SHA-256 hashing in browser (no server exposure)
- JWT tokens in localStorage
- CORS protection

### Backend Security
- JWT authentication
- Input validation
- CORS headers
- Rate limiting (future)

### Blockchain Security
- Ownership verification via signatures
- Immutable transaction history
- Event-based audit trail

## Deployment Architecture

### Development
```
Localhost:5173 ──API──> Localhost:5000 ──DB──> Localhost:27017
                         ├──Stellar──> Testnet
                         └──Soroban──> SM_Contract
```

### Production
```
Vercel/Netlify ──HTTPS──> Heroku/AWS Backend ──HTTPS──> Cloud DB
                          ├──Stellar──> Mainnet
                          └──Soroban──> SM_Contract
```

## Performance Optimizations

### Frontend
- Code splitting (Vite)
- Lazy loading components
- Memoization (React.memo)
- Image optimization

### Backend
- Database indexing
- Response caching
- Request batching
- Connection pooling

### Blockchain
- Batch contract calls
- Event filtering
- Query optimization

## Scalability Considerations

### Current Limits
- Single backend instance
- Local/small MongoDB
- Limited contract storage

### Scaling Strategies
1. **Horizontal Scaling**: Load balancer + multiple servers
2. **Database**: MongoDB Atlas with sharding
3. **Caching**: Redis for frequently accessed data
4. **CDN**: CloudFlare for static assets
5. **Blockchain**: Increase contract capacity

## Monitoring & Logging

### Frontend
- Console errors
- Analytics tracking
- Performance metrics

### Backend
- Request logging
- Error tracking (Sentry)
- Performance monitoring
- Database query logs

### Smart Contracts
- Event emission
- Contract state changes
- Transaction logs

## Future Improvements

1. **Multi-chain Support**: Ethereum, Polygon
2. **IPFS Integration**: Decentralized storage
3. **Advanced Analytics**: Dashboard metrics
4. **API Rate Limiting**: Prevent abuse
5. **Advanced Caching**: Redis
6. **Notifications**: Email/SMS alerts
7. **Mobile App**: React Native
8. **Advanced Encryption**: End-to-end
