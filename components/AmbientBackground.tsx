'use client'
import { motion } from 'framer-motion'
import React from 'react'

const spheres = [
  {
    color: '#06b6d4', // cyan
    size: 600,
    top: '-15%',
    left: '-10%',
    blur: 150,
    animate: {
      x: [0, 100, -50, 80, 0],
      y: [0, -80, 50, -40, 0],
      scale: [1, 1.3, 0.85, 1.15, 1],
    },
    duration: 22,
    opacity: 0.35,
  },
  {
    color: '#3b82f6', // royal blue
    size: 700,
    top: '25%',
    left: '60%',
    blur: 180,
    animate: {
      x: [0, -90, 60, -40, 0],
      y: [0, 60, -100, 40, 0],
      scale: [1, 0.85, 1.2, 0.9, 1],
    },
    duration: 28,
    opacity: 0.3,
  },
  {
    color: '#7c3aed', // deep purple
    size: 550,
    top: '55%',
    left: '15%',
    blur: 160,
    animate: {
      x: [0, 70, -60, 50, 0],
      y: [0, -50, 70, -60, 0],
      scale: [1, 1.15, 0.8, 1.1, 1],
    },
    duration: 25,
    opacity: 0.35,
  },
  {
    color: '#eab308', // vivid yellow
    size: 450,
    top: '10%',
    left: '35%',
    blur: 140,
    animate: {
      x: [0, -60, 80, -70, 0],
      y: [0, 80, -50, 60, 0],
      scale: [1, 1.2, 0.85, 1.15, 1],
    },
    duration: 20,
    opacity: 0.2,
  },
  {
    color: '#d946ef', // fuchsia
    size: 500,
    top: '70%',
    left: '65%',
    blur: 170,
    animate: {
      x: [0, 50, -70, 40, 0],
      y: [0, -60, 40, -50, 0],
      scale: [1, 0.9, 1.15, 0.85, 1],
    },
    duration: 24,
    opacity: 0.25,
  },
]

const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {spheres.map((sphere, index) => (
        <motion.div
          key={index}
          animate={sphere.animate}
          transition={{
            duration: sphere.duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: sphere.top,
            left: sphere.left,
            width: sphere.size,
            height: sphere.size,
            borderRadius: '50%',
            background: `radial-gradient(circle at center, ${sphere.color} 0%, ${sphere.color}66 30%, ${sphere.color}22 60%, transparent 80%)`,
            filter: `blur(${sphere.blur}px)`,
            opacity: sphere.opacity,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
}

export default AmbientBackground
