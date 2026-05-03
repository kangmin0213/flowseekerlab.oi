
import React from 'react';
import { TrendingUp, Minus, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

function SentimentGauge({ value, label, level, description }) {
  const getColorClass = () => {
    if (level === 'bullish') return 'text-green-500';
    if (level === 'neutral') return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBgClass = () => {
    if (level === 'bullish') return 'bg-green-500/10';
    if (level === 'neutral') return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  const getBorderClass = () => {
    if (level === 'bullish') return 'border-green-500/20';
    if (level === 'neutral') return 'border-yellow-500/20';
    return 'border-red-500/20';
  };

  const getIcon = () => {
    if (level === 'bullish') return <TrendingUp className="h-6 w-6" />;
    if (level === 'neutral') return <Minus className="h-6 w-6" />;
    return <TrendingDown className="h-6 w-6" />;
  };

  const percentage = (value + 1) / 2 * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-card/50 p-6 backdrop-blur-sm"
    >
      <div className="mb-6">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
          Web3 Market Sentiment Index
        </h3>
        
        {/* Sentiment Badge */}
        <div className={`inline-flex items-center gap-3 rounded-xl border ${getBorderClass()} ${getBgClass()} px-4 py-3`}>
          <span className={getColorClass()}>
            {getIcon()}
          </span>
          <div>
            <span className={`text-2xl font-bold ${getColorClass()}`} style={{ letterSpacing: '-0.02em' }}>
              {label}
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sentiment Score: {value.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Gauge Slider */}
      <div className="space-y-3">
        <div className="relative h-3 rounded-full bg-muted overflow-hidden">
          {/* Gradient Track */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-yellow-500/30 to-green-500/30" />
          
          {/* Position Indicator */}
          <motion.div
            initial={{ left: '50%' }}
            animate={{ left: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute top-1/2 -translate-y-1/2 h-5 w-1.5 bg-foreground rounded-full shadow-lg"
            style={{ transform: 'translate(-50%, -50%)' }}
          />
        </div>

        {/* Labels */}
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-red-500">Bearish</span>
          <span className="text-yellow-500">Neutral</span>
          <span className="text-green-500">Bullish</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-4">{description}</p>
    </motion.div>
  );
}

export default SentimentGauge;
