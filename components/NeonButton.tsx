'use client'
import { motion } from 'framer-motion'
import React from 'react'

type NeonVariant = 'cyan' | 'purple' | 'gold' | 'green'

interface NeonButtonProps {
    children: React.ReactNode
    variant?: NeonVariant
    className?: string
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
}

const variantStyles: Record<NeonVariant, { gradient: string; shadow: string; hoverShadow: string }> = {
    cyan: {
        gradient: 'from-cyan-400 to-blue-500',
        shadow: '0 0 20px rgba(0, 242, 254, 0.3), 0 0 40px rgba(0, 242, 254, 0.1)',
        hoverShadow: '0 0 30px rgba(0, 242, 254, 0.5), 0 0 60px rgba(0, 242, 254, 0.2), 0 0 80px rgba(0, 242, 254, 0.1)',
    },
    purple: {
        gradient: 'from-purple-500 to-pink-500',
        shadow: '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.1)',
        hoverShadow: '0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(168, 85, 247, 0.2), 0 0 80px rgba(168, 85, 247, 0.1)',
    },
    gold: {
        gradient: 'from-yellow-400 to-orange-500',
        shadow: '0 0 20px rgba(251, 191, 36, 0.3), 0 0 40px rgba(251, 191, 36, 0.1)',
        hoverShadow: '0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.2), 0 0 80px rgba(251, 191, 36, 0.1)',
    },
    green: {
        gradient: 'from-emerald-400 to-cyan-500',
        shadow: '0 0 20px rgba(52, 211, 153, 0.3), 0 0 40px rgba(52, 211, 153, 0.1)',
        hoverShadow: '0 0 30px rgba(52, 211, 153, 0.5), 0 0 60px rgba(52, 211, 153, 0.2), 0 0 80px rgba(52, 211, 153, 0.1)',
    },
}

const NeonButton: React.FC<NeonButtonProps> = ({
    children,
    variant = 'cyan',
    className = '',
    onClick,
    disabled = false,
    type = 'button',
}) => {
    const styles = variantStyles[variant]

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        relative px-6 py-3 rounded-xl font-semibold text-white cursor-pointer
        bg-gradient-to-r ${styles.gradient}
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
            style={{ boxShadow: styles.shadow }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            whileHover={{
                scale: 1.05,
                filter: 'brightness(1.2)',
                boxShadow: styles.hoverShadow,
            }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    )
}

export default NeonButton
