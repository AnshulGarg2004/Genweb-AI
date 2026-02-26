'use client'
import { Iwebsite } from '@/model/website.model'
import { useUser } from '@clerk/nextjs'
import axios from 'axios';
import { motion } from 'framer-motion'
import { CheckCircle, Plus, Rocket, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import GlassCard from '@/components/GlassCard'
import MotionWrapper from '@/components/MotionWrapper'
import NeonButton from '@/components/NeonButton'


const Dashboard = () => {
    const [websites, setWebsites] = useState<Iwebsite[]>([]);
    const [copiedId, setCopiedId] = useState<string>("");
    const router = useRouter();
    const { user } = useUser();
    console.log("user of clerk: ", user);

    const handleCopy = async (website: Iwebsite) => {
        await navigator.clipboard.writeText(website.deployedUrl);
        setCopiedId(website._id.toString());
        setTimeout(() => setCopiedId(""), 2000);
    }
    const handleDeploy = async (id: string) => {
        try {
            const response = await axios.get(`/api/deploy/${id}`);
            if (!response) {
                console.log("error in deplying");
            }
            console.log("Response of deployed: ", response);
            window.open(`${response.data.deployedUrl}`, "_blank");

        } catch (error) {
            console.log("Cannot deploy");
        }
    }
    useEffect(() => {
        const getWebsites = async () => {
            try {
                const resposne = await axios.get('/api/get-websites');
                console.log("Response of getWebsites from dashboard: ", resposne);
                if (!resposne) {
                    console.log("Cannot fetch websites in dashboard");
                }

                setWebsites(resposne.data.websites);
            } catch (error) {
                console.log("Error in fetching web in dash");

            }
        }
        getWebsites();
    }, [])
    return (
        <div className='min-h-screen'>
            {/* Header */}
            <MotionWrapper delay={0}>
                <div className='backdrop-blur-xl bg-white/5 border-b border-white/10'>
                    <div className='flex items-center justify-between px-6 py-4 max-w-7xl mx-auto'>
                        <h1 className='text-2xl font-bold cursor-pointer' onClick={() => router.push('/')}>
                            <span className='bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
                                Genweb
                            </span>
                            <span className='text-gray-500'>.AI</span>
                        </h1>
                        <NeonButton variant='cyan' onClick={() => router.push('/generate')} className='flex items-center gap-2'>
                            <Plus className='h-4 w-4' /> New Website
                        </NeonButton>
                    </div>
                </div>
            </MotionWrapper>

            {/* Welcome */}
            <div className='max-w-7xl mx-auto px-6 py-10'>
                <MotionWrapper delay={0.1}>
                    <h2 className='text-4xl font-bold'>
                        Welcome Back,{' '}
                        <span className='bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>
                            {user?.firstName} {user?.lastName}
                        </span>
                    </h2>
                    <p className='text-gray-400 mt-2'>Here are your generated websites</p>
                </MotionWrapper>

                {/* Website Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10'>
                    {websites.map((website, index) => {
                        const copied = copiedId === website._id.toString();
                        return (
                            <GlassCard
                                key={index}
                                glowColor='blue'
                                delay={0.2 + index * 0.1}
                                className='overflow-hidden flex flex-col group'
                            >
                                {/* Preview */}
                                <div
                                    className='cursor-pointer'
                                    onClick={() => router.push(`/editor/${website._id}`)}
                                >
                                    <div className='relative h-52 overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-900 to-gray-950 border-b border-white/5'>
                                        <iframe
                                            srcDoc={website.latestCode}
                                            className='w-full h-full pointer-events-none scale-[0.55] origin-top-left transition-transform duration-500 group-hover:scale-[0.58]'
                                            style={{ width: '182%', height: '182%' }}
                                        />
                                        {/* Hover overlay */}
                                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4'>
                                            <span className='text-xs font-medium text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10'>
                                                Click to edit
                                            </span>
                                        </div>
                                    </div>
                                    <div className='px-5 pt-4'>
                                        <h3 className='text-lg font-semibold text-white truncate group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300'>{website.title}</h3>
                                        <p className='text-xs text-gray-500 mt-1 truncate'>
                                            {website.deployed ? '🟢 Deployed' : '🔵 Draft'}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className='px-5 pb-5 pt-3 mt-auto flex items-center gap-3'>
                                    {website.deployed ? (
                                        <motion.button
                                            whileHover={{
                                                scale: 1.05,
                                                filter: 'brightness(1.2)',
                                                boxShadow: copied
                                                    ? '0 0 30px rgba(251,191,36,0.5), 0 0 60px rgba(251,191,36,0.2)'
                                                    : '0 0 30px rgba(52,211,153,0.5), 0 0 60px rgba(52,211,153,0.2)',
                                            }}
                                            whileTap={{ scale: 0.93 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                            onClick={() => handleCopy(website)}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${copied
                                                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                                                    : 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-white shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                                                }`}
                                        >
                                            {copied ? (
                                                <><CheckCircle className='h-4 w-4' /> Copied!</>
                                            ) : (
                                                <><Share2 className='h-4 w-4' /> Share</>
                                            )}
                                        </motion.button>
                                    ) : (
                                        <NeonButton variant='cyan' onClick={() => handleDeploy(website._id.toString())} className='flex items-center gap-2 text-sm'>
                                            <Rocket className='h-4 w-4' /> Deploy
                                        </NeonButton>
                                    )}
                                </div>
                            </GlassCard>
                        )
                    })}
                </div>

                {/* Empty State */}
                {websites.length === 0 && (
                    <MotionWrapper delay={0.3} className='flex flex-col items-center justify-center py-20 text-center'>
                        <div className='text-6xl mb-4'>🌐</div>
                        <h3 className='text-2xl font-semibold text-gray-300'>No websites yet</h3>
                        <p className='text-gray-500 mt-2 mb-6'>Create your first AI-generated website</p>
                        <NeonButton variant='gold' onClick={() => router.push('/generate')}>
                            ✨ Generate Website
                        </NeonButton>
                    </MotionWrapper>
                )}
            </div>
        </div>
    )
}

export default Dashboard
