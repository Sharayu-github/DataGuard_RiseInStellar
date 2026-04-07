/**
 * Wallet Service - Freighter Wallet Integration
 * Handles Freighter wallet operations and Stellar network interaction
 */

export const walletService = {
  /**
   * Check if Freighter wallet is installed
   */
  isFreighterInstalled: () => {
    return typeof window !== 'undefined' && !!window.freighter;
  },

  /**
   * Get the user's public key from Freighter
   */
  getPublicKey: async () => {
    if (!walletService.isFreighterInstalled()) {
      throw new Error('Freighter wallet not installed');
    }
    try {
      const publicKey = await window.freighter.getPublicKey();
      return publicKey;
    } catch (error) {
      throw new Error(`Failed to get public key: ${error.message}`);
    }
  },

  /**
   * Sign a transaction with Freighter
   */
  signTransaction: async (transactionEnvelope) => {
    if (!walletService.isFreighterInstalled()) {
      throw new Error('Freighter wallet not installed');
    }
    try {
      const signedXDR = await window.freighter.signTransaction(
        transactionEnvelope,
        {
          network: process.env.VITE_STELLAR_NETWORK || 'testnet'
        }
      );
      return signedXDR;
    } catch (error) {
      throw new Error(`Failed to sign transaction: ${error.message}`);
    }
  },

  /**
   * Request signing of a transaction
   */
  requestSignTransaction: async (transaction) => {
    if (!walletService.isFreighterInstalled()) {
      throw new Error('Freighter wallet not installed');
    }
    try {
      return await window.freighter.signTransaction(transaction);
    } catch (error) {
      if (error.message.includes('User denied')) {
        throw new Error('Transaction was rejected by user');
      }
      throw error;
    }
  },

  /**
   * Get account details from Stellar network
   */
  getAccountInfo: async (publicKey) => {
    const horizonUrl = process.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';
    try {
      const response = await fetch(`${horizonUrl}/accounts/${publicKey}`);
      if (!response.ok) {
        throw new Error('Account not found on network');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch account info: ${error.message}`);
    }
  },

  /**
   * Check if wallet is connected
   */
  isConnected: async () => {
    try {
      if (!walletService.isFreighterInstalled()) {
        return false;
      }
      await walletService.getPublicKey();
      return true;
    } catch {
      return false;
    }
  }
};

export default walletService;
