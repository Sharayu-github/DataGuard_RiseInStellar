# 🚀 Quick Start Guide - DataGuard Stellar

Get DataGuard Stellar running in **5 minutes** with TEST MODE (no Freighter needed!)

## ⚡ Prerequisites (Minimal)

- Node.js 16+
- npm 8+
- Git
- **That's it!** Freighter is optional (use TEST MODE for development)

## 1. Clone & Install (1 min)

```bash
cd "Stellar DataGuard"
npm install-all
```

## 2. Create Environment Files (30 sec)

**Create `.env` in root:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_FREIGHTER_ENABLED=true
```

**Create `backend/.env`:**
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
```

## 3. Start Everything (1 min)

```bash
# All-in-one command (recommended)
npm run dev
```

**Or separately:**

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend (from root)
npm run dev
```

✅ Frontend: **http://localhost:5173**  
✅ Backend: **http://localhost:5000**

## 4. Use TEST MODE (No Setup Required!)

The app **automatically loads with TEST MODE**:
- ✅ Mock wallet: `GBXXXX...` (testnet format)
- ✅ Mock balance: 9999.99 XLM
- ✅ ⚠️ Warning message shown
- ✅ All 6 pages fully functional
- ✅ Zero setup needed!

### Or Switch to Real Freighter (2 min)

1. Install [Freighter Wallet](https://www.freighter.app/) extension
2. Create account → Select Stellar Testnet
3. Get XLM from [Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
4. Reload browser
5. App auto-detects and connects!

## 5. Start Building!

| Action | Location |
|--------|----------|
| **Upload Dataset** | Go to "Upload" tab |
| **Verify File** | Go to "Verify" tab |
| **See History** | Go to "Browse" tab |
| **Your Stats** | Go to "Dashboard" tab |
| **Update Files** | Go to "Update" tab |

## 🔧 Quick Troubleshooting

```bash
# Port already in use?
npx kill-port 5173
npx kill-port 5000
npm run dev

# Dependencies issues?
rm -rf node_modules package-lock.json
npm install-all

# Backend won't start?
cd backend
npm install
npm start
```

## 📖 More Info

- **Full Details**: [README.md](./README.md)
- **Wallet Issues**: [README#Troubleshooting](./README.md#-troubleshooting--faq)
- **Smart Contracts**: [contracts/README.md](./contracts/README.md)

## 🎯 What's Included

✅ 6 functional pages  
✅ Wallet integration (TEST MODE + Real)  
✅ File hashing (SHA-256)  
✅ Blockchain ready  
✅ Backend API ready  
✅ Responsive design  

## 💡 Key Features

**Development (TEST MODE):**
- No installation needed
- Works immediately
- Perfect for testing
- Full feature access

**Production (Real Freighter):**
- Real Stellar wallet
- Blockchain transactions
- Production-grade security

---

**Ready to go! Start at http://localhost:5173 🚀**
