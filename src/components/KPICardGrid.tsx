import React from 'react';
import { DollarSign, Package, TrendingUp, Percent, Star, RotateCcw } from 'lucide-react';
import { KPIStats } from '../utils/analytics';

interface KPICardGridProps {
  stats: KPIStats;
  cardStyle?: 'white' | 'subtle';
  isAnnotated?: boolean;
}

export const KPICardGrid: React.FC<KPICardGridProps> = ({
  stats,
  cardStyle = 'white',
  isAnnotated = false,
}) => {
  const cards = [
    {
      title: 'Gross Revenue',
      value: `$${Math.round(stats.totalRevenue).toLocaleString()}`,
      change: `+${stats.revenueGrowthPct}% vs prior period`,
      isPositive: true,
      subtext: 'Net booked merchandise value',
      icon: DollarSign,
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Units Sold',
      value: Math.round(stats.totalUnits).toLocaleString(),
      change: `+${stats.unitsGrowthPct}% volume growth`,
      isPositive: true,
      subtext: 'Cumulative items shipped',
      icon: Package,
      iconColor: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Average Order Value',
      value: `$${stats.avgOrderValue.toFixed(2)}`,
      change: '+$14.20 basket uplift',
      isPositive: true,
      subtext: 'Revenue per unit transaction',
      icon: TrendingUp,
      iconColor: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Gross Margin',
      value: `${stats.grossMargin.toFixed(1)}%`,
      change: 'Target: > 60.0%',
      isPositive: stats.grossMargin >= 60,
      subtext: 'Profit after direct cost of goods',
      icon: Percent,
      iconColor: 'text-violet-600 bg-violet-50',
    },
    {
      title: 'Customer Satisfaction',
      value: `${stats.avgRating.toFixed(2)} / 5.0`,
      change: '98.2% positive reviews',
      isPositive: true,
      subtext: 'Verified buyer satisfaction',
      icon: Star,
      iconColor: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Return Rate',
      value: `${stats.avgReturnRate.toFixed(1)}%`,
      change: 'Industry benchmark: < 5.0%',
      isPositive: stats.avgReturnRate < 4.5,
      subtext: 'Warranty & exchange frequency',
      icon: RotateCcw,
      iconColor: 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div
      id="kpi-cards-container"
      className={`relative transition-all duration-300 ${
        isAnnotated ? 'ring-2 ring-indigo-500 ring-offset-4 rounded-xl' : ''
      }`}
    >
      {isAnnotated && (
        <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs z-10">
          Target: KPI Cards (White Background Applied)
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl transition-all duration-200 border ${
                cardStyle === 'white'
                  ? 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-medium text-slate-500 truncate" title={c.title}>
                  {c.title}
                </span>
                <div className={`p-1.5 rounded-md ${c.iconColor} shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums truncate">
                  {c.value}
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span
                    className={`font-medium ${
                      c.isPositive ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {c.change}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate pt-0.5">{c.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
