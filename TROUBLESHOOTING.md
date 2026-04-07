# DataGuard Stellar - Troubleshooting & FAQ

## 🆘 Common Issues & Solutions

### Installation & Setup

#### ❌ `npm install-all` fails
**Error:** `npm: command not found`
**Solution:**
1. Install Node.js from https://nodejs.org/ (v16 or higher)
2. Verify: `node --version` and `npm --version`
3. Retry: `npm install-all`

---

#### ❌ Port 5000 already in use
**Error:** `Error: Port 5000 is already in use`
**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change backend port in:
# backend/.env → PORT=5001
```

---

#### ❌ Port 5173 already in use
**Error:** `Port 5173 is already in use`
**Solution:**
```bash
# Kill existing process or change Vite port
# Edit vite.config.js:
# server: { port: 3000 }
```

---

### Environment Configuration

#### ❌ Cannot read property 'split' of undefined
**Error:** Environment variables not loaded
**Solution:**
```bash
# Check files exist
ls -la .env                    # Frontend
ls -la backend/.env           # Backend

# Ensure you copied from:
cp .env.example .env
cp backend/.env.example backend/.env
```

---

#### ❌ VITE_API_BASE_URL is undefined
**Error:** API calls failing, network errors
**Solution:**
1. Edit `.env` file
2. Add: `VITE_API_BASE_URL=http://localhost:5000/api`
3. Save and restart: `npm run dev`

---

#### ❌ Backend cannot connect to MongoDB
**Error:** `MongoenetError` or `connection refused`
**Solution:**
```bash
# MongoDB is optional. To disable:
# Edit backend/.env and comment out:
# MONGODB_URI=...

# Or setup MongoDB Atlas:
# 1. Visit https://www.mongodb.com/cloud/atlas
# 2. Create free cluster
# 3. Get connection string
# 4. Add to backend/.env:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dataguard
```

---

### Wallet Connection

#### ❌ "Freighter wallet not installed"
**Error:** Toast shows wallet not detected
**Solution:**
1. Download Freighter: https://freighter.app/
2. Add to your browser
3. Create or import account
4. Refresh page
5. Try connecting again

---

#### ❌ "User declined signing of the transaction"
**Error:** Freighter shows reject dialog
**Solution:**
1. Check you have XLM on testnet
2. Use Friendbot to get free XLM: https://laboratory.stellar.org/#account-creator?network=test
3. Try transaction again
4. Check browser console for more details

---

#### ❌ "Network request failed" when querying balance
**Error:** Cannot fetch wallet balance
**Solution:**
1. Check `.env` has correct Horizon URL:
   ```
   VITE_HORIZON_URL=https://horizon-testnet.stellar.org
   ```
2. Check you're on testnet network
3. Verify wallet address shows in Navbar
4. Check browser network tab in DevTools

---

### Smart Contracts

#### ❌ Cannot find contract address
**Error:** `Cannot get dataset verification` errors
**Solution:**
```bash
# After deploying contracts, add to backend/.env:
STELLAR_DATASET_REGISTRY_CONTRACT=C...
STELLAR_DATA_VERIFICATION_CONTRACT=C...

# See contracts/README.md for deployment steps
```

---

#### ❌ "Soroban CLI not found"
**Error:** `soroban: command not found`
**Solution:**
1. Install Rust: https://rustup.rs/
2. Install Soroban CLI:
   ```bash
   cargo install soroban-cli
   ```
3. Verify: `soroban --version`

---

### Frontend Issues

#### ❌ Page shows blank white screen
**Error:** React component not rendering
**Solution:**
```bash
# Check browser console for errors (F12)
# Common issues:

# 1. Check .env is correctly configured:
cat .env

# 2. Check API is running:
# Terminal: npm run backend
# Should show: "Server running on http://localhost:5000"

# 3. Restart React dev server:
npm run dev

# 4. Clear cache and restart:
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

#### ❌ Styles not loading (unstyled page)
**Error:** Page looks broken, no colors/spacing
**Solution:**
```bash
# Tailwind CSS not building
# Check files exist:
ls -la src/index.css
ls -la tailwind.config.js

# Rebuild:
npm run dev

