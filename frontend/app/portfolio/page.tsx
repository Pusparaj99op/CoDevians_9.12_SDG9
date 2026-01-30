'use client';

import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';

export default function PortfolioPage() {
  return (
    <ProtectedRoute>
      <PortfolioContent />
    </ProtectedRoute>
  );
}

function PortfolioContent() {
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
          <p className="text-gray-400">Track your bond investments and returns</p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Wallet Balance */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <span className="text-gray-400">Wallet Balance</span>
            </div>
            <p className="text-3xl font-bold text-green-400">
              {formatCurrency(user?.wallet?.balance || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Available for investment</p>
          </div>

          {/* Invested Amount */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <span className="text-gray-400">Invested Amount</span>
            </div>
            <p className="text-3xl font-bold text-blue-400">
              {formatCurrency(0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Across 0 bonds</p>
          </div>

          {/* Total Returns */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">📈</span>
              </div>
              <span className="text-gray-400">Expected Returns</span>
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              {formatCurrency(0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Annual yield</p>
          </div>
        </div>

        {/* Holdings Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-6">My Holdings</h2>
          
          {/* Empty State */}
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🏦</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No investments yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start building your portfolio by investing in infrastructure bonds. 
              Your investments will appear here.
            </p>
            <a
              href="/bonds"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all"
            >
              <span>Explore Bonds</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          
          <div className="text-center py-8">
            <p className="text-gray-400">No recent activity</p>
          </div>
        </div>

        {/* Paper Trading Notice */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="text-blue-300 font-semibold mb-1">Paper Trading Mode</h3>
              <p className="text-blue-200/70 text-sm">
                You&apos;re using virtual money for paper trading. This is a simulation environment 
                to help you learn about bond investments without any real financial risk.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
