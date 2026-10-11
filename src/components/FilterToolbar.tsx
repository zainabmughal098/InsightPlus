import React from 'react';
import { Search, X, Filter, Sparkles, Check } from 'lucide-react';
import { FilterState } from '../utils/analytics';

interface FilterToolbarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableProducts: string[];
  availableCategories: string[];
  availableRegions: string[];
  availableChannels: string[];
  availableQuarters: string[];
  onResetFilters: () => void;
  activeFilterCount: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  setFilters,
  availableProducts,
  availableCategories,
  availableRegions,
  availableChannels,
  availableQuarters,
  onResetFilters,
  activeFilterCount,
}) => {
  const isPremiumTrousersActive = filters.product === 'Premium Tailored Trousers';

  const togglePremiumTrousers = () => {
    setFilters((prev) => ({
      ...prev,
      product: isPremiumTrousersActive ? 'all' : 'Premium Tailored Trousers',
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, categories, regions, or sales channels..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick-test Presets & Reset */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <span className="text-xs text-slate-500 font-medium">Lab Test Quick Filter:</span>
          <button
            onClick={togglePremiumTrousers}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              isPremiumTrousersActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 hover:bg-indigo-100'
            }`}
          >
            {isPremiumTrousersActive ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            )}
            <span>Premium Tailored Trousers</span>
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Select Filters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1 border-t border-slate-100">
        {/* Product Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Product
          </label>
          <select
            value={filters.product}
            onChange={(e) => setFilters((prev) => ({ ...prev, product: e.target.value }))}
            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800 truncate"
          >
            <option value="all">All Products ({availableProducts.length})</option>
            {availableProducts.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800 truncate"
          >
            <option value="all">All Categories ({availableCategories.length})</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Region
          </label>
          <select
            value={filters.region}
            onChange={(e) => setFilters((prev) => ({ ...prev, region: e.target.value }))}
            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800 truncate"
          >
            <option value="all">All Regions ({availableRegions.length})</option>
            {availableRegions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Sales Channel Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Channel
          </label>
          <select
            value={filters.channel}
            onChange={(e) => setFilters((prev) => ({ ...prev, channel: e.target.value }))}
            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800 truncate"
          >
            <option value="all">All Channels ({availableChannels.length})</option>
            {availableChannels.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>
        </div>

        {/* Quarter Filter */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Fiscal Quarter
          </label>
          <select
            value={filters.quarter}
            onChange={(e) => setFilters((prev) => ({ ...prev, quarter: e.target.value }))}
            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800 truncate"
          >
            <option value="all">All Quarters</option>
            {availableQuarters.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
