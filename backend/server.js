const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
require('express-async-errors');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (optional)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✓ MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));
}

// Import routes
const datasetRoutes = require('./routes/dataset.routes');
const verifyRoutes = require('./routes/verify.routes');
const walletRoutes = require('./routes/wallet.routes');
const authRoutes = require('./routes/auth.routes');

// Routes middleware
app.use('/api/datasets', datasetRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DataGuard Stellar API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 DataGuard Stellar Backend Running`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🔌 API Base: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`\n✓ Database: ${process.env.MONGODB_URI ? 'MongoDB' : 'Disabled'}`);
  console.log(`✓ Network: ${process.env.STELLAR_NETWORK || 'testnet'}\n`);
});

module.exports = app;
