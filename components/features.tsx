import { Iwebsite } from '@/model/website.model';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'
import GlassCard from './GlassCard';
import MotionWrapper from './MotionWrapper';
import { useRouter } from 'next/navigation';

interface featuresProps {
    title: string;
    desc: string;
    icon: string;
    glowColor: 'cyan' | 'purple' | 'gold';
}
const features: featuresProps[] = [
    {
        title: "AI Generated Code",
        desc: "Clean, production-ready code with animations, responsiveness, and scalable architecture — built in seconds.",
        icon: "⚡",
        glowColor: "cyan",
    },
    {
        title: "Fully Responsive",
        desc: "Every pixel adapts perfectly across all devices — desktop, tablet, and mobile, right out of the box.",
        icon: "📱",
        glowColor: "purple",
    },
    {
        title: "Production Ready",
        desc: "Deploy instantly. Polished, performant code built to scale and ready for the real world.",
        icon: "🚀",
        glowColor: "gold",
    },
]

const Features = () => {

    const router = useRouter();
    const [websites, setWebsites] = useState<Iwebsite[]>([]);

    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                const response = await axios.get('/api/get-websites');
                setWebsites(response.data.websites);
            } catch (error) { }
        }
        fetchWebsites();
    }, [])
    return (
        <div>
            <SignedIn>
                <MotionWrapper delay={0.1}>
                    <div className='flex flex-col items-center text-center mb-10'>
                        <h2 className='text-3xl md:text-4xl font-bold text-white'>
                            Your Recent{' '}
                            <span className='bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
                                Websites
                            </span>
                        </h2>
                        <p className='text-gray-400 mt-2'>Pick up where you left off</p>
                    </div>
                </MotionWrapper>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {websites.slice(0, 6).map((website, index) => (
                        <GlassCard
                            key={index}
                            glowColor='blue'
                            delay={0.2 + index * 0.1}
                            className='overflow-hidden flex flex-col group'
                        >
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
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4'>
                                        <span className='text-xs font-medium text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10'>
                                            Click to edit
                                        </span>
                                    </div>
                                </div>
                                <div className='px-5 pt-4 pb-4'>
                                    <h3 className='text-lg font-semibold text-white truncate group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300'>
                                        {website.title}
                                    </h3>
                                    <p className='text-xs text-gray-500 mt-1 truncate'>
                                        {website.deployed ? '🟢 Deployed' : '🔵 Draft'}
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </SignedIn>
            <SignedOut>
                {features.map((feature, index) => (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        <GlassCard
                            key={index}
                            glowColor={feature.glowColor}
                            delay={0.2 + index * 0.12}
                            className='p-7 flex flex-col gap-4'
                        >
                            <div className='w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-2xl'>
                                {feature.icon}
                            </div>
                            <h3 className='text-lg font-semibold text-white'>
                                {feature.title}
                            </h3>
                            <p className='text-gray-400 text-sm leading-relaxed'>{feature.desc}</p>
                        </GlassCard>
                    </div>
                ))}
            </SignedOut>
        </div>
    )
}

export default Features
