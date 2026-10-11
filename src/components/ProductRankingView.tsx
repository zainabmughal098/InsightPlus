import React from 'react';
import { Award, ArrowUpRight, TrendingUp } from 'lucide-react';

interface ProductRankingViewProps {
  products: {
    product: string;
    category: string;
    revenue: number;
    units: number;
    margin: number;
    returnRate: number;
  }[];
  onSelectProduct?: (product: string) => void;
  selectedProduct?: string;
}

export const ProductRankingView: React.FC<ProductRankingViewProps> = ({
  products,
  onSelectProduct,
  selectedProduct,
}) => {
  if (!products || products.length === 0) return null;

  const maxRevenue = Math.max(...products.map((p) => p.revenue), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Product Merchandising Hierarchy</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Revenue volume, margin contribution, and return profiles
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {products.slice(0, 6).map((item, idx) => {
          const isSelected = selectedProduct === item.product;
          const isTrousers = item.product === 'Premium Tailored Trousers';
          const pct = (item.revenue / maxRevenue) * 100;

          return (
            <div
              key={item.product}
              onClick={() => onSelectProduct && onSelectProduct(item.product)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 shadow-xs'
                  : isTrousers
                  ? 'border-indigo-200 bg-indigo-50/20 hover:border-indigo-300'
                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-xs text-slate-900 truncate">
                    {item.product}
                  </span>
                  {isTrousers && (
                    <span className="text-[10px] text-indigo-700 bg-indigo-100 font-medium px-1.5 py-0.2 rounded shrink-0">
                      Focus Item
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                  <span className="font-bold text-slate-900">
                    ${Math.round(item.revenue).toLocaleString()}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              {/* Bar track */}
              <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isTrousers ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                  style={{ width: `${Math.max(4, pct)}%` }}
                />
              </div>

              {/* Sub-metrics */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{item.category}</span>
                <div className="flex items-center gap-3">
                  <span>{item.units.toLocaleString()} units</span>
                  <span>{item.margin.toFixed(1)}% margin</span>
                  <span className="text-slate-400">ret: {item.returnRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
