import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Database } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { formatDate, formatHash } from '../services/hashService';
import apiService from '../services/apiService';

const Dashboard = () => {
  const { isConnected, walletAddress } = useWallet();
  const { addToast } = useToast();

  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDatasets: 0,
    totalVerifications: 0,
    lastUpdated: null,
  });

  useEffect(() => {
    if (isConnected && walletAddress) {
      loadUserData();
    }
  }, [isConnected, walletAddress]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getWalletDatasets(walletAddress);
      if (response.status === 200) {
        setDatasets(response.data.datasets || []);
        setStats({
          totalDatasets: response.data.datasets?.length || 0,
          totalVerifications: response.data.verifications || 0,
          lastUpdated: response.data.lastUpdated || new Date(),
        });
      }
    } catch (error) {
      addToast('Error loading dashboard: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Dashboard Locked</h2>
          <p className="text-gray-600">
            Connect your Freighter wallet to view your personal dashboard and manage datasets
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
          <p className="text-gray-600">Manage and track all your registered datasets</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Datasets</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDatasets}</p>
              </div>
              <Database className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Verifications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalVerifications}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {stats.lastUpdated ? formatDate(stats.lastUpdated) : 'N/A'}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Datasets Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Datasets</h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <Database className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
              <p className="text-gray-600">Loading datasets...</p>
            </div>
          ) : datasets.length === 0 ? (
            <div className="p-12 text-center">
              <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No datasets registered yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Dataset Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Dataset ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Hash (First 16)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {datasets.map((dataset) => (
                    <tr key={dataset.datasetId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {dataset.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                        {formatHash(dataset.datasetId, 8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        v{dataset.version || 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(dataset.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                        {formatHash(dataset.fileHash, 16)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
