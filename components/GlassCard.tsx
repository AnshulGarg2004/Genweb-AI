'use client'
import { motion } from 'framer-motion'
import React from 'react'

type GlowColor = 'cyan' | 'purple' | 'gold' | 'green' | 'blue' | 'none'

interface GlassCardProps {
    children: React.ReactNode
    className?: string
    glowColor?: GlowColor
    delay?: number
    enableHover?: boolean
    onClick?: () => void
}

const glowShadows: Record<GlowColor, { base: string; hover: string }> = {
    cyan: {
        base: '0 0 20px rgba(0, 242, 254, 0.15), inset 0 0 20px rgba(0, 242, 254, 0.05)',
        hover: '0 0 30px rgba(0, 242, 254, 0.3), 0 0 60px rgba(0, 242, 254, 0.1), inset 0 0 30px rgba(0, 242, 254, 0.08)',
    },
    purple: {
        base: '0 0 20px rgba(168, 85, 247, 0.15), inset 0 0 20px rgba(168, 85, 247, 0.05)',
        hover: '0 0 30px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.1), inset 0 0 30px rgba(168, 85, 247, 0.08)',
    },
    gold: {
        base: '0 0 20px rgba(251, 191, 36, 0.15), inset 0 0 20px rgba(251, 191, 36, 0.05)',
        hover: '0 0 30px rgba(251, 191, 36, 0.3), 0 0 60px rgba(251, 191, 36, 0.1), inset 0 0 30px rgba(251, 191, 36, 0.08)',
    },
    green: {
        base: '0 0 20px rgba(52, 211, 153, 0.15), inset 0 0 20px rgba(52, 211, 153, 0.05)',
        hover: '0 0 30px rgba(52, 211, 153, 0.3), 0 0 60px rgba(52, 211, 153, 0.1), inset 0 0 30px rgba(52, 211, 153, 0.08)',
    },
    blue: {
        base: '0 0 20px rgba(79, 172, 254, 0.15), inset 0 0 20px rgba(79, 172, 254, 0.05)',
        hover: '0 0 30px rgba(79, 172, 254, 0.3), 0 0 60px rgba(79, 172, 254, 0.1), inset 0 0 30px rgba(79, 172, 254, 0.08)',
    },
    none: {
        base: 'none',
        hover: 'none',
    },
}

const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    glowColor = 'cyan',
    delay = 0,
    enableHover = true,
    onClick,
}) => {
    const glow = glowShadows[glowColor]

    return (
        <motion.div
            className={`
        backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
            style={{ boxShadow: glow.base }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay,
            }}
            whileHover={
                enableHover
                    ? {
                        scale: 1.02,
                        boxShadow: glow.hover,
                        filter: 'brightness(1.1)',
                    }
                    : undefined
            }
            onClick={onClick}
        >
            {children}
        </motion.div>
    )
}

export default GlassCard
