'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { AppCard } from '@/components/primitives'
import { TrendingUp, TrendingDown } from 'lucide-react'

/**
 * MetricCard Pattern Component
 * Card for displaying metrics with trends
 */

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  trendPercent?: number
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ title, value, unit, trend, trendPercent, icon: Icon, className }, ref) => {
    const TrendIcon =
      trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null
    const trendColor =
      trend === 'up'
        ? 'text-success'
        : trend === 'down'
          ? 'text-destructive'
          : 'text-muted-foreground'

    return (
      <AppCard ref={ref} variant="default" className={className}>
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
            {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {value}
            </span>
            {unit && (
              <span className="text-sm text-muted-foreground">
                {unit}
              </span>
            )}
          </div>

          {trend && trendPercent !== undefined && (
            <div className={cn('flex items-center gap-1 mt-3', trendColor)}>
              {TrendIcon && <TrendIcon className="h-4 w-4" />}
              <span className="text-sm font-medium">
                {Math.abs(trendPercent)}%
              </span>
            </div>
          )}
        </div>
      </AppCard>
    )
  }
)

MetricCard.displayName = 'MetricCard'

export { MetricCard }
export type { MetricCardProps }
