import React, { useState } from 'react';
import { ChartDataPoint } from '../utils/analytics';
import { TrendingUp, Layers } from 'lucide-react';

interface LineTrendChartProps {
  data: ChartDataPoint[];
  productName?: string;
}

export const LineTrendChart: React.FC<LineTrendChartProps> = ({ data, productName }) => {
  const [metric, setMetric] = useState<'revenue' | 'units'>('revenue');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <TrendingUp className="w-8 h-8 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-600">No trend data available</p>
        <p className="text-xs text-slate-400 mt-1">Adjust active filters to view trajectory</p>
      </div>
    );
  }

  const values = data.map((d) => (metric === 'revenue' ? d.value : d.secondaryValue || 0));
  const maxVal = Math.max(...values, 100);
  const minVal = 0;
  const paddingX = 45;
  const paddingY = 35;
  const width = 640;
  const height = 260;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Calculate coordinates
  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(1, data.length - 1)) * chartW;
    const val = metric === 'revenue' ? d.value : d.secondaryValue || 0;
    const y = height - paddingY - (val / maxVal) * chartH;
    return { x, y, data: d, val };
  });

  // Construct SVG path line with smooth curve
  let pathD = '';
  if (points.length === 1) {
    pathD = `M ${points[0].x} ${points[0].y} L ${points[0].x + 10} ${points[0].y}`;
  } else {
    pathD = points.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      const prev = arr[idx - 1];
      const cx = (prev.x + curr.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }, '');
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const hoveredPoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Header & Metric Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>Historical Trajectory</span>
            {productName && productName !== 'all' && (
              <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded truncate max-w-[180px]">
                {productName}
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time performance across fiscal months
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setMetric('revenue')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              metric === 'revenue'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Revenue ($)
          </button>
          <button
            onClick={() => setMetric('units')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              metric === 'units'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Units Sold
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[280px] overflow-visible"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = height - paddingY - pct * chartH;
            const gridVal = minVal + pct * (maxVal - minVal);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray={pct === 0 ? '0' : '4 4'}
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {metric === 'revenue'
                    ? `$${Math.round(gridVal / 1000)}k`
                    : Math.round(gridVal).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          <path d={areaD} fill="url(#trendGradient)" />

          {/* Line curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                className="cursor-pointer"
              >
                {/* Active crosshair vertical guide */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingY}
                    x2={pt.x}
                    y2={height - paddingY}
                    stroke="#818cf8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 3.5}
                  fill={isHovered ? '#312e81' : '#ffffff'}
                  stroke="#4f46e5"
                  strokeWidth={isHovered ? 2.5 : 2}
                  className="transition-all duration-150"
                />

                {/* X Axis Label */}
                <text
                  x={pt.x}
                  y={height - paddingY + 16}
                  textAnchor="middle"
                  className={`text-[10px] font-sans ${
                    isHovered ? 'fill-indigo-900 font-semibold' : 'fill-slate-500'
                  }`}
                >
                  {pt.data.label.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg -translate-x-1/2 -translate-y-full transition-transform"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100 - 8}%`,
            }}
          >
            <div className="font-semibold text-slate-200">{hoveredPoint.data.label}</div>
            <div className="text-white font-mono tabular-nums text-sm font-bold">
              {metric === 'revenue'
                ? `$${hoveredPoint.val.toLocaleString()}`
                : `${hoveredPoint.val.toLocaleString()} units`}
            </div>
            <div className="text-[10px] text-slate-300">
              {metric === 'revenue'
                ? `${hoveredPoint.data.secondaryValue?.toLocaleString()} units shipped`
                : `$${hoveredPoint.data.value?.toLocaleString()} total revenue`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
