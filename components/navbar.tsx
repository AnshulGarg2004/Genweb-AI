'use client'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Coins } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Iuser } from '@/model/user.model';

const Navbar = () => {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<Iuser | null>(null)

    useEffect(() => {
        try {
            const fetchUser = async () => {
                const response = await axios.get('/api/get-current-user');
                console.log("Response from user: ", response.data.existingUser);
                setCurrentUser(response.data.existingUser)
            }
            fetchUser();
        } catch (error) {
            console.log("Error in getting user: ", error);
        }
       
    }, [])
    return (
        <div className='mx-auto shadow'>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl'>Genweb
                    <span className='text-gray-400'>.ai</span>
                </h1>
                <div className='flex gap-6 mx-5'>
                    <header className="flex justify-end items-center p-4 gap-4 h-16">
                        {/* Show the sign-in and sign-up buttons when the user is signed out */}
                        <button className='p-2 cursor-pointer' onClick={() => {
                            router.push("/pricing");
                        }}>Pricing : {currentUser?.plan || "free"}</button>
                        <SignedOut>
                            <button className='p-2 cursor-pointer' onClick={() => {
                                router.push('/sign-in')
                            }}>Sign In</button>
                            <button className='p-2 cursor-pointer' onClick={() => {
                                router.push('/sign-up')
                            }}>Sign Up</button>
                        </SignedOut>
                        {/* Show the user button when the user is signed in */}
                        <SignedIn>
                            <button><Coins className='w-5 h-5'/> Credits : {currentUser?.credits || 0}</button>
                            <UserButton />
                        </SignedIn>
                    </header>
                </div>
            </div>
        </div>
    )
}

export default Navbar
