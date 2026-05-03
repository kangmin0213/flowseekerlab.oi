
import React from 'react';
import { motion } from 'framer-motion';

function ConfidenceScore({ score, level, label, description }) {
  const getColorClass = () => {
    if (level === 'high') return 'text-green-500';
    if (level === 'medium') return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStrokeColor = () => {
    if (level === 'high') return '#22c55e';
    if (level === 'medium') return '#eab308';
    return '#ef4444';
  };

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-card/50 p-8 backdrop-blur-sm"
    >
      {/* Circular Progress */}
      <div className="relative mb-6">
        <svg className="h-48 w-48 -rotate-90 transform">
          {/* Background Circle */}
          <circle
            cx="96"
            cy="96"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-muted/20"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="96"
            cy="96"
            r="70"
            stroke={getStrokeColor()}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold ${getColorClass()}`} style={{ letterSpacing: '-0.02em' }}>
            {score.toFixed(1)}%
          </span>
          <span className="text-sm font-medium text-muted-foreground mt-1">Confidence</span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">{label}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      </div>
    </motion.div>
  );
}

export default ConfidenceScore;
