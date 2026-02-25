'use client'
import axios from "axios";
import { easeOut, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const Generate = () => {
    const [prompt, setprompt] = useState<string>("");
    const [progress, setProgress] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [error,  setError] = useState("");
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
        let value = 0;
        let phase = 0;
        const time = setInterval(() => {
            const increment = value < 20 ? Math.random() * 1.5 : value < 60 ? Math.random() * 1.2 : Math.random() * 0.6;
            value += increment;

            if (value >= 92) {
                value = 92;
            }

            phase = Math.min(Math.floor((value / 100) * PHASES.length), PHASES.length - 1);
            setProgress(Math.floor(value));
            setActiveIndex(phase);
        }, 450)

        return () => {
            clearInterval(time);
        }

    }, [loading])



    const getData = async () => {
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
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">

            {/* Navbar */}
            <header className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
                <h1 className="text-2xl font-bold">
                    Genweb <span className="text-indigo-500">.ai</span>
                </h1>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">

                <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                    Build Websites with{" "}
                    <span className="text-indigo-500">Real Power AI</span>
                </h2>

                <p className="text-gray-400 max-w-xl mb-8">
                    Describe your website idea and let AI generate a modern, responsive website instantly.
                </p>

                {/* Input Section */}
                <div className="w-full max-w-2xl">
                    <textarea
                        value={prompt}
                        onChange={(e) => {
                            setprompt(e.target.value);
                        }}
                        placeholder="Describe your website..."
                        className="w-full h-32 p-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />

                    <button onClick={getData} className="mt-4 w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-semibold cursor-pointer">
                        Start Generating
                    </button>

                    {error && (
                        <div className=" text-red-50 p-2 text-sm">{error}</div>
                    )}

                    {loading && (
                        <motion.div>
                            <div className="flex justify-between text-sm text-gray-300 mb-2">
                                <span>{PHASES[activeIndex]}</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div initial={{opacity : 0, width: 0}} className='h-full bg-gradient-to-r from-white to-zinc-300' animate={{ width: `${progress}%` }}
                                    transition={{ ease: easeOut, duration: 0.8 }}>

                                </motion.div>
                            </div>

                            <div>Estimated time remaining: {" "}
                                <span>~3-4 minutes</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Generate;