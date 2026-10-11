import { DataRecord } from '../data/sampleData';

export interface FilterState {
  product: string; // 'all' or specific product
  category: string; // 'all' or specific category
  region: string; // 'all' or specific region
  channel: string; // 'all' or specific channel
  quarter: string; // 'all' or specific quarter
  searchQuery: string;
}

export interface KPIStats {
  totalRevenue: number;
  totalUnits: number;
  avgOrderValue: number;
  grossMargin: number;
  avgRating: number;
  avgReturnRate: number;
  previousPeriodRevenue: number;
  revenueGrowthPct: number;
  unitsGrowthPct: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  percentage?: number;
  color?: string;
}

export function filterRecords(records: DataRecord[], filters: FilterState): DataRecord[] {
  return records.filter((r) => {
    if (filters.product !== 'all' && r.product !== filters.product) return false;
    if (filters.category !== 'all' && r.category !== filters.category) return false;
    if (filters.region !== 'all' && r.region !== filters.region) return false;
    if (filters.channel !== 'all' && r.channel !== filters.channel) return false;
    if (filters.quarter !== 'all' && r.quarter !== filters.quarter) return false;

    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      const match =
        r.product.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q) ||
        r.channel.toLowerCase().includes(q) ||
        r.month.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
}

export function calculateKPIs(filtered: DataRecord[], allRecords: DataRecord[]): KPIStats {
  if (filtered.length === 0) {
    return {
      totalRevenue: 0,
      totalUnits: 0,
      avgOrderValue: 0,
      grossMargin: 0,
      avgRating: 0,
      avgReturnRate: 0,
      previousPeriodRevenue: 0,
      revenueGrowthPct: 0,
      unitsGrowthPct: 0,
    };
  }

  const totalRevenue = filtered.reduce((acc, r) => acc + r.revenue, 0);
  const totalUnits = filtered.reduce((acc, r) => acc + r.unitsSold, 0);
  const totalCost = filtered.reduce((acc, r) => acc + (r.cost || r.revenue * 0.4), 0);
  const grossMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;
  const avgOrderValue = totalUnits > 0 ? totalRevenue / totalUnits : 0;
  const avgRating = filtered.reduce((acc, r) => acc + r.rating, 0) / filtered.length;
  const avgReturnRate = filtered.reduce((acc, r) => acc + r.returnRate, 0) / filtered.length;

  // Realistic mock period comparison (+8.4% to +14.2% typical healthy trajectory)
  const prevRevenueEstimate = totalRevenue / 1.118;
  const revenueGrowthPct = 11.8;
  const unitsGrowthPct = 9.4;

  return {
    totalRevenue,
    totalUnits,
    avgOrderValue,
    grossMargin,
    avgRating,
    avgReturnRate,
    previousPeriodRevenue: prevRevenueEstimate,
    revenueGrowthPct,
    unitsGrowthPct,
  };
}

export function getMonthlyTrend(records: DataRecord[]): ChartDataPoint[] {
  // Aggregate revenue and units by month
  const monthMap = new Map<string, { revenue: number; units: number; dateStr: string }>();

  records.forEach((r) => {
    const existing = monthMap.get(r.month) || { revenue: 0, units: 0, dateStr: r.date };
    existing.revenue += r.revenue;
    existing.units += r.unitsSold;
    monthMap.set(r.month, existing);
  });

  // Sort chronologically by dateStr
  const sorted = Array.from(monthMap.entries()).sort((a, b) => {
    return a[1].dateStr.localeCompare(b[1].dateStr);
  });

  return sorted.map(([month, data]) => ({
    label: month,
    value: data.revenue,
    secondaryValue: data.units,
  }));
}

export function getCategoryBreakdown(records: DataRecord[]): ChartDataPoint[] {
  const catMap = new Map<string, number>();
  let total = 0;

  records.forEach((r) => {
    const current = catMap.get(r.category) || 0;
    catMap.set(r.category, current + r.revenue);
    total += r.revenue;
  });

  const PALETTE = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#6366F1', // Indigo
  ];

  return Array.from(catMap.entries())
    .map(([cat, val], idx) => ({
      label: cat,
      value: val,
      percentage: total > 0 ? (val / total) * 100 : 0,
      color: PALETTE[idx % PALETTE.length],
    }))
    .sort((a, b) => b.value - a.value);
}

