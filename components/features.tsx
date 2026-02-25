import { Iwebsite } from '@/model/website.model';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface featuresProps {
    title: string;
    desc: string;
}
const features: featuresProps[] = [
    {
        title: "AI Generated Code",
        desc: "Genweb.ai builds real websites-clean code, animations, responsiveness, and scalable structure"
    },
    {
        title: "Fully Responsive Layouts",
        desc: "Genweb.ai builds real websites-clean code, animations, responsiveness, and scalable structure"
    },
    {
        title: "Production Ready Outputs",
        desc: "Genweb.ai builds real websites-clean code, animations, responsiveness, and scalable structure"
    },
]

const Features = () => {
    const [websites, setWebsites] = useState<Iwebsite[]>([]);
    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                const response = await axios.get('/api/get-websites');
                console.log("Response from get websites: ", response);
                setWebsites(response.data);

            } catch (error) {

            }
        }
        console.log("website: ", websites);
        
        fetchWebsites();
    }, [])
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>


            <SignedIn>
                 {
                    features.map((feature, index) => (
                        <div key={index} className='bg-zinc-700 p-3 rounded-md'>
                            <h1>{feature.title}</h1>
                            <p>{feature.desc}</p>
                        </div>
                    ))
                }
            </SignedIn>
            <SignedOut>
               {
                    // websites.map((website, index) => (
                    //     <div key={index} className='border border-zinc-600 rounded-md p-3'>
                    //         <iframe srcDoc={website.deployedUrl} className='w-full h-64' />
                    //         <h1 className='text-lg font-bold'>{website.title}</h1>
                    //     </div>
                    // ))
                }
            </SignedOut>
        </div>
    )
}

export default Features
