'use client'
import { Imessage, Iwebsite } from '@/model/website.model';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import { Code2, Fullscreen, Monitor, Rocket, Send, X } from 'lucide-react';
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import MotionWrapper from '@/components/MotionWrapper';
import NeonButton from '@/components/NeonButton';
import { motion } from 'framer-motion';

const Editorpage = () => {
    const params = useParams();
    const id = params.id;
    const [website, setWebsite] = useState<Iwebsite | null>(null);
    const isIframeRef = useRef<HTMLIFrameElement>(null);
    const [prompt, setPrompt] = useState<string>("");
    const [fullScreen, setFullScreen] = useState<boolean>(false);
    const [openEditor, setOpenEditor] = useState<boolean>(false);
    const [code, setCode] = useState<string>();
    const [activeIndex, setActiveIndex] = useState(0);

    const [loading, setLoading] = useState<boolean>(false);

    const [messages, setMessages] = useState<Imessage[]>([])

    const thinkingSteps: string[] = [
        "Understanding your Request...",
        "Planing layout changes...",
        "Improving resonsiveness...",
        "Applying Animations...",
        "Finalizing updates..."
    ]

    const handleDeploy = async () => {
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
        const timeout = setInterval(() => {
            setActiveIndex((i) => (i + 1) % thinkingSteps.length);
        }, 1200);

        return () => {
            clearInterval(timeout);
        }
    }, [loading])



    const handleUpdate = async () => {
        const currentPrompt = prompt.trim();
        if (!currentPrompt) {
            return;
        }

        setPrompt("");
        setLoading(true);
        setMessages((m) => [...m, { role: "user", content: currentPrompt } as any])

        try {
            const response = await axios.post(`/api/update-website/${id}`, { prompt: currentPrompt }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Response from backedn: ", response);

            setCode(response.data.website.latestCode);

            setMessages((m) => [...m, { role: "ai", content: response.data.website.conversation.at(-1)?.content } as any])

            if (!response) {
                console.log("Cant fetch response from update website");
            }

            console.log("Response from update website: ", response);
        } catch (error) {
            console.log("An error occured update cant be sent");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const getWebsite = async () => {
            try {
                const response = await axios.get(`/api/get-website-by-id/${id}`, { withCredentials: true });
                console.log("Website from api: ", response.data);
                setWebsite(response.data.website);
                setCode(response.data.website.latestCode);
                setMessages(response.data.website.conversation)

            } catch (error) {
                console.log("Error in geting webstie: ", error);

            }
        }
        getWebsite();
    }, [id])

    useEffect(() => {
        if (!isIframeRef.current || !code) {
            return;
        }
        const blob = new Blob([code], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        isIframeRef.current.src = url;

        return () => {
            URL.revokeObjectURL(url);
        }
    }, [code]);


    return (
        <div className="flex flex-col h-screen">

            {/* HEADER */}
            <MotionWrapper delay={0}>
                <div className="flex items-center justify-between w-full px-6 py-4 backdrop-blur-xl bg-white/5 border-b border-white/10">
                    <h1 className="truncate text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        {website?.title}
                    </h1>

                    <div className="flex items-center gap-3">
                        <NeonButton variant='cyan' onClick={handleDeploy} className="flex items-center gap-2 px-4 py-2 text-sm">
                            <Rocket className="h-4 w-4" />
                            Deploy
                        </NeonButton>

                        <motion.button
                            className="p-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                            onClick={() => setOpenEditor(!openEditor)}
                            whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
                            whileTap={{ scale: 0.95 }}
                            style={openEditor ? { boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)' } : undefined}
                        >
                            <Code2 className="h-5 w-5 text-purple-400" />
                        </motion.button>

                        <motion.button
                            onClick={() => setFullScreen(true)}
                            className="p-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                            whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Monitor className="h-5 w-5 text-cyan-400" />
                        </motion.button>
                    </div>
                </div>
            </MotionWrapper>

            {openEditor && (
                <div className="border-b border-white/10">
                    <Editor onChange={(changedCode) => setCode(changedCode)} height={'90vh'}
                        defaultLanguage='html'
                        value={code}
                        theme='vs-dark' />
                </div>
            )}

            {/* BODY */}
            <div className="flex flex-1 overflow-hidden">

                {/* CHAT AREA */}
                <div className="w-[380px] backdrop-blur-xl bg-white/[0.02] border-r border-white/10 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {
                            messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-3 rounded-xl text-sm leading-relaxed max-w-[90%] ${message.role === 'user'
                                            ? 'ml-auto bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 text-cyan-100'
                                            : 'mr-auto backdrop-blur-xl bg-white/5 border border-white/10 text-gray-300'
                                        }`}
                                >
                                    {message.content}
                                </motion.div>
                            ))
                        }
                        {
                            loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className='mr-auto backdrop-blur-xl bg-white/5 border border-purple-500/20 rounded-xl p-3 text-sm text-purple-400'
                                    style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.1)' }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                        {thinkingSteps[activeIndex]}
                                    </div>
                                </motion.div>
                            )
                        }
                    </div>

                    {/* Input */}
                    <div className='p-4 border-t border-white/10'>
                        <div className='flex items-center gap-2'>
                            <input
                                onChange={(e) => setPrompt(e.target.value)}
                                value={prompt}
                                type='text'
                                placeholder='Describe changes...'
                                className='flex-1 px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-sm transition-all duration-300'
                                onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                            />
                            <motion.button
                                className='p-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 cursor-pointer'
                                onClick={handleUpdate}
                                
                                whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
                                whileTap={{ scale: 0.95 }}
                                style={{ boxShadow: '0 0 15px rgba(0, 242, 254, 0.3)' }}
                            >
                                <Send className='h-5 w-5 text-white' />
                            </motion.button>
                        </div>
                    </div>
                </div>


                {/* IFRAME AREA */}
                <div className={fullScreen ? "fixed inset-0 z-50 bg-white" : "flex-1 bg-white"}>
                    {fullScreen && (
                        <motion.button
                            onClick={() => setFullScreen(false)}
                            className="absolute top-4 right-4 z-10 rounded-xl bg-black/80 backdrop-blur-xl px-3 py-2 text-sm text-white border border-white/10 cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <X className='h-5 w-5' />
                        </motion.button>
                    )}
                    <iframe
                        ref={isIframeRef}
                        className="w-full h-full"
                    />
                </div>

            </div>

        </div>
    )
}

export default Editorpage
