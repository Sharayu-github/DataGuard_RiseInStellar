import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { calculateFileHash, generateDatasetId } from '../services/hashService';
import apiService from '../services/apiService';

const UploadPage = () => {
  const { isConnected, walletAddress } = useWallet();
  const { addToast } = useToast();

  const [file, setFile] = useState(null);
  const [datasetName, setDatasetName] = useState('');
  const [datasetId, setDatasetId] = useState('');
  const [storageUrl, setStorageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <AlertCircle className="w-8 h-8 text-yellow-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
            <p className="text-gray-600">Please connect your Freighter wallet to upload datasets</p>
          </div>
        </div>
      </div>
    );
  }

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const hash = await calculateFileHash(selectedFile);
      setFileHash(hash);
      addToast('File hash calculated successfully', 'success');
    } catch (error) {
      addToast('Error calculating file hash: ' + error.message, 'error');
    } finally {
      setIsProcessing(false);
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
        addToast('File hash calculated successfully', 'success');
      } catch (error) {
        addToast('Error calculating file hash: ' + error.message, 'error');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!datasetName || !storageUrl || !fileHash) {
      addToast('Please fill in all required fields', 'warning');
      return;
    }

    const finalDatasetId = datasetId || generateDatasetId();

    setIsLoading(true);
    try {
      const response = await apiService.registerDataset({
        datasetId: finalDatasetId,
        name: datasetName,
        ownerWallet: walletAddress,
        fileHash,
        storageUrl,
        description,
        fileName: file?.name,
        fileSize: file?.size,
      });

      if (response.status === 201) {
        addToast('Dataset registered successfully!', 'success');
        // Reset form
        setFile(null);
        setDatasetName('');
        setDatasetId('');
        setStorageUrl('');
        setDescription('');
        setFileHash('');
      }
    } catch (error) {
      addToast('Error registering dataset: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload & Register Dataset</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-4">
                Select Dataset File *
              </label>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  id="file-input"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 font-medium">
                    Drag and drop your file here, or click to select
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Supported: CSV, JSON, Parquet, etc.</p>
                </label>
              </div>

              {file && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}

              {fileHash && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">File Hash (SHA-256):</p>
                  <p className="font-mono text-xs text-gray-700 break-all">{fileHash}</p>
                </div>
              )}
            </div>

            {/* Dataset Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Dataset Name *
                </label>
                <input
                  type="text"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  placeholder="e.g., Image Classification v1.0"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Dataset ID (Optional)
                </label>
                <input
                  type="text"
                  value={datasetId}
                  onChange={(e) => setDatasetId(e.target.value)}
                  placeholder="Auto-generated if empty"
                  className="input"
                />
              </div>
            </div>

            {/* Storage URL */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Storage URL (S3, IPFS, etc.) *
              </label>
              <input
                type="url"
                value={storageUrl}
                onChange={(e) => setStorageUrl(e.target.value)}
                placeholder="https://s3.example.com/dataset.csv"
                className="input"
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                Where the dataset is stored (S3 bucket, IPFS hash, etc.)
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your dataset, its purpose, and any important notes..."
                rows="4"
                className="input"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isProcessing || !fileHash}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Registering Dataset...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Register on Blockchain
                </>
              )}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>1. Your file hash is calculated using SHA-256 algorithm</li>
              <li>2. Dataset metadata is stored securely in our database</li>
              <li>3. Hash is registered on Stellar Soroban blockchain</li>
              <li>4. You can verify dataset integrity anytime</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
