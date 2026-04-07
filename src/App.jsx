import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import VerifyPage from './pages/VerifyPage';
import UpdatePage from './pages/UpdatePage';
import BrowsePage from './pages/BrowsePage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <WalletProvider>
        <ToastProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
              <AnimatedBackground />
              
              <Navbar />
              
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/verify" element={<VerifyPage />} />
                <Route path="/update" element={<UpdatePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>

              <Toast />

              {/* Footer */}
              <footer className="bg-gray-900 text-gray-400 mt-20 py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                      <h3 className="text-white font-bold mb-4">DataGuard Stellar</h3>
                      <p className="text-sm">
                        Cloud-based dataset integrity platform powered by Stellar blockchain
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-4">Product</h4>
                      <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white">Upload</a></li>
                        <li><a href="#" className="hover:text-white">Verify</a></li>
                        <li><a href="#" className="hover:text-white">Browse</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-4">Resources</h4>
                      <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white">Documentation</a></li>
                        <li><a href="#" className="hover:text-white">API Docs</a></li>
                        <li><a href="#" className="hover:text-white">Support</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-4">Legal</h4>
                      <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white">Privacy</a></li>
                        <li><a href="#" className="hover:text-white">Terms</a></li>
                        <li><a href="#" className="hover:text-white">License</a></li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-8">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">
                        © 2026 DataGuard Stellar. All rights reserved.
                      </p>
                      <div className="flex gap-4">
                        <a href="#" className="hover:text-white">Twitter</a>
                        <a href="#" className="hover:text-white">GitHub</a>
                        <a href="#" className="hover:text-white">Discord</a>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </ToastProvider>
      </WalletProvider>
    </BrowserRouter>
  );
}

export default App;
