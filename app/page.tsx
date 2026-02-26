'use client'
import Features from '@/components/features'
import Navbar from '@/components/navbar'
import MotionWrapper from '@/components/MotionWrapper'
import NeonButton from '@/components/NeonButton'
import GlassCard from '@/components/GlassCard'
import { Iwebsite } from '@/model/website.model'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const Homepage = () => {
    const router = useRouter();
    const [websites, setWebsites] = useState<Iwebsite[]>([]);

    useEffect(() => {
        const getWebsites = async () => {
            try {
                const response = await axios.get('/api/get-websites');
                if (response.data.websites) {
                    setWebsites(response.data.websites);
                }
            } catch (error) {
                console.log('Error fetching websites for homepage');
            }
        };
        getWebsites();
    }, []);

    return (
        <div className='min-h-screen'>
            <Navbar />

            {/* Hero Section */}
            <div className='mx-auto max-w-7xl px-6 pt-24 pb-32 flex flex-col items-center text-center'>
                {/* Decorative badge */}
                <MotionWrapper delay={0}>
                    <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8'>
                        <span className='w-2 h-2 rounded-full bg-green-400 animate-pulse'></span>
                        <span className='text-sm text-gray-400'>Powered by Advanced AI</span>
                    </div>
                </MotionWrapper>

                <MotionWrapper delay={0.1}>
                    <h1 className='text-5xl sm:text-6xl md:text-8xl font-extrabold leading-[1.05] tracking-tight'>
                        <span className='text-white'>Build stunning</span>
                        <br />
                        <span className='text-white'>websites </span>
                        <span className='bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent'>
                            with AI
                        </span>
                    </h1>
                </MotionWrapper>

                <MotionWrapper delay={0.2} className='mt-8 max-w-2xl'>
                    <p className='text-lg md:text-xl text-gray-400 leading-relaxed'>
                        Describe your idea and let AI generate a modern, responsive
                        and production-ready website in seconds.
                    </p>
                </MotionWrapper>

                <MotionWrapper delay={0.35} className='mt-12 flex flex-col sm:flex-row items-center gap-4'>
                    <NeonButton variant='gold' onClick={() => router.push('/generate')} className='text-lg px-10 py-4'>
                        ✨ Generate Website
                    </NeonButton>
                    <motion.button
                        className='px-8 py-4 rounded-xl text-lg font-medium text-gray-300 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 cursor-pointer'
                        onClick={() => router.push('/pricing')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View Pricing →
                    </motion.button>
                </MotionWrapper>


            </div>

            {/* Features Section */}
            <div className='mx-auto max-w-7xl px-6 pb-24'>
                <Features />
            </div>
        </div>
    )
}

export default Homepage
