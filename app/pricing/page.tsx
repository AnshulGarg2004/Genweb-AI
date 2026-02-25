'use client';

import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { ArrowLeft, Coins, Crown, Sparkles, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import MotionWrapper from '@/components/MotionWrapper';
import NeonButton from '@/components/NeonButton';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen px-6 py-12">

      {/* Back Button */}
      <MotionWrapper delay={0}>
        <motion.div
          onClick={() => router.push('/')}
          className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition-colors mb-8 max-w-6xl mx-auto"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </motion.div>
      </MotionWrapper>

      {/* Header */}
      <MotionWrapper delay={0.1} className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </span>
        </h1>
        <p className="text-gray-400 mt-3 text-lg">Buy credits once. Build anytime.</p>
      </MotionWrapper>

      {/* Pricing Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {/* FREE PLAN */}
        <GlassCard glowColor='cyan' delay={0.2} className='p-8 flex flex-col justify-between'>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Free</h2>
            </div>
            <p className="text-gray-400">Perfect to explore genweb.ai</p>

            <div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                $0
              </h3>
              <span className="text-gray-500 text-sm">one-time</span>
              <div className="flex items-center gap-2 mt-2 text-yellow-400">
                <Coins className="h-4 w-4" />
                <span className="text-sm font-medium">100 Credits</span>
              </div>
            </div>

            <ul className="flex flex-col gap-2 text-sm mt-4 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> AI website generation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Responsive HTML output
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Basic animations
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <NeonButton
              variant='cyan'
              onClick={() => handlePricing('free')}
              className='w-full'
            >
              Get Started
            </NeonButton>
          </div>
        </GlassCard>

        {/* PRO PLAN */}
        <GlassCard glowColor='purple' delay={0.3} className='p-8 flex flex-col justify-between relative overflow-hidden'>
          {/* Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium"
              style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)' }}>
              Most Popular
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Pro</h2>
            </div>
            <p className="text-gray-400">For serious creators & freelancers</p>

            <div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                $25
              </h3>
              <span className="text-gray-500 text-sm">one-time</span>
              <div className="flex items-center gap-2 mt-2 text-yellow-400">
                <Coins className="h-4 w-4" />
                <span className="text-sm font-medium">500 Credits</span>
              </div>
            </div>

            <ul className="flex flex-col gap-2 text-sm mt-4 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">✓</span> Everything in Free
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">✓</span> Faster generations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">✓</span> Edit and regenerate
              </li>
            </ul>
          </div>

          <div className="mt-8">
            {loading === 'pro' ? (
              <div className="text-sm text-purple-400 text-center py-3">Redirecting...</div>
            ) : (
              <NeonButton
                variant='purple'
                onClick={() => handlePricing('pro')}
                className='w-full'
              >
                Upgrade to Pro
              </NeonButton>
            )}
          </div>
        </GlassCard>

        {/* ENTERPRISE PLAN */}
        <GlassCard glowColor='gold' delay={0.4} className='p-8 flex flex-col justify-between'>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Enterprise</h2>
            </div>
            <p className="text-gray-400">For teams & power users</p>

            <div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                $50
              </h3>
              <span className="text-gray-500 text-sm">one-time</span>
              <div className="flex items-center gap-2 mt-2 text-yellow-400">
                <Coins className="h-4 w-4" />
                <span className="text-sm font-medium">1000 Credits</span>
              </div>
            </div>

            <ul className="flex flex-col gap-2 text-sm mt-4 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span> Unlimited iterations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span> Highest priority
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span> Team collaboration
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span> Dedicated support
              </li>
            </ul>
          </div>

          <div className="mt-8">
            {loading === 'enterprise' ? (
              <div className="text-sm text-yellow-400 text-center py-3">Redirecting...</div>
            ) : (
              <NeonButton
                variant='gold'
                onClick={() => handlePricing('enterprise')}
                className='w-full'
              >
                Contact Sales
              </NeonButton>
            )}
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default Pricing;