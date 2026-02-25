'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Livesite = () => {
    const [error, setError] = useState("");
    const [html, setHtml] = useState("");

    const {slug} = useParams();
    console.log("slug:", slug);
    

    useEffect(() => {
        const getBySlug = async () => {
        try {
            if (!slug) {
                return;
            }

            const response = await axios.get(`/api/get-website-by-slug/${slug?.toString()}`);
            console.log("r: ", response);
            
            if(!response)  {
                console.log("Cannot fetch live site");
            }

            setHtml(response.data.website.latestCode);
        } catch (error) {
            console.log("Error in live site");
            setError("Canot preview live site");
        }
    }

    getBySlug();
    }, [slug]);

    if(error) {
        return (
            <div className='flex items-center justify-center h-screen'>
                {error}
            </div>
        )
    }
  return (
    <iframe srcDoc={html} className='h-screen w-screen'/>
  )
}

export default Livesite
