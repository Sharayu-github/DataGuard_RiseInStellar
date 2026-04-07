import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Dataset endpoints
  registerDataset: (data) => apiClient.post('/datasets/register', data),
  updateDataset: (datasetId, data) => apiClient.put(`/datasets/${datasetId}`, data),
  getDataset: (datasetId) => apiClient.get(`/datasets/${datasetId}`),
  getDatasets: (filters) => apiClient.get('/datasets', { params: filters }),
  getDatasetHistory: (datasetId) => apiClient.get(`/datasets/${datasetId}/history`),
  deleteDataset: (datasetId) => apiClient.delete(`/datasets/${datasetId}`),

  // Verification endpoints
  verifyDataset: (datasetId, hash) => apiClient.post(`/verify/${datasetId}`, { hash }),
  getVerificationHistory: (datasetId) => apiClient.get(`/verify/${datasetId}/history`),

  // Wallet endpoints
  getWalletBalance: (walletAddress) => apiClient.get(`/wallet/balance/${walletAddress}`),
  getWalletDatasets: (walletAddress) => apiClient.get(`/wallet/${walletAddress}/datasets`),

  // Blockchain endpoints
  storeOnBlockchain: (data) => apiClient.post('/blockchain/store', data),
  getBlockchainVerification: (datasetId) => apiClient.get(`/blockchain/verify/${datasetId}`),

  // Auth endpoints
  login: (walletAddress) => apiClient.post('/auth/login', { walletAddress }),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/profile'),
};

export default apiService;
