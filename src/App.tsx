/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { INITIAL_DATA, DataRecord } from './data/sampleData';
import {
  FilterState,
  filterRecords,
  calculateKPIs,
  getMonthlyTrend,
  getCategoryBreakdown,
  getRegionalBreakdown,
  getChannelBreakdown,
  getProductPerformance,
} from './utils/analytics';
import { TopNav } from './components/TopNav';
import { KPICardGrid } from './components/KPICardGrid';
import { FilterToolbar } from './components/FilterToolbar';
import { LineTrendChart } from './components/LineTrendChart';
import { DonutChart } from './components/DonutChart';
import { BarChart } from './components/BarChart';
import { ProductRankingView } from './components/ProductRankingView';
import { DataTable } from './components/DataTable';
import { AIInsightsDrawer } from './components/AIInsightsDrawer';
import { UploadModal } from './components/UploadModal';
import { AnnotationFeedbackBar } from './components/AnnotationFeedbackBar';
import { BarChart3, PieChart, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<DataRecord[]>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'table'>('overview');
  const [cardStyle, setCardStyle] = useState<'white' | 'subtle'>('white');
  const [isAnnotated, setIsAnnotated] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterState>({
    product: 'all',
    category: 'all',
    region: 'all',
    channel: 'all',
    quarter: 'all',
    searchQuery: '',
  });

  // Unique options extracted from active dataset
  const availableProducts = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.product))).sort();
  }, [records]);

  const availableCategories = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.category))).sort();
  }, [records]);

  const availableRegions = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.region))).sort();
  }, [records]);

  const availableChannels = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.channel))).sort();
  }, [records]);

  const availableQuarters = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.quarter))).sort();
  }, [records]);

  // Real-time dynamic filtering
  const filteredRecords = useMemo(() => {
    return filterRecords(records, filters);
  }, [records, filters]);

  // Real-time aggregates
  const kpiStats = useMemo(() => {
    return calculateKPIs(filteredRecords, records);
  }, [filteredRecords, records]);

  const monthlyTrend = useMemo(() => {
    return getMonthlyTrend(filteredRecords);
  }, [filteredRecords]);

  const categoryBreakdown = useMemo(() => {
    return getCategoryBreakdown(filteredRecords);
  }, [filteredRecords]);

  const regionalBreakdown = useMemo(() => {
    return getRegionalBreakdown(filteredRecords);
  }, [filteredRecords]);

  const channelBreakdown = useMemo(() => {
    return getChannelBreakdown(filteredRecords);
  }, [filteredRecords]);

  const productPerformance = useMemo(() => {
    return getProductPerformance(filteredRecords);
  }, [filteredRecords]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.product !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.region !== 'all') count++;
    if (filters.channel !== 'all') count++;
    if (filters.quarter !== 'all') count++;
    if (filters.searchQuery.trim() !== '') count++;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      product: 'all',
      category: 'all',
      region: 'all',
      channel: 'all',
      quarter: 'all',
      searchQuery: '',
    });
  };

  const handleResetData = () => {
    setRecords(INITIAL_DATA);
    handleResetFilters();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Universal Top Nav */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenInsights={() => setIsInsightsOpen(true)}
        onResetData={handleResetData}
        totalRecordsCount={records.length}
        filteredRecordsCount={filteredRecords.length}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Active Filter Status & Kicker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {filters.product !== 'all' ? filters.product : 'Commercial Performance Portfolio'}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Fiscal Range: 2025 – 2026</span>
              <span aria-hidden="true">·</span>
              <span>
                {filteredRecords.length} transactions matched
              </span>
              {filters.product !== 'all' && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-indigo-600 font-semibold">
                    Product Focus Active
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Context Summary */}
          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono bg-white border border-slate-200/80 px-3 py-1.5 rounded-lg shadow-2xs">
            <span className="text-slate-400">Yield:</span>
            <span className="font-bold text-slate-900">
              ${Math.round(kpiStats.totalRevenue).toLocaleString()}
            </span>
            <span className="text-slate-300">/</span>
            <span>{kpiStats.totalUnits.toLocaleString()} units</span>
          </div>
        </div>

        {/* 1. KPI Metric Cards */}
        <KPICardGrid
          stats={kpiStats}
          cardStyle={cardStyle}
          isAnnotated={isAnnotated}
        />

        {/* 2. Dynamic Auto-Generated Filter Bar */}
        <FilterToolbar
          filters={filters}
          setFilters={setFilters}
          availableProducts={availableProducts}
          availableCategories={availableCategories}
          availableRegions={availableRegions}
          availableChannels={availableChannels}
          availableQuarters={availableQuarters}
          onResetFilters={handleResetFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* 3. Main Dashboard Panels by Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Split Grid: Line Trend & Donut Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <LineTrendChart
                  data={monthlyTrend}
                  productName={filters.product}
                />
              </div>

              <div className="lg:col-span-5">
                <DonutChart
                  data={categoryBreakdown}
                  title="Category Revenue Distribution"
                  subtitle="Contribution by core merchandising line"
                  onSelectCategory={(cat) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: prev.category === cat ? 'all' : cat,
                    }))
                  }
                  selectedCategory={filters.category !== 'all' ? filters.category : undefined}
                />
              </div>
            </div>

            {/* Regional Performance & Product Hierarchy */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <BarChart
                  data={regionalBreakdown}
                  title="Regional Throughput"
                  subtitle="Gross merchandising distribution by territory"
                  onSelectBar={(reg) =>
                    setFilters((prev) => ({
                      ...prev,
                      region: prev.region === reg ? 'all' : reg,
                    }))
                  }
                  selectedBar={filters.region !== 'all' ? filters.region : undefined}
                />
              </div>

              <div className="lg:col-span-7">
                <ProductRankingView
                  products={productPerformance}
                  onSelectProduct={(p) =>
                    setFilters((prev) => ({
                      ...prev,
                      product: prev.product === p ? 'all' : p,
                    }))
                  }
                  selectedProduct={filters.product !== 'all' ? filters.product : undefined}
                />
              </div>
            </div>

            {/* Embedded Granular Ledger Preview */}
            <DataTable
              records={filteredRecords}
              onSelectProduct={(p) =>
                setFilters((prev) => ({ ...prev, product: p }))
              }
              onSelectRegion={(r) =>
                setFilters((prev) => ({ ...prev, region: r }))
              }
            />
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LineTrendChart
                data={monthlyTrend}
                productName={filters.product}
              />
              <DonutChart
                data={categoryBreakdown}
                title="Category Revenue Allocation"
                subtitle="Share of overall merchandise sales"
                onSelectCategory={(cat) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: prev.category === cat ? 'all' : cat,
                  }))
                }
                selectedCategory={filters.category !== 'all' ? filters.category : undefined}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChart
                data={regionalBreakdown}
                title="Regional Volume Analysis"
                subtitle="Cross-market performance comparisons"
                onSelectBar={(reg) =>
                  setFilters((prev) => ({
                    ...prev,
                    region: prev.region === reg ? 'all' : reg,
                  }))
                }
                selectedBar={filters.region !== 'all' ? filters.region : undefined}
              />
              <DonutChart
                data={channelBreakdown}
                title="Sales Channel Share"
                subtitle="Online vs Flagship vs Wholesale"
                onSelectCategory={(ch) =>
                  setFilters((prev) => ({
                    ...prev,
                    channel: prev.channel === ch ? 'all' : ch,
                  }))
                }
                selectedCategory={filters.channel !== 'all' ? filters.channel : undefined}
              />
            </div>

            <ProductRankingView
              products={productPerformance}
              onSelectProduct={(p) =>
                setFilters((prev) => ({
                  ...prev,
                  product: prev.product === p ? 'all' : p,
                }))
              }
              selectedProduct={filters.product !== 'all' ? filters.product : undefined}
            />
          </div>
        )}

        {activeTab === 'table' && (
          <DataTable
            records={filteredRecords}
            onSelectProduct={(p) =>
              setFilters((prev) => ({ ...prev, product: p }))
            }
            onSelectRegion={(r) =>
              setFilters((prev) => ({ ...prev, region: r }))
            }
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            InsightPulse Analytics Dashboard · Real-time multidimensional data exploration
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Custom CSV Upload
            </button>
            <button
              onClick={() => setIsInsightsOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              AI Insights Engine
            </button>
            <button
              onClick={handleResetData}
              className="hover:text-slate-900 transition-colors"
            >
              Reset Dataset
            </button>
          </div>
        </div>
      </footer>

      {/* AI Insights Modal */}
      <AIInsightsDrawer
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        stats={kpiStats}
        activeFilters={filters}
        topProducts={productPerformance}
        regionalBreakdown={regionalBreakdown}
        channelSplit={channelBreakdown}
        monthlyTrend={monthlyTrend}
      />

      {/* Upload CSV Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={(newRecords) => {
          setRecords(newRecords);
          handleResetFilters();
        }}
      />

      {/* Step 3 Visual Annotation Simulation Floating Tool */}
      <AnnotationFeedbackBar
        cardStyle={cardStyle}
        setCardStyle={setCardStyle}
        isAnnotated={isAnnotated}
        setIsAnnotated={setIsAnnotated}
      />
    </div>
  );
}