export function getRegionalBreakdown(records: DataRecord[]): ChartDataPoint[] {
  const regMap = new Map<string, number>();
  let total = 0;

  records.forEach((r) => {
    const current = regMap.get(r.region) || 0;
    regMap.set(r.region, current + r.revenue);
    total += r.revenue;
  });

  const REGION_COLORS: Record<string, string> = {
    'North America': '#2563EB',
    'Europe': '#059669',
    'Asia Pacific': '#D97706',
    'Latin America': '#7C3AED',
  };

  return Array.from(regMap.entries())
    .map(([region, val]) => ({
      label: region,
      value: val,
      percentage: total > 0 ? (val / total) * 100 : 0,
      color: REGION_COLORS[region] || '#64748B',
    }))
    .sort((a, b) => b.value - a.value);
}

export function getChannelBreakdown(records: DataRecord[]): ChartDataPoint[] {
  const chMap = new Map<string, { revenue: number; units: number }>();
  let total = 0;

  records.forEach((r) => {
    const current = chMap.get(r.channel) || { revenue: 0, units: 0 };
    current.revenue += r.revenue;
    current.units += r.unitsSold;
    chMap.set(r.channel, current);
    total += r.revenue;
  });

  const CHANNEL_COLORS: Record<string, string> = {
    'Online Store': '#0284C7',
    'Retail Flagship': '#10B981',
    'Wholesale Partner': '#F59E0B',
  };

  return Array.from(chMap.entries()).map(([channel, data]) => ({
    label: channel,
    value: data.revenue,
    secondaryValue: data.units,
    percentage: total > 0 ? (data.revenue / total) * 100 : 0,
    color: CHANNEL_COLORS[channel] || '#64748B',
  }));
}

export function getProductPerformance(records: DataRecord[]): {
  product: string;
  category: string;
  revenue: number;
  units: number;
  margin: number;
  returnRate: number;
}[] {
  const prodMap = new Map<
    string,
    { category: string; revenue: number; units: number; cost: number; returnCount: number; count: number }
  >();

  records.forEach((r) => {
    const existing = prodMap.get(r.product) || {
      category: r.category,
      revenue: 0,
      units: 0,
      cost: 0,
      returnCount: 0,
      count: 0,
    };
    existing.revenue += r.revenue;
    existing.units += r.unitsSold;
    existing.cost += r.cost || r.revenue * 0.4;
    existing.returnCount += r.returnRate;
    existing.count += 1;
    prodMap.set(r.product, existing);
  });

  return Array.from(prodMap.entries())
    .map(([product, data]) => ({
      product,
      category: data.category,
      revenue: data.revenue,
      units: data.units,
      margin: data.revenue > 0 ? ((data.revenue - data.cost) / data.revenue) * 100 : 0,
      returnRate: data.count > 0 ? data.returnCount / data.count : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function exportToCSV(records: DataRecord[]): string {
  const headers = ['Date', 'Month', 'Quarter', 'Product', 'Category', 'Region', 'Channel', 'Revenue', 'UnitsSold', 'UnitPrice', 'MarginPct', 'ReturnRatePct', 'Rating'];
  const rows = records.map((r) => [
    r.date,
    r.month,
    r.quarter,
    `"${r.product.replace(/"/g, '""')}"`,
    `"${r.category.replace(/"/g, '""')}"`,
    `"${r.region}"`,
    `"${r.channel}"`,
    r.revenue,
    r.unitsSold,
    r.unitPrice,
    r.margin.toFixed(1),
    r.returnRate.toFixed(1),
    r.rating.toFixed(1),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}
