
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

function MetricCard({ title, value, status, percentage, currency = 'USD', index = 0 }) {
  const isUndervalued = status === 'undervalued';
  const statusColor = isUndervalued ? 'text-green-500' : 'text-red-500';
  const statusBg = isUndervalued ? 'bg-green-500/10' : 'bg-red-500/10';
  const statusBorder = isUndervalued ? 'border-green-500/20' : 'border-red-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        {/* Title */}
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
          {title}
        </p>

        {/* Value */}
        <div className="flex items-baseline gap-2 mb-4">
          {currency && (
            <span className="text-sm font-medium text-muted-foreground">{currency}</span>
          )}
          <span className="text-3xl font-bold tracking-tight text-foreground" style={{ letterSpacing: '-0.02em' }}>
            {typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
          </span>
        </div>

        {/* Status Badge */}
        {status && percentage !== undefined && (
          <div className={`inline-flex items-center gap-2 rounded-lg border ${statusBorder} ${statusBg} px-3 py-1.5`}>
            {isUndervalued ? (
              <TrendingUp className={`h-4 w-4 ${statusColor}`} />
            ) : (
              <TrendingDown className={`h-4 w-4 ${statusColor}`} />
            )}
            <span className={`text-sm font-semibold ${statusColor}`}>
              {isUndervalued ? 'Undervalued' : 'Overvalued'}
            </span>
            <span className={`text-sm font-bold ${statusColor}`}>
              {percentage > 0 ? '+' : ''}{percentage.toFixed(2)}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default MetricCard;
