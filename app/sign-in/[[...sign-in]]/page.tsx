'use client'
import { SignIn } from '@clerk/nextjs'
import React from 'react'

const Signin = () => {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8'
        style={{ boxShadow: '0 0 40px rgba(0, 242, 254, 0.1), 0 0 80px rgba(168, 85, 247, 0.05)' }}>
        <SignIn
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
              formFieldInput: 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-cyan-500/50 focus:border-cyan-500/50',
              formButtonPrimary: 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 transition-all shadow-lg',
              footerActionLink: 'text-cyan-400 hover:text-cyan-300',
              identityPreviewEditButton: 'text-cyan-400',
              formFieldAction: 'text-cyan-400',
              otpCodeFieldInput: 'bg-white/5 border-white/10 text-white',
              footer: 'bg-transparent',
            },
          }}
        />
      </div>
    </div>
  )
}

export default Signin
