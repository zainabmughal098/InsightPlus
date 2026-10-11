import React, { useState } from 'react';
import { ChartDataPoint } from '../utils/analytics';
import { BarChart3 } from 'lucide-react';

interface BarChartProps {
  data: ChartDataPoint[];
  title: string;
  subtitle?: string;
  onSelectBar?: (label: string) => void;
  selectedBar?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  subtitle,
  onSelectBar,
  selectedBar,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <BarChart3 className="w-8 h-8 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-600">No regional data available</p>
        <p className="text-xs text-slate-400 mt-1">Adjust filters to inspect regional performance</p>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.value), 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="space-y-3.5 my-auto">
        {data.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const isSelected = selectedBar === item.label;
          const pctWidth = Math.max(3, (item.value / maxVal) * 100);

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => onSelectBar && onSelectBar(item.label)}
              className={`p-2 rounded-lg cursor-pointer transition-all ${
                isHovered || isSelected ? 'bg-slate-50' : ''
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800">{item.label}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-400 text-[11px] font-normal">
                    {item.percentage?.toFixed(1)}% share
                  </span>
                  <span className="font-bold text-slate-900">
                    ${Math.round(item.value).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${pctWidth}%`,
                    backgroundColor: item.color || '#2563eb',
                    opacity: isHovered || isSelected ? 1 : 0.85,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Real-time benchmark</span>
        <span className="font-mono">Top: {data[0]?.label} (${Math.round(data[0]?.value || 0).toLocaleString()})</span>
      </div>
    </div>
  );
};