# If still failing:
npm install -D tailwindcss postcss autoprefixer
npm run dev
```

---

#### ❌ "Cannot find module 'crypto-js'"
**Error:** Import error in browser
**Solution:**
```bash
# Package not installed
npm install crypto-js

# Or reinstall all:
cd frontend (if separate dir)
npm install
npm run dev
```

---

#### ❌ Toast notifications not showing
**Error:** Success/error messages don't appear
**Solution:**
1. Check `src/context/ToastContext.jsx` exists
2. Check `src/components/Toast.jsx` exists
3. Check `App.jsx` includes `<ToastProvider>`
4. Open browser console (F12) for errors
5. Look for `addToast` calls in code

---

### Backend Issues

#### ❌ "Cannot find module 'express'"
**Error:** Backend won't start
**Solution:**
```bash
cd backend
npm install
node server.js
```

---

#### ❌ CORS error in browser console
**Error:** `Access to XMLHttpRequest blocked by CORS policy`
**Solution:**
1. Check backend running on 5000
2. Check `backend/.env` has correct FRONTEND_URL
3. In `backend/server.js` check:
   ```javascript
   const corsOptions = {
     origin: process.env.FRONTEND_URL || 'http://localhost:5173'
   };
   ```
4. Restart backend

---

#### ❌ JWT token errors
**Error:** `401 Unauthorized` or `Invalid token`
**Solution:**
```bash
# Check backend/.env has JWT_SECRET:
echo $JWT_SECRET

# Add if missing:
JWT_SECRET=dev-secret-key-change-in-production

# Clear browser localStorage:
# DevTools → Application → localStorage → Clear All

# Login again
```

---

#### ❌ API returns 404
**Error:** `Cannot POST /api/datasets`
**Solution:**
1. Check backend running: `npm run backend`
2. Check routes file exists: `backend/routes/dataset.routes.js`
3. Check route registered in `server.js`
4. Check URL path is correct
5. Restart backend

---

### Docker Issues

#### ❌ Docker command not found
**Error:** `docker: command not found`
**Solution:**
1. Install Docker Desktop: https://www.docker.com/products/docker-desktop
2. Start Docker Desktop
3. Verify: `docker --version`

---

#### ❌ Cannot connect to Docker daemon
**Error:** `Cannot connect to Docker daemon`
**Solution:**
1. Start Docker Desktop application
2. Wait for Docker to initialize (2-3 min)
3. Verify: `docker ps`
4. If still failing: restart Docker Desktop or computer

---

#### ❌ Port conflicts with Docker
**Error:** `Bind for 0.0.0.0:5000 failed`
**Solution:**
```bash
# Change ports in docker-compose.yml:
services:
  backend:
    ports:
      - "5001:5000"  # Changed from 5000:5000

  frontend:
    ports:
      - "3001:5173"  # Changed from 5173:5173
