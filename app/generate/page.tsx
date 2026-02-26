'use client'
import axios from "axios";
import { easeOut, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import MotionWrapper from "@/components/MotionWrapper";
import NeonButton from "@/components/NeonButton";
import { useRouter } from "next/navigation";

const Generate = () => {
    const router = useRouter();
    const [prompt, setprompt] = useState<string>("");
    const [progress, setProgress] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [error, setError] = useState("");
    const PHASES = [
        "Analysing your idea...",
        "Designing layout and structure...",
        'Writing html and css...',
        'Adding animations and interactions...',
        'Final quality check...'
    ]

    useEffect(() => {
        if (!loading) {
            setActiveIndex(0);
            setProgress(0);
            return;
        }

        setProgress(8);
        setActiveIndex(0);

        const time = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 92) return 92;

                const increment = prev < 20 ? Math.random() * 2.2 : prev < 60 ? Math.random() * 1.6 : Math.random() * 0.9;
                const next = Math.min(92, prev + increment);
                const phase = Math.min(Math.floor((next / 100) * PHASES.length), PHASES.length - 1);
                setActiveIndex(phase);

                return Math.floor(next);
            });
        }, 180)

        return () => {
            clearInterval(time);
        }

    }, [loading])



    const getData = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await axios.post('/api/generate-website', { prompt }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!res) {
                console.log("Error in geting resposne");
            }
            setProgress(100);
            setActiveIndex(PHASES.length - 1);
            const websiteId = res.data?.websites?._id;
            if (websiteId) {
                router.push(`/editor/${websiteId}`);
            }
            console.log("REsponse got successfully: ", res);
        } catch (error: any) {
            console.log("not working");
            setError(error.response?.data?.message || "An error occurred while generating website");
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen flex flex-col">

            {/* Navbar */}
            <MotionWrapper delay={0}>
                <header className="backdrop-blur-xl bg-white/5 border-b border-white/10">
                    <div className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
                        <h1 onClick={() => {
                            router.push('/')
                        }} className="text-2xl font-bold cursor-pointer">
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Genweb
                            </span>
                            <span className="text-gray-500">.ai</span>
                        </h1>
                            <motion.button
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(0,242,254,0.3),0_0_40px_rgba(0,242,254,0.1)] cursor-pointer"
                                onClick={() => router.push('/dashboard')}
                                whileHover={{
                                    scale: 1.05,
                                    filter: 'brightness(1.2)',
                                    boxShadow: '0 0 30px rgba(0,242,254,0.5), 0 0 60px rgba(0,242,254,0.2), 0 0 80px rgba(0,242,254,0.1)',
                                }}
                                whileTap={{ scale: 0.93 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            >
                                Dashboard
                            </motion.button>
                 
                    </div>
                </header>
            </MotionWrapper>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">

                <MotionWrapper delay={0.1}>
                    <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                        Build Websites with{" "}
                        <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                            Real Power AI
                        </span>
                    </h2>
                </MotionWrapper>

                <MotionWrapper delay={0.2}>
                    <p className="text-gray-400 max-w-xl mb-10 text-lg leading-relaxed">
                        Describe your website idea and let AI generate a modern, responsive website instantly.
                    </p>
                </MotionWrapper>

                {/* Input Section */}
                <MotionWrapper delay={0.3} className="w-full max-w-2xl">
                    <textarea
                        value={prompt}
                        onChange={(e) => {
                            setprompt(e.target.value);
                        }}
                        placeholder="Describe your dream website..."
                        className="w-full h-32 p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none transition-all duration-300"
                        style={{ boxShadow: '0 0 20px rgba(0, 242, 254, 0.05)' }}
                    />

                    <div className="mt-4">
                        <NeonButton variant='purple' onClick={getData} className='w-full py-4 text-lg'>
                            🚀 Start Generating
                        </NeonButton>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                            style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.1)' }}
                        >
                            <div className="flex justify-between text-sm text-gray-300 mb-3">
                                <span className="text-purple-400 font-medium">{PHASES[activeIndex]}</span>
                                <span className="text-cyan-400 font-mono">{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    className='h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full'
                                    animate={{ opacity: 1, width: `${progress}%` }}
                                    transition={{ ease: easeOut, duration: 0.8 }}
                                    style={{ boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }}
                                />
                            </div>

                            <div className="mt-3 text-sm text-gray-500">
                                Estimated time remaining:{" "}
                                <span className="text-gray-400">~3-4 minutes</span>
                            </div>
                        </motion.div>
                    )}
                </MotionWrapper>
            </main>
        </div>
    );
};

export default Generate;