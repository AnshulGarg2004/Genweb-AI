'use client';

import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { ArrowLeft, Coins } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Pricing = () => {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePricing = async (planType: string) => {
    if (!user) {
      router.push('/');
      return;
    }

    if (planType === 'free') {
      router.push('/dashboard');
      return;
    }

    setLoading(planType);

    try {
      const response = await axios.post(
        '/api/stripe',
        { planType }, 
        { withCredentials: true }
      );

      if (response?.data?.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      }
    } catch (error) {
      console.log('Error fetching billing session:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      
      {/* Back Button */}
      <div
        onClick={() => router.push('/')}
        className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-black mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="text-gray-600 mt-2">Buy credits once. Build anytime.</p>
      </div>

      {/* Pricing Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {/* FREE PLAN */}
        <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Free</h2>
            <p className="text-gray-600">Perfect to explore genweb.ai</p>

            <div>
              <h3 className="text-3xl font-bold">$0 / one-time</h3>
              <div className="flex items-center gap-2 mt-1">
                <Coins className="h-5 w-5" />
                <span>100 Credits</span>
              </div>
            </div>

            <ul className="flex flex-col gap-2 text-sm mt-4">
              <li>✓ AI website generation</li>
              <li>✓ Responsive HTML output</li>
              <li>✓ Basic animations</li>
            </ul>
          </div>

          <button
            onClick={() => handlePricing('free')}
            className="mt-6 bg-gray-800 text-white py-2 rounded-lg hover:bg-black transition"
          >
            Get Started
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="bg-purple-600 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between relative">
          
          <div className="absolute top-4 right-4 bg-white text-purple-600 text-xs px-3 py-1 rounded-full font-medium">
            Most Popular
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Pro</h2>
            <p className="opacity-90">For serious creators & freelancers</p>

            <div>
              <h3 className="text-3xl font-bold">$25 / one-time</h3>
              <div className="flex items-center gap-2 mt-1">
                <Coins className="h-5 w-5" />
                <span>500 Credits</span>
              </div>
            </div>

            <ul className="flex flex-col gap-2 text-sm mt-4">
              <li>✓ Everything in Free</li>
              <li>✓ Faster generations</li>
              <li>✓ Edit and regenerate</li>
            </ul>
          </div>

          {loading === 'pro' ? (
            <div className="mt-6 text-sm">Redirecting...</div>
          ) : (
            <button
              onClick={() => handlePricing('pro')}
              className="mt-6 bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Upgrade to Pro
            </button>
          )}
        </div>

        {/* ENTERPRISE PLAN */}
        <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Enterprise</h2>
            <p className="text-gray-600">For teams & power users</p>

            <div>
              <h3 className="text-3xl font-bold">$50 / one-time</h3>
              <div className="flex items-center gap-2 mt-1">
                <Coins className="h-5 w-5" />
                <span>1000 Credits</span>
              </div>
            </div>

            <ul className="flex flex-col gap-2 text-sm mt-4">
              <li>✓ Unlimited iterations</li>
              <li>✓ Highest priority</li>
              <li>✓ Team collaboration</li>
              <li>✓ Dedicated support</li>
            </ul>
          </div>

          {loading === 'enterprise' ? (
            <div className="mt-6 text-sm">Redirecting...</div>
          ) : (
            <button
              onClick={() => handlePricing('enterprise')}
              className="mt-6 bg-gray-800 text-white py-2 rounded-lg hover:bg-black transition"
            >
              Contact Sales
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Pricing;