'use client'
import { Iwebsite } from '@/model/website.model'
import { useUser } from '@clerk/nextjs'
import axios from 'axios';
import {motion} from 'framer-motion'
import { CheckCircle, Plus, Rocket, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'


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
        <div className='mt-5'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1>
                        Genweb
                        <span>.AI</span>
                    </h1>
                </div>
                <div>
                    <button className='p-2 flex cursor-pointer gap-2 bg-white text-black mr-6 mt-1 rounded-3xl' onClick={() => {
                        router.push('/generate')
                    }}><Plus className='h-5 w-5' /> New Website</button>
                </div>
            </div>

            <div className='flex text-3xl mt-5'>
                <h1>Welcome Back</h1>
                <p>{user?.firstName} {user?.lastName}</p>
            </div>
            {websites.map((website, index) => {
                const copied = copiedId === website._id.toString();
                return (
                    <div key={index} className='grid grid-cols-1 md:grid-cols-3 cursor-pointer' >
                        <div onClick={() => {
                            router.push(`/editor/${website._id}`)
                        }}>
                            <iframe srcDoc={website.latestCode} className='' />
                            <div>
                                <h1>{website.title}</h1>
                            </div>
                        </div>

                        <div>
                            {website.deployed ? (
                                <motion.button
                                whileTap={{}}
                                onClick={() => handleCopy(website)} className={`p-2 cursor-pointer flex ${copied ? 'bg-red-500' : 'bg-green-500'}`}>
                                    {copied ? (
                                        <>
                                        <CheckCircle className='h-5 w-5' />
                                        Link copied!</>
                                    ) : (
                                        <>
                                        <Share2 className='h-5 w-5' />
                                    Share link
                                    </>
                                    )}
                                </motion.button>
                            ) : (

                                <button onClick={() => handleDeploy(website._id.toString())} className='p-2 cursor-pointer flex'>

                                    <Rocket className='h-5 w-5' />
                                    Deploy
                                </button>
                            )}
                        </div>
                    </div>
                )
            })}

        </div>
    )
}

export default Dashboard
