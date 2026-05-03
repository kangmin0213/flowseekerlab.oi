
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';

function ModelCard({ model, onToggle, index = 0 }) {
  const { name, value, weight, enabled, range, change, description } = model;
  
  const percentage = ((value - range.min) / (range.max - range.min)) * 100;
  const isPositive = change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
        enabled
          ? 'border-primary/20 bg-primary/5 shadow-lg shadow-primary/5'
          : 'border-white/5 bg-muted/30'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            <span className="text-xs font-medium text-muted-foreground">
              {(weight * 100).toFixed(0)}% weight
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={() => onToggle && onToggle(model.id)}
          className="ml-4"
        />
      </div>

      {/* Value Display */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-bold tracking-tight text-foreground" style={{ letterSpacing: '-0.02em' }}>
            ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Range Slider */}
      <div className="space-y-2">
        <div className="relative h-2 rounded-full bg-muted overflow-hidden">
          {/* Gradient Track */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20" />
          
          {/* Progress Fill */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
          
          {/* Current Position Indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-4 w-1 bg-foreground rounded-full shadow-lg transition-all duration-500"
            style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>

        {/* Min/Max Labels */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-red-500">
            MIN ${range.min.toLocaleString('en-US')}
          </span>
          <span className="font-medium text-green-500">
            MAX ${range.max.toLocaleString('en-US')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default ModelCard;
