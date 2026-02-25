'use client'
import { SignUp } from '@clerk/nextjs'
import React from 'react'

const Signup = () => {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8'
        style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.1), 0 0 80px rgba(0, 242, 254, 0.05)' }}>
        <SignUp
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-transparent shadow-none',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all',
              socialButtonsBlockButtonText: 'text-white',
              dividerLine: 'bg-white/10',
              dividerText: 'text-gray-500',
              formFieldLabel: 'text-gray-300',
              formFieldInput: 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-purple-500/50 focus:border-purple-500/50',
              formButtonPrimary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg',
              footerActionLink: 'text-purple-400 hover:text-purple-300',
              identityPreviewEditButton: 'text-purple-400',
              formFieldAction: 'text-purple-400',
              otpCodeFieldInput: 'bg-white/5 border-white/10 text-white',
              footer: 'bg-transparent',
            },
          }}
        />
      </div>
    </div>
  )
}

export default Signup
