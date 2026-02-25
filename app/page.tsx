'use client'
import Features from '@/components/features'
import Navbar from '@/components/navbar'
import { useRouter } from 'next/navigation'
import React from 'react'

const Homepage = () => {
    const router = useRouter();
    return (
        <div>
            <Navbar />
            <div className='mx-auto max-w-7xl items-center'>
                <h1 className='text-center text-5xl font-bold mt-10'>Build stunning websites <br />
                    <span className='text-blue-500'> with AI</span>
                </h1>
                <div className='mx-auto max-w-4xl'>
                    <p>Descrive your idea and lelt AI generate a modern, responsive and production-ready website</p>

                    <button className='bg-yellow-50 text-black p-3 rounded-2xl mx-auto cursor-pointer' onClick={() => {
                        router.push('/generate')
                    }}>Generate Webstie</button>
                </div>
            </div>
            <Features />
        </div>
    )
}

export default Homepage
