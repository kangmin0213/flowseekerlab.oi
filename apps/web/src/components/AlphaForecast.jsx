
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

function AlphaForecast({ performance, confidence, trend, timeframe, description }) {
  const isPositive = trend === 'up';
  const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
  const bgClass = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';
  const borderClass = isPositive ? 'border-green-500/20' : 'border-red-500/20';

  const getConfidenceBadge = () => {
    const badges = {
      high: { label: 'High Confidence', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
      medium: { label: 'Medium Confidence', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
      low: { label: 'Low Confidence', color: 'bg-red-500/10 text-red-500 border-red-500/20' }
    };
    return badges[confidence] || badges.medium;
  };

  const confidenceBadge = getConfidenceBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl border ${borderClass} ${bgClass} p-6 backdrop-blur-sm`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Portfolio Alpha Forecast
        </h3>
        
        {/* Performance Display */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bgClass} border ${borderClass}`}>
            {isPositive ? (
              <ArrowUpRight className={`h-6 w-6 ${colorClass}`} />
            ) : (
              <ArrowDownRight className={`h-6 w-6 ${colorClass}`} />
            )}
          </div>
          <div>
            <span className={`text-3xl font-bold ${colorClass}`} style={{ letterSpacing: '-0.02em' }}>
              {isPositive ? '+' : ''}{performance.toFixed(1)}%
            </span>
            <p className="text-xs text-muted-foreground">{timeframe} projection</p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 ${confidenceBadge.color}`}>
          <span className="text-xs font-semibold">{confidenceBadge.label}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}

export default AlphaForecast;
