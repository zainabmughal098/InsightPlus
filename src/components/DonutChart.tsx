import React, { useState } from 'react';
import { ChartDataPoint } from '../utils/analytics';
import { PieChart as PieIcon } from 'lucide-react';

interface DonutChartProps {
  data: ChartDataPoint[];
  title: string;
  subtitle?: string;
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  subtitle,
  onSelectCategory,
  selectedCategory,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <PieIcon className="w-8 h-8 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-600">No category breakdown available</p>
        <p className="text-xs text-slate-400 mt-1">Adjust filters to populate breakdown</p>
      </div>
    );
  }

  const totalValue = data.reduce((acc, d) => acc + d.value, 0);

  // SVG Geometry
  const size = 260;
  const center = size / 2;
  const radius = 95;
  const innerRadius = 62;

  // Compute angles for each slice
  let accumulatedAngle = -90; // Start at 12 o'clock
  const slices = data.map((item, idx) => {
    const fraction = totalValue > 0 ? item.value / totalValue : 0;
    const sliceAngle = fraction * 360;
    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + sliceAngle;
    accumulatedAngle += sliceAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const isLargeArc = sliceAngle > 180 ? 1 : 0;

    // Outer arc
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    // Inner arc
    const x3 = center + innerRadius * Math.cos(endRad);
    const y3 = center + innerRadius * Math.sin(endRad);
    const x4 = center + innerRadius * Math.cos(startRad);
    const y4 = center + innerRadius * Math.sin(startRad);

    const pathD = `M ${x1} ${y1} A ${radius} ${radius} 0 ${isLargeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${isLargeArc} 0 ${x4} ${y4} Z`;

    return {
      item,
      pathD,
      fraction,
      percentage: (fraction * 100).toFixed(1),
      color: item.color || '#3b82f6',
      idx,
    };
  });

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-auto py-2">
        {/* SVG Donut Canvas */}
        <div className="relative w-[210px] h-[210px] shrink-0 select-none">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
            {slices.map((slice) => {
              const isHovered = hoveredIdx === slice.idx;
              const isSelected = selectedCategory === slice.item.label;
              return (
                <path
                  key={slice.idx}
                  d={slice.pathD}
                  fill={slice.color}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all duration-150"
                  style={{
                    transformOrigin: `${center}px ${center}px`,
                    transform: isHovered || isSelected ? 'scale(1.04)' : 'scale(1)',
                    opacity: isHovered || isSelected ? 1 : hoveredIdx !== null ? 0.7 : 0.95,
                  }}
                  onMouseEnter={() => setHoveredIdx(slice.idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => onSelectCategory && onSelectCategory(slice.item.label)}
                />
              );
            })}
          </svg>

          {/* Center Hole Information */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            {activeSlice ? (
              <>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider truncate max-w-[110px]">
                  {activeSlice.item.label}
                </span>
                <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  {activeSlice.percentage}%
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  ${Math.round(activeSlice.item.value / 1000)}k
                </span>
              </>
            ) : (
              <>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Total Value
                </span>
                <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  ${Math.round(totalValue / 1000)}k
                </span>
                <span className="text-[10px] text-slate-400">
                  {data.length} segments
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend Breakdown */}
        <div className="flex-1 w-full space-y-1.5 overflow-y-auto max-h-[220px] pr-1">
          {slices.map((slice) => {
            const isHovered = hoveredIdx === slice.idx;
            const isSelected = selectedCategory === slice.item.label;
            return (
              <div
                key={slice.idx}
                onMouseEnter={() => setHoveredIdx(slice.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => onSelectCategory && onSelectCategory(slice.item.label)}
                className={`flex items-center justify-between text-xs py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
                  isHovered || isSelected ? 'bg-slate-100/90 font-medium' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-slate-700 truncate" title={slice.item.label}>
                    {slice.item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 font-mono text-slate-900">
                  <span className="text-slate-500 text-[11px]">{slice.percentage}%</span>
                  <span className="font-semibold">${Math.round(slice.item.value).toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
