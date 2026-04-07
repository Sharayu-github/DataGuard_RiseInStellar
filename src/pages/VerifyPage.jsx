import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Loader, Shield } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { calculateFileHash, verifyFileIntegrity, formatHash, formatDate } from '../services/hashService';
import apiService from '../services/apiService';

const VerifyPage = () => {
  const { addToast } = useToast();

  const [datasetId, setDatasetId] = useState('');
  const [file, setFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const hash = await calculateFileHash(selectedFile);
      setFileHash(hash);
      addToast('File hash calculated', 'success');
    } catch (error) {
      addToast('Error calculating file hash: ' + error.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!datasetId || !fileHash) {
      addToast('Please provide dataset ID and file', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.verifyDataset(datasetId, fileHash);

      if (response.status === 200) {
        setVerificationResult(response.data);
        addToast(
          response.data.isValid
            ? 'Dataset verified! File is authentic.'
            : 'Verification failed! File hash does not match.',
          response.data.isValid ? 'success' : 'error'
        );
      }
    } catch (error) {
      addToast('Verification error: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      setFile(file);
      setIsProcessing(true);

      try {
        const hash = await calculateFileHash(file);
        setFileHash(hash);
        addToast('File hash calculated', 'success');
      } catch (error) {
        addToast('Error calculating file hash: ' + error.message, 'error');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Dataset Integrity</h1>
          <p className="text-gray-600 mb-8">
            Upload a file and verify its authenticity against the blockchain record
          </p>

          <form onSubmit={handleVerify} className="space-y-8">
            {/* Dataset ID */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Dataset ID *
              </label>
              <input
                type="text"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                placeholder="e.g., dsg_1234567890_abc123"
                className="input"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-4">
                Upload File to Verify *
              </label>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
              >
                <input
                  type="file"
                  id="file-input"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 font-medium">
                    Drag and drop your file here, or click to select
                  </p>
                </label>
              </div>

              {file && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}

              {fileHash && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">Calculated Hash:</p>
                  <p className="font-mono text-xs text-gray-700 break-all">{fileHash}</p>
                </div>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || !fileHash}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Verify Integrity
                </>
              )}
            </button>
          </form>

          {/* Verification Result */}
          {verificationResult && (
            <div className="mt-10 p-6 rounded-lg border-2" 
              style={{
                borderColor: verificationResult.isValid ? '#10b981' : '#ef4444',
                backgroundColor: verificationResult.isValid ? '#ecfdf5' : '#fef2f2'
              }}>
              <div className="flex items-start gap-4">
                {verificationResult.isValid ? (
                  <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold" 
                    style={{ color: verificationResult.isValid ? '#059669' : '#dc2626' }}>
                    {verificationResult.isValid ? '✓ File Authentic' : '✗ File Modified'}
                  </h3>
                  <p className="text-gray-700 mt-2">
                    {verificationResult.isValid
                      ? 'The file hash matches the blockchain record. Your dataset appears authentic.'
                      : 'The file hash does not match the blockchain record. The file may have been modified.'}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">Expected Hash:</span>
                      <p className="font-mono text-xs text-gray-700 break-all">
                        {formatHash(verificationResult.expectedHash, 16)}
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">Calculated Hash:</span>
                      <p className="font-mono text-xs text-gray-700 break-all">
                        {formatHash(verificationResult.calculatedHash, 16)}
                      </p>
                    </div>
                  </div>

                  {verificationResult.blockchainData && (
                    <div className="mt-4 pt-4 border-t" style={{
                      borderColor: verificationResult.isValid ? '#d1fae5' : '#fee2e2'
                    }}>
                      <p className="text-sm font-medium text-gray-900">Registered on Blockchain:</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(verificationResult.blockchainData.timestamp)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">How verification works</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>1. Enter the Dataset ID you want to verify</li>
              <li>2. Upload the file you want to check</li>
              <li>3. System calculates the file's hash using SHA-256</li>
              <li>4. Compares it with the blockchain record</li>
              <li>5. Shows you if the file is authentic or modified</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
