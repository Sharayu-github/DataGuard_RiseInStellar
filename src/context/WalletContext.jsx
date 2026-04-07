import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMockMode, setIsMockMode] = useState(false);

  // Check if Freighter is installed
  const isFreighterInstalled = useCallback(() => {
    return typeof window !== 'undefined' && !!window.freighter;
  }, []);

  // Generate mock wallet address for testing
  const generateMockAddress = useCallback(() => {
    return 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try Freighter first
      if (isFreighterInstalled()) {
        try {
          const publicKey = await window.freighter.getPublicKey();
          if (publicKey) {
            setWalletAddress(publicKey);
            setIsConnected(true);
            setIsMockMode(false);
            localStorage.setItem('walletAddress', publicKey);
            localStorage.setItem('isMockMode', 'false');
            return true;
          }
        } catch (freighterErr) {
          console.warn('Freighter error, using test mode:', freighterErr.message);
        }
      }

      // Fallback to mock/test mode for development
      console.warn('Freighter not available. Using TEST MODE for development.');
      const mockAddress = generateMockAddress();
      setWalletAddress(mockAddress);
      setIsConnected(true);
      setIsMockMode(true);
      localStorage.setItem('walletAddress', mockAddress);
      localStorage.setItem('isMockMode', 'true');
      setError('⚠️ Using TEST MODE - Install Freighter for production use');
      return true;
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
      console.error('Wallet connection error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isFreighterInstalled, generateMockAddress]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setIsConnected(false);
    setBalance(null);
    setIsMockMode(false);
    setError(null);
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('isMockMode');
  }, []);

  // Get wallet balance
  const getBalance = useCallback(async () => {
    if (!walletAddress) return null;

    try {
      setIsLoading(true);
      
      // In mock mode, return dummy balance
      if (isMockMode) {
        setBalance('9999.99');
        return '9999.99';
      }

      // Real Stellar balance lookup
      const horizonUrl = process.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';
      const response = await fetch(`${horizonUrl}/accounts/${walletAddress}`);
      
      if (response.ok) {
        const data = await response.json();
        const nativeBalance = data.balances.find(b => b.asset_type === 'native');
        const balance = nativeBalance ? nativeBalance.balance : '0';
        setBalance(balance);
        return balance;
      } else {
        // Account not on network
        const testBalance = '0.00';
        setBalance(testBalance);
        return testBalance;
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, isMockMode]);

  // Check if wallet is connected on load
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    const savedMockMode = localStorage.getItem('isMockMode');
    if (savedAddress) {
      setWalletAddress(savedAddress);
      setIsConnected(true);
      setIsMockMode(savedMockMode === 'true');
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        balance,
        isLoading,
        error,
        connectWallet,
        disconnectWallet,
        getBalance,
        isFreighterInstalled,
        isMockMode,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
