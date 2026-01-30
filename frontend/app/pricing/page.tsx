'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

interface PricingPlan {
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: string[];
  cta: string;
  ctaLink: string;
  popular?: boolean;
  highlight?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Paper Trading',
    price: {
      monthly: 0,
      yearly: 0
    },
    description: 'Perfect for beginners to learn and practice',
    features: [
      '₹10,00,000 virtual money',
      'Access to all bonds',
      'Paper trading only',
      'Basic portfolio tracking',
      'Transaction history',
      'Educational resources',
      'Mobile responsive',
      'Email support'
    ],
    cta: 'Start Free',
    ctaLink: '/register',
    highlight: 'Forever Free'
  },
  {
    name: 'Basic',
    price: {
      monthly: 499,
      yearly: 4990
    },
    description: 'For serious investors ready to invest real money',
    features: [
      'Everything in Free',
      'Real money trading',
      'Advanced analytics',
      'Risk assessment tools',
      'Portfolio optimization',
      'Priority email support',
      'API access',
      'Custom alerts',
      'Tax reports'
    ],
    cta: 'Get Started',
    ctaLink: '/register',
    popular: true
  },
  {
    name: 'Premium',
    price: {
      monthly: 1999,
      yearly: 19990
    },
    description: 'For professional investors and institutions',
    features: [
      'Everything in Basic',
      'Dedicated account manager',
      'Advanced AI insights',
      'Custom investment strategies',
      'Bulk trading',
      'White-label solutions',
      '24/7 phone support',
      'Early access to new bonds',
      'Quarterly investment reviews',
      'Custom integrations'
    ],
    cta: 'Contact Sales',
    ctaLink: '/register',
    highlight: 'Best Value'
  }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number) => {
    const yearlyCostIfMonthly = monthlyPrice * 12;
    const savings = yearlyCostIfMonthly - yearlyPrice;
    return Math.round((savings / yearlyCostIfMonthly) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Choose the plan that fits your investment journey. Start free with paper trading,
              upgrade anytime to access real money investing.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-full p-2 border border-white/20">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl overflow-hidden transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 transform md:scale-105 shadow-2xl shadow-yellow-500/20'
                    : 'bg-white/10 border border-white/20'
                } backdrop-blur-lg`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-bl-xl">
                    MOST POPULAR
                  </div>
                )}

                {/* Highlight Badge */}
                {plan.highlight && !plan.popular && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {plan.highlight}
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/60 text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    {plan.price[billingCycle] === 0 ? (
                      <div>
                        <span className="text-5xl font-bold text-white">Free</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-white">
                            {formatPrice(plan.price[billingCycle])}
                          </span>
                          <span className="text-white/60">
                            /{billingCycle === 'monthly' ? 'month' : 'year'}
                          </span>
                        </div>
                        {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                          <p className="text-green-400 text-sm mt-2">
                            Save {calculateYearlySavings(plan.price.monthly, plan.price.yearly)}% with yearly billing
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={plan.ctaLink}
                    className={`block w-full text-center py-3 rounded-xl font-semibold transition-all mb-8 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white shadow-lg shadow-yellow-500/30'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  {/* Features */}
                  <div className="space-y-3">
                    <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">
                      What&apos;s Included:
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-white/80 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Can I switch plans later?
                </h3>
                <p className="text-white/70">
                  Yes! You can upgrade or downgrade your plan anytime. Changes take effect immediately,
                  and we&apos;ll prorate the difference.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-white/70">
                  We accept all major credit cards, debit cards, UPI, and net banking.
                  All payments are processed securely through our payment partners.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Is there a long-term commitment?
                </h3>
                <p className="text-white/70">
                  No! All plans are month-to-month or year-to-year with no long-term contracts.
                  Cancel anytime with no penalties.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-3">
                  What happens to my portfolio if I downgrade?
                </h3>
                <p className="text-white/70">
                  Your portfolio and transaction history remain intact. You&apos;ll simply lose access
                  to premium features until you upgrade again.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 rounded-2xl p-12 border border-orange-500/30">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Investing?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join hundreds of investors building their infrastructure portfolio.
              Start with paper trading, upgrade when you&apos;re ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-orange-500/50"
              >
                Start Free Today
              </Link>
              <Link
                href="/bonds"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 transition-all"
              >
                View Bonds
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
