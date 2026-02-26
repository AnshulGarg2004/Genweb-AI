'use client'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Coins } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Iuser } from '@/model/user.model';
import MotionWrapper from './MotionWrapper';
import { motion } from 'framer-motion';

const Navbar = () => {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<Iuser | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/get-current-user');
                setCurrentUser(response.data.user);
            } catch (error) {
                console.log("Error in getting user: ", error);
                setCurrentUser(null);
            }
        }
        fetchUser();
    }, [])

    console.log("Curent user: ", currentUser);
    

    return (
        <MotionWrapper delay={0} className='sticky top-0 z-50'>
            <nav
                className='border-b border-white/[0.06]'
                style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                }}
            >
                <div className='flex items-center justify-between px-6 py-4 max-w-7xl mx-auto'>
                    {/* Logo */}
                    <motion.h1
                        className='text-2xl font-bold cursor-pointer select-none'
                        onClick={() => router.push('/')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <span className='bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
                            Genweb
                        </span>
                        <span className='text-gray-600'>.ai</span>
                    </motion.h1>

                    {/* Nav Items */}
                    <div className='flex items-center gap-2'>
                        <motion.button
                            className='px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 cursor-pointer'
                            onClick={() => router.push("/pricing")}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Pricing
                            <span className='ml-1.5 text-xs px-1.5 py-0.5 rounded bg-white/[0.06] text-gray-500'>
                                {currentUser?.plan || "free"}
                            </span>
                        </motion.button>

                        <SignedOut>
                            <motion.button
                                className='px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 cursor-pointer'
                                onClick={() => router.push('/sign-in')}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Sign In
                            </motion.button>
                            <motion.button
                                className='px-5 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer'
                                onClick={() => router.push('/sign-up')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.25)',
                                }}
                            >
                                Sign Up
                            </motion.button>
                        </SignedOut>

                        <SignedIn>
                            <motion.button
                                className='px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 cursor-pointer'
                                onClick={() => router.push('/dashboard')}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.25)',
                                }}
                            >
                                Dashboard
                            </motion.button>
                            <div className='flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]'>
                                <Coins className='w-4 h-4 text-yellow-500' />
                                <span className='text-sm font-medium text-yellow-500/90'>
                                    {currentUser?.credits || 0}
                                </span>
                            </div>
                            <div className='ml-1'>
                                <UserButton />
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </nav>
        </MotionWrapper>
    )
}

export default Navbar
