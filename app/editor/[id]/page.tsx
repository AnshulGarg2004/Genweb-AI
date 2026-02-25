'use client'
import { Imessage, Iwebsite } from '@/model/website.model';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import { Code2, Fullscreen, Monitor, Rocket, Send, X } from 'lucide-react';
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

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

    const thinkingSteps : string[] = [
        "Understanding your Request...",
        "Planing layout changes...",
        "Improving resonsiveness...",
        "Applying Animations...",
        "Finalizing updates..."
    ]

    const handleDeploy = async () => {
        try {
            const response = await axios.get(`/api/deploy/${id}`);
            if(!response) {
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
            setActiveIndex((i) => (i+1) % thinkingSteps.length);
        }, 1200);

        return () => {
            clearInterval(timeout);
        }
    }, [loading])
   


    const handleUpdate = async () => {
        setLoading(true);
        setMessages((m) => [...m, {role : "user", content : prompt} as any])
        
        try {
            const response = await axios.post(`/api/update-website/${id}`, { prompt }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Response from backedn: ", response);
            
            setCode(response.data.website.latestCode);
            
        setMessages((m) => [...m, {role : "ai", content : response.data.website.conversation.at(-1)?.content} as any])

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
            <div className="flex items-center justify-between w-full px-6 py-4 border-b">
                <h1 className="truncate text-lg font-semibold">
                    {website?.title}
                </h1>

                <div className="flex items-center gap-3">
                    <button onClick={()=> handleDeploy} className="flex items-center gap-2 px-3 py-2 bg-white text-black rounded-md cursor-pointer">
                        <Rocket className="h-5 w-5" />
                        Deploy
                    </button>

                    <button className="p-2 rounded-md hover:bg-gray-800 cursor-pointer" onClick={() => setOpenEditor(!openEditor)} >
                        <Code2 className="h-5 w-5" />
                    </button>



                    <button onClick={() => { setFullScreen(true) }} className="p-2 rounded-md hover:bg-gray-800 cursor-pointer">
                        <Monitor className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {openEditor && (
                <div>
                    <Editor onChange={(changedCode) => setCode(changedCode)} height={'90vh'}
                        defaultLanguage='html'
                        value={code}
                        theme='vs-dark' />
                </div>
            )}

            {/* BODY */}
            <div className="flex flex-1 overflow-hidden">

                {/* CHAT AREA */}
                <div className="w-[350px] border-r p-4 overflow-y-auto">
                    {
                        messages.map((message, index) => (
                            <div key={index} className=''>
                                <div className={`p-1 ${message.role === 'user' ? 'bg-green-400 text-black' : 'bg-black text-white'}`}>{message.content}</div>
                            </div>
                        ))
                    }
                    {
                        loading && (
                            <div className=''>
                                {thinkingSteps[activeIndex]
                                }
                            </div>
                        )
                    }
                    <div className='flex gap-2'>
                        <input onChange={(e) => {
                            setPrompt(e.target.value)
                        }} value={prompt} type='text' placeholder='Enter your message' className='rounded-xl p-1' />
                        <button className='p-2 cursor-pointer' onClick={handleUpdate} >
                            <Send className='h-8 w-8 p-1' />
                        </button>
                    </div>
                </div>


                {/* IFRAME AREA */}
                <div className={fullScreen ? "fixed inset-0 z-50 bg-white" : "flex-1 bg-white"}>
                    {fullScreen && (
                        <button
                            onClick={() => setFullScreen(false)}
                            className="absolute top-4 right-4 z-10 rounded-md bg-black/80 px-3 py-2 text-sm text-white"
                        >
                            <X className='h-5 w-5' />
                        </button>
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
