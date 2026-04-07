import { Keypair, TransactionBuilder, Networks, Operation, BASE_FEE } from 'stellar-sdk';

class StellarService {
  constructor() {
    this.testnetHorizon = 'https://horizon-testnet.stellar.org';
    this.network = 'testnet';
  }

  /**
   * Get Stellar server instance
   */
  getServer() {
    const StellarSdk = require('stellar-sdk');
    return new StellarSdk.Server(this.testnetHorizon);
  }

  /**
   * Verify wallet is on testnet
   */
  async verifyTestnetNetwork() {
    try {
      const isAllowed = await window.freighter.isAllowed();
      if (!isAllowed) {
        throw new Error('Freighter not allowed');
      }
      return true;
    } catch (error) {
      console.error('Network verification error:', error);
      return false;
    }
  }

  /**
   * Sign and submit transaction
   */
  async signAndSubmitTransaction(transactionXDR) {
    try {
      if (!window.freighter) {
        throw new Error('Freighter wallet not available');
      }

      const signedXDR = await window.freighter.signTransaction(transactionXDR);
      const server = this.getServer();
      const transaction = new (require('stellar-sdk')).Transaction(signedXDR);

      const response = await server.submitTransaction(transaction);
      return response;
    } catch (error) {
      console.error('Transaction signing error:', error);
      throw error;
    }
  }

  /**
   * Store dataset hash on blockchain
   */
  async storeDatasetHash(walletAddress, datasetId, datasetHash, metadata) {
    try {
      // This would interact with your Soroban smart contract
      // For now, returning a mock structure
      const server = this.getServer();
      const sourceAccount = await server.loadAccount(walletAddress);

      const transactionBuilder = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET_NETWORK_PASSPHRASE,
      });

      // Build transaction with contract invocation
      // This is a simplified version - actual implementation would use Soroban SDK
      const transaction = transactionBuilder
        .setBaseFee(BASE_FEE)
        .addMemo(new (require('stellar-sdk')).Memo.text(`Dataset: ${datasetId}`))
        .build();

      return await this.signAndSubmitTransaction(transaction.toEnvelope().toXDR());
    } catch (error) {
      console.error('Error storing dataset hash:', error);
      throw error;
    }
  }

  /**
   * Retrieve dataset verification data from blockchain
   */
  async retrieveDatasetVerification(datasetId) {
    try {
      // This would call your Soroban contract to retrieve stored verification data
      const server = this.getServer();
      // Implementation would interact with contract storage
      
      return {
        datasetId,
        verified: true,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error retrieving dataset verification:', error);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getAccountBalance(publicKey) {
    try {
      const server = this.getServer();
      const account = await server.accounts().accountId(publicKey).call();

      const nativeBalance = account.balances.find((b) => b.asset_type === 'native');
      return nativeBalance ? parseFloat(nativeBalance.balance) : 0;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }

  /**
   * Get account details
   */
  async getAccountDetails(publicKey) {
    try {
      const server = this.getServer();
      return await server.accounts().accountId(publicKey).call();
    } catch (error) {
      console.error('Error fetching account details:', error);
      return null;
    }
  }

  /**
   * Format XLM amount
   */
  formatXlm(amount) {
    return `${parseFloat(amount).toFixed(4)} XLM`;
  }
}

export const stellarService = new StellarService();
export default stellarService;
