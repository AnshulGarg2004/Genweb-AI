'use client'
import { motion, type HTMLMotionProps } from 'framer-motion'
import React from 'react'

interface MotionWrapperProps {
    children: React.ReactNode
    className?: string
    delay?: number
    enableHover?: boolean
    enableTap?: boolean
}

const MotionWrapper: React.FC<MotionWrapperProps & Omit<HTMLMotionProps<'div'>, keyof MotionWrapperProps>> = ({
    children,
    className = '',
    delay = 0,
    enableHover = false,
    enableTap = false,
    ...rest
}) => {
    return (
        <motion.div
            className={className}
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
                    ? { scale: 1.05, filter: 'brightness(1.2)' }
                    : undefined
            }
            whileTap={enableTap ? { scale: 0.95 } : undefined}
            {...rest}
        >
            {children}
        </motion.div>
    )
}

export default MotionWrapper
