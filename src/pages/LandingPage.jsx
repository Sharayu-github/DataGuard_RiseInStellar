import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Lock, BarChart3, Zap } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const LandingPage = () => {
  const { isConnected } = useWallet();

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Tamper-Proof Storage',
      description: 'Dataset hashes stored immutably on Stellar blockchain'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Version Control',
      description: 'Track every modification with complete history'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Analytics Dashboard',
      description: 'Real-time statistics and insights on your datasets'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Verification',
      description: 'Verify dataset integrity in seconds'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-2">
            <span className="text-white text-sm font-medium">Powered by Stellar Soroban</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Dataset Integrity on Blockchain
          </h1>

          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Ensure your AI training datasets are untampered, versioned, and verifiable using Stellar blockchain technology
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isConnected ? (
              <>
                <Link to="/upload" className="btn-primary inline-flex items-center justify-center gap-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/dashboard" className="btn-secondary inline-block">
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/upload" className="btn-primary inline-flex items-center justify-center gap-2">
                  <span>Connect Wallet & Start</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#features" className="btn-secondary inline-block">
                  Learn More
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why DataGuard Stellar?</h2>
            <p className="text-lg text-gray-600">
              Solve critical problems with blockchain-guaranteed data integrity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-xl border border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-blue-100">Immutable Records</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{'< 1s'}</div>
              <p className="text-blue-100">Verification Time</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="text-blue-100">Datasets Verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">How It Works</h2>

          <div className="space-y-8">
            {[
              { step: 1, title: 'Connect Wallet', desc: 'Link your Freighter wallet to get started' },
              { step: 2, title: 'Upload Dataset', desc: 'Select and upload your dataset file' },
              { step: 3, title: 'Register on Blockchain', desc: 'Store dataset hash on Stellar Soroban' },
              { step: 4, title: 'Verify Anytime', desc: 'Verify dataset integrity at any time' },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  {item.step < 4 && <div className="w-1 h-16 bg-blue-200 mt-2" />}
                </div>
                <div className="py-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Secure Your Datasets?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Start using DataGuard Stellar today and get blockchain-guaranteed data integrity
          </p>
          <Link to="/upload" className="btn-primary inline-flex items-center justify-center gap-2">
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
