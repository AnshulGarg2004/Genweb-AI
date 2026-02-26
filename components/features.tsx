import { Iwebsite } from '@/model/website.model';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {motion} from 'framer-motion'
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
                    <div className='text-center mb-12'>
                        <p className='text-sm font-medium text-cyan-400 tracking-wider uppercase mb-3'>Features</p>
                        <h2 className='text-3xl md:text-4xl font-bold text-white'>
                            Why <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent'>Genweb.ai</span>?
                        </h2>
                    </div>
                </MotionWrapper>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {websites.slice(0, 3).map((website, index) => (
                        <GlassCard
                            key={index}
                            glowColor='blue'
                            delay={0.2 + index * 0.1}
                            className='overflow-hidden flex flex-col'
                        >
                            {/* Preview */}
                            <div
                                className='cursor-pointer'
                                onClick={() => router.push(`/editor/${website._id}`)}
                            >
                                <div className='relative h-48 overflow-hidden rounded-t-2xl'>
                                    <iframe
                                        srcDoc={website.latestCode}
                                        className='w-full h-full pointer-events-none scale-75 origin-top-left'
                                        style={{ width: '133%', height: '133%' }}
                                    />
                                </div>
                                <div className='px-5 pt-4'>
                                    <h3 className='text-lg font-semibold text-white truncate'>{website.title}</h3>
                                </div>
                            </div>

                        </GlassCard>
                    ))}
                </div>
            </SignedIn>
            <SignedOut>
                {
                    features.map((feature, index) => (
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
                    ))
                }
            </SignedOut>
        </div>
    )
}

export default Features
