'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import { prefersReducedMotion, isMobile } from '@/lib/animations';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(balance);
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logo bounce animation on mount
  useEffect(() => {
    if (logoRef.current && !prefersReducedMotion()) {
      gsap.from(logoRef.current, {
        scale: 0,
        rotation: -180,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: 0.2,
      });
    }
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (!prefersReducedMotion()) {
      const menuItems = document.querySelectorAll('.mobile-menu-item');
      if (isMobileMenuOpen && menuItems.length > 0) {
        gsap.from(menuItems, {
          x: 50,
          opacity: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.out',
        });
      }
    }
  }, [isMobileMenuOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/40 backdrop-blur-xl border-b border-white/20 shadow-lg'
          : 'bg-black/20 backdrop-blur-lg border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span
              ref={logoRef}
              className="text-2xl group-hover:scale-110 transition-transform inline-block"
            >
              🏦
            </span>
            <span className="text-xl font-bold text-gradient-blue">Mudra</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-all relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="/bonds"
              className="text-gray-300 hover:text-white transition-all relative group"
            >
              Bonds
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="/leaderboard"
              className="text-gray-300 hover:text-white transition-all relative group"
            >
              Leaderboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300" />
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white transition-all relative group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  href="/portfolio"
                  className="text-gray-300 hover:text-white transition-all relative group"
                >
                  Portfolio
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </>
            )}

            {/* Auth Section */}
            {isLoading ? (
              <div className="w-20 h-9 glass rounded-lg shimmer" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Wallet Balance - Animated counter */}
                <div className="flex items-center gap-2 px-3 py-1.5 glass-strong border border-green-500/30 rounded-lg hover:border-green-500/50 transition-all group">
                  <span className="text-green-400 text-sm group-hover:scale-125 transition-transform inline-block">
                    💰
                  </span>
                  <span className="text-green-300 text-sm font-medium">
                    {formatBalance(user?.wallet?.balance || 0)}
                  </span>
                </div>
                {/* User Menu Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 glass-strong border border-white/20 hover:border-white/40 rounded-lg transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-300 text-sm max-w-24 truncate">{user?.name}</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        userMenuOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 glass-strong border border-white/20 rounded-lg shadow-xl overflow-hidden z-50">
                      {/* User Info */}
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{user?.name}</div>
                            <div className="text-gray-400 text-sm">{user?.email}</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span>📊</span>
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/portfolio"
                          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span>📈</span>
                          <span>Portfolio</span>
                        </Link>
                        <Link
                          href="/dashboard/transactions"
                          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span>📋</span>
                          <span>Transactions</span>
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span>⚙️</span>
                          <span>Profile & Settings</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="p-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-all"
                        >
                          <span>🚪</span>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button with hamburger animation */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6 transition-transform duration-300"
              style={{ transform: isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation - Slide out from right */}
        <div
          className={`md:hidden fixed inset-y-0 right-0 w-64 glass-strong border-l border-white/20 transform transition-transform duration-300 ease-in-out z-50 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏦</span>
                <span className="text-xl font-bold text-gradient-blue">Mudra</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="mobile-menu-item text-gray-300 hover:text-white hover:bg-white/10 transition-all px-4 py-3 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🏠 Home
                </Link>
                <Link
                  href="/bonds"
                  className="mobile-menu-item text-gray-300 hover:text-white hover:bg-white/10 transition-all px-4 py-3 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🏛️ Bonds
                </Link>
                <Link
                  href="/leaderboard"
                  className="mobile-menu-item text-gray-300 hover:text-white hover:bg-white/10 transition-all px-4 py-3 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🏆 Leaderboard
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      href="/dashboard"
                      className="mobile-menu-item text-gray-300 hover:text-white hover:bg-white/10 transition-all px-4 py-3 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      📊 Dashboard
                    </Link>
                    <Link
                      href="/portfolio"
                      className="mobile-menu-item text-gray-300 hover:text-white hover:bg-white/10 transition-all px-4 py-3 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      📈 Portfolio
                    </Link>
                    <Link
                      href="/dashboard/transactions"
                      className="mobile-menu-item text-gray-300 hover:text-white hover:bg-white/10 transition-all px-4 py-3 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      📋 Transactions
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="mobile-menu-item text-gray-300 hover:text-white hover:bg-white/10 transition-all px-4 py-3 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ⚙️ Profile & Settings
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Auth Section */}
            <div className="p-4 border-t border-white/10">
              {isAuthenticated ? (
                <>
                  <div className="mb-4 p-3 glass-strong border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-green-400 text-sm">💰</span>
                      <span className="text-green-300 text-xs">Wallet Balance</span>
                    </div>
                    <span className="text-green-300 text-lg font-bold">
                      {formatBalance(user?.wallet?.balance || 0)}
                    </span>
                  </div>
                  <div className="mb-3 p-3 glass rounded-lg">
                    <div className="text-gray-400 text-xs mb-1">Logged in as</div>
                    <div className="text-white font-medium">{user?.name}</div>
                    <div className="text-gray-400 text-sm">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 glass-strong hover:bg-red-500/30 text-red-300 rounded-lg font-medium transition-all border border-red-500/30"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all font-medium text-center border border-white/20 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white rounded-lg font-medium text-center transition-all hover:shadow-lg hover:shadow-orange-500/50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
}
