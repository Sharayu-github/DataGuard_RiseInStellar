import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Wallet } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isConnected, walletAddress, connectWallet, disconnectWallet, isLoading } = useWallet();
  const { addToast } = useToast();
  const location = useLocation();

  const handleConnect = async () => {
    const success = await connectWallet();
    if (success) {
      addToast('Wallet connected successfully!', 'success');
    } else {
      addToast('Failed to connect wallet', 'error');
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    addToast('Wallet disconnected', 'info');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Upload' },
    { path: '/verify', label: 'Verify' },
    { path: '/update', label: 'Update' },
    { path: '/browse', label: 'Browse' },
    { path: '/dashboard', label: 'Dashboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:inline">
              DataGuard Stellar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900 font-medium">
                    {walletAddress?.substring(0, 6)}...{walletAddress?.substring(-4)}
                  </span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="btn-primary hidden sm:inline-block"
              >
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t mt-4 pt-4">
              {isConnected ? (
                <>
                  <div className="px-4 py-2 bg-blue-50 rounded-lg mb-2 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-900 font-medium truncate">
                      {walletAddress}
                    </span>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="btn-primary w-full"
                >
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
