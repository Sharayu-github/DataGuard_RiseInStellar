import React, { useState, useEffect } from 'react';
import { Eye, Calendar, Database, Search } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { formatDate, formatHash } from '../services/hashService';
import apiService from '../services/apiService';

const BrowsePage = () => {
  const { addToast } = useToast();
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDataset, setSelectedDataset] = useState(null);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getDatasets({ limit: 50 });
      if (response.status === 200) {
        setDatasets(response.data.datasets || []);
      }
    } catch (error) {
      addToast('Error loading datasets: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDatasets = datasets.filter((dataset) =>
    dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.datasetId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Datasets</h1>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by dataset name or ID..."
                className="input pl-12"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <Database className="w-12 h-12 text-blue-600" />
              </div>
              <p className="text-gray-600 mt-4">Loading datasets...</p>
            </div>
          ) : filteredDatasets.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchQuery ? 'No datasets found matching your search' : 'No datasets registered yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDatasets.map((dataset) => (
                <div
                  key={dataset.datasetId}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedDataset(dataset)}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                      {dataset.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-mono truncate mb-4">
                      {formatHash(dataset.datasetId, 12)}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(dataset.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Database className="w-4 h-4" />
                        <span>v{dataset.version || 1}</span>
                      </div>
                    </div>

                    <button
                      className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDataset(dataset);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Modal */}
        {selectedDataset && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedDataset.name}</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Dataset ID</h3>
                    <p className="font-mono text-sm bg-gray-50 p-3 rounded break-all">
                      {selectedDataset.datasetId}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">File Hash</h3>
                    <p className="font-mono text-sm bg-gray-50 p-3 rounded break-all">
                      {selectedDataset.fileHash}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Storage URL</h3>
                    <p className="text-sm bg-gray-50 p-3 rounded break-all">
                      {selectedDataset.storageUrl}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Description</h3>
                    <p className="text-sm text-gray-700">
                      {selectedDataset.description || 'No description provided'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Owner</h3>
                      <p className="font-mono text-sm text-gray-700 truncate">
                        {selectedDataset.ownerWallet}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Version</h3>
                      <p className="text-sm text-gray-700">v{selectedDataset.version || 1}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Created</h3>
                      <p className="text-sm text-gray-700">{formatDate(selectedDataset.createdAt)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Updated</h3>
                      <p className="text-sm text-gray-700">{formatDate(selectedDataset.updatedAt)}</p>
                    </div>
                  </div>

                  {selectedDataset.fileSize && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">File Size</h3>
                      <p className="text-sm text-gray-700">
                        {(selectedDataset.fileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedDataset(null)}
                  className="btn-secondary w-full mt-8"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