```

---

### Git & Version Control

#### ❌ Git not installed
**Error:** `git: command not found`
**Solution:**
1. Download Git: https://git-scm.com/
2. Install with defaults
3. Verify: `git --version`

---

#### ❌ `.gitignore` not working
**Error:** Unwanted files in git commits
**Solution:**
```bash
# Remove from cache
git rm -r --cached .
git add .
git commit -m "Fix gitignore"
```

---

## 🤔 FAQ

### Q: Can I run everything on mainnet?
**A:** Not recommended for testing. All contracts are configured for testnet. To use mainnet:
1. Update `.env` files to mainnet URLs
2. Use mainnet account with real funds
3. Deploy contracts to mainnet
4. Update contract addresses
⚠️ **Warning:** This will cost real XLM

---

### Q: What if I lose my wallet private key?
**A:** You won't be able to recover datasets you registered. **Important:**
- Store your Freighter backup securely
- Never share seed phrase
- Use testnet for development

---

### Q: Can I use a different wallet instead of Freighter?
**A:** Current code is Freighter-specific. To use another:
1. Modify `src/context/WalletContext.jsx`
2. Replace Freighter API with new wallet API
3. Update signing process in `stellarService.js`
4. Requires significant refactoring

---

### Q: How do I add a database?
**A:** MongoDB is optional but highly recommended:
1. Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Add to `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dataguard
   ```
4. Restart backend

---

### Q: How do I deploy to production?
**A:** See `DEPLOYMENT.md` for complete guide. Quick summary:
1. Build frontend: `npm run build`
2. Deploy to Vercel/Netlify
3. Deploy backend to Heroku/AWS/DigitalOcean
4. Configure environment variables
5. Deploy smart contracts to Stellar mainnet
6. Update contract addresses

---

### Q: Is the data really stored on blockchain?
**A:** Yes and no:
- **File hash** is stored on Stellar blockchain (immutable)
- **File itself** is stored on your server/cloud (pointed to by storageUrl)
- **Metadata** is stored in MongoDB (backend database)

This is by design - blockchain is expensive, use it for verification, not storage.

---

### Q: How many datasets can I store?
**A:** Limited only by:
- **MongoDB:** Typically free tier allows 512MB
- **Blockchain:** Stellar has large storage capacity
- **Server:** Depends on your server storage
- **Costs:** Soroban transactions cost base fees + compute

---

### Q: Can I use SQLite instead of MongoDB?
**A:** Yes, with modifications:
1. Install SQLite package
2. Modify `backend/models/Dataset.model.js` to use SQLite ORM
3. Update connection in `backend/server.js`
4. Test thoroughly
5. See `ARCHITECTURE.md` for more details

---

### Q: What happens if contract is hacked?
**A:** If contract has vulnerability:
1. You can deploy a new version
2. Register new contract address
3. Old registrations remain immutable (by design)
4. Create migration process to new contract

---

## 🐛 Debug Mode

Enable detailed logging:

```javascript
// In src/services/apiService.js:
axios.interceptors.response.use(
  response => {
    console.log('API Response:', response);  // Add this
    return response;
  }
);

// In stellarService.js:
console.log('Stellar transaction:', transaction);  // Add before submit

// In backend/server.js:
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);  // Add this
  next();
});
```

---

## 📊 System Status Check

Run this to verify everything is working:

```bash
# 1. Check Node.js
node --version          # Should be v16+
npm --version          # Should be v8+

# 2. Check Git
git --version

# 3. Check Docker (optional)
docker --version
docker ps

# 4. Check Rust (optional, for contracts)
rustc --version

# 5. Verify files exist
ls -la .env
ls -la backend/.env
ls -la src/

# 6. Test backend
npm run backend        # Should show "Server running on http://localhost:5000"

# 7. Test frontend
npm run dev           # Should show "VITE v4.4.0 ready in xxx ms"

# 8. Test Freighter
# Open http://localhost:5173 and click "Connect Wallet"
```

---

## 🔗 Quick Links

- **Stellar Documentation:** https://developers.stellar.org/
- **Soroban Documentation:** https://soroban.stellar.org/
- **Freighter Wallet:** https://freighter.app/
- **Stellar Testnet:** https://horizon-testnet.stellar.org
- **Friendbot (get test funds):** https://laboratory.stellar.org/#account-creator?network=test
- **Stellar Dashboard:** https://stellar.expert/
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas

---

## 📞 Getting Help

1. **Check Documentation:**
   - README.md (overview)
   - QUICKSTART.md (setup)
   - DEPLOYMENT.md (full guide)
   - ARCHITECTURE.md (design)

2. **Check This File:** Search above for your error

3. **Check Logs:**
   - Browser Console: F12 → Console tab
   - Terminal Output: Check for error messages
   - Network Tab: F12 → Network tab for API calls

4. **Stack Overflow:** Search for specific error messages

5. **GitHub Issues:** Check repo issues if using version control

---

## ✅ Verification Checklist

Before starting, verify you have:

- [ ] Node.js v16+ installed
- [ ] npm package manager working
- [ ] .env file created from .env.example
- [ ] backend/.env created from template
- [ ] Freighter wallet installed (or ready to install)
- [ ] Terminal access (Command Prompt or PowerShell on Windows)
- [ ] Text editor or IDE (VS Code recommended)
- [ ] Port 5000 and 5173 available
- [ ] Stellar testnet access

---

**Still stuck? Check the main README.md or create an issue on GitHub! 🚀**
