import React, { useState } from 'react';
import { Edit, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { calculateFileHash } from '../services/hashService';
import apiService from '../services/apiService';

const UpdatePage = () => {
  const { isConnected, walletAddress } = useWallet();
  const { addToast } = useToast();

  const [datasetId, setDatasetId] = useState('');
  const [file, setFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [changeDescription, setChangeDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <AlertCircle className="w-8 h-8 text-yellow-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
            <p className="text-gray-600">Please connect your Freighter wallet to update datasets</p>
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
      addToast('File hash calculated', 'success');
    } catch (error) {
      addToast('Error calculating file hash: ' + error.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!datasetId || !fileHash || !changeDescription) {
      addToast('Please fill in all required fields', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.updateDataset(datasetId, {
        fileHash,
        changeDescription,
        updatedByWallet: walletAddress,
        fileName: file?.name,
      });

      if (response.status === 200) {
        addToast('Dataset updated successfully!', 'success');
        setDatasetId('');
        setFile(null);
        setFileHash('');
        setChangeDescription('');
      }
    } catch (error) {
      addToast('Error updating dataset: ' + error.message, 'error');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Dataset</h1>
          <p className="text-gray-600 mb-8">
            Create a new version of your dataset with change tracking
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dataset ID */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Dataset ID *
              </label>
              <input
                type="text"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                placeholder="Enter the ID of dataset to update"
                className="input"
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                You must be the owner of this dataset to update it
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-4">
                Upload New Version *
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
                  <Edit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 font-medium">
                    Drag and drop new version here, or click to select
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
                  <p className="text-sm font-medium text-gray-900 mb-2">New Hash:</p>
                  <p className="font-mono text-xs text-gray-700 break-all">{fileHash}</p>
                </div>
              )}
            </div>

            {/* Change Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Change Description *
              </label>
              <textarea
                value={changeDescription}
                onChange={(e) => setChangeDescription(e.target.value)}
                placeholder="Describe what changed in this new version (e.g., added 500 new samples)"
                rows="4"
                className="input"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !fileHash || !changeDescription}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Updating Dataset...
                </>
              ) : (
                <>
                  <Edit className="w-5 h-5" />
                  Update & Register New Version
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">Version Control</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Each update creates a new immutable version on blockchain</li>
              <li>• Previous versions are preserved for audit trail</li>
              <li>• Change descriptions help track dataset evolution</li>
              <li>• All versions are timestamped and verified</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;
