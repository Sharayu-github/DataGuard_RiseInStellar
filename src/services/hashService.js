import CryptoJS from 'crypto-js';

/**
 * Calculate SHA-256 hash of a file
 */
export const calculateFileHash = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const fileContent = event.target.result;
        const hash = CryptoJS.SHA256(Array.from(new Uint8Array(fileContent)))
          .toString(CryptoJS.enc.Hex)
          .toUpperCase();
        resolve(hash);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(new Error('Error reading file: ' + error.message));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Verify file integrity by comparing hashes
 */
export const verifyFileIntegrity = async (file, expectedHash) => {
  const fileHash = await calculateFileHash(file);
  return {
    calculatedHash: fileHash,
    expectedHash: expectedHash.toUpperCase(),
    isValid: fileHash === expectedHash.toUpperCase(),
  };
};

/**
 * Generate a unique dataset ID
 */
export const generateDatasetId = () => {
  return `dsg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format hash for display (shortened)
 */
export const formatHash = (hash, length = 8) => {
  if (!hash) return '';
  return `${hash.substring(0, length)}...${hash.substring(hash.length - length)}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format timestamp
 */
export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};
