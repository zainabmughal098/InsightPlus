import React, { useState, useMemo } from 'react';
import { DataRecord } from '../data/sampleData';
import { Download, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { exportToCSV } from '../utils/analytics';

interface DataTableProps {
  records: DataRecord[];
  onSelectProduct?: (product: string) => void;
  onSelectRegion?: (region: string) => void;
}

type SortField = 'date' | 'product' | 'category' | 'region' | 'channel' | 'revenue' | 'unitsSold' | 'margin' | 'rating';

export const DataTable: React.FC<DataTableProps> = ({
  records,
  onSelectProduct,
  onSelectRegion,
}) => {
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableSearch, setTableSearch] = useState<string>('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for metrics
    }
  };

  const filteredRecords = useMemo(() => {
    if (!tableSearch.trim()) return records;
    const q = tableSearch.toLowerCase();
    return records.filter(
      (r) =>
        r.product.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q) ||
        r.channel.toLowerCase().includes(q) ||
        r.date.includes(q)
    );
  }, [records, tableSearch]);

  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [filteredRecords, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const pageIndex = Math.min(currentPage, totalPages);
  const paginatedRecords = sortedRecords.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  const handleExportCSV = () => {
    const csvContent = exportToCSV(sortedRecords);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `dashboard_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Granular Transaction Ledger</h3>
          <span className="text-xs text-slate-500 font-mono">
            {sortedRecords.length} rows
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter ledger..."
              value={tableSearch}
              onChange={(e) => {
                setTableSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="Export filtered records as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs divide-y divide-slate-200">
          <thead className="bg-slate-50/80 text-slate-600 font-semibold select-none">
            <tr>
              <th
                onClick={() => handleSort('date')}
                className="py-3 px-3.5 cursor-pointer hover:text-slate-900 whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('product')}
                className="py-3 px-3.5 cursor-pointer hover:text-slate-900 whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Product</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('category')}
                className="py-3 px-3.5 cursor-pointer hover:text-slate-900 whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Category</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('region')}
                className="py-3 px-3.5 cursor-pointer hover:text-slate-900 whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Region</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('channel')}
                className="py-3 px-3.5 cursor-pointer hover:text-slate-900 whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Channel</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('revenue')}
                className="py-3 px-3.5 text-right cursor-pointer hover:text-slate-900 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Revenue</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('unitsSold')}
                className="py-3 px-3.5 text-right cursor-pointer hover:text-slate-900 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Units</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('margin')}
                className="py-3 px-3.5 text-right cursor-pointer hover:text-slate-900 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Margin %</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('rating')}
                className="py-3 px-3.5 text-right cursor-pointer hover:text-slate-900 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Rating</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No records match your criteria.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((r) => {
                const isPremiumTrousers = r.product === 'Premium Tailored Trousers';
                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isPremiumTrousers ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="py-2.5 px-3.5 font-medium text-slate-900 whitespace-nowrap">
                      <button
                        onClick={() => onSelectProduct && onSelectProduct(r.product)}
                        className="hover:text-indigo-600 hover:underline text-left"
                        title="Filter by this product"
                      >
                        {r.product}
                      </button>
                      {isPremiumTrousers && (
                        <span className="ml-2 text-[10px] text-indigo-700 bg-indigo-100/70 px-1.5 py-0.2 rounded font-normal">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 whitespace-nowrap">
                      {r.category}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 whitespace-nowrap">
                      <button
                        onClick={() => onSelectRegion && onSelectRegion(r.region)}
                        className="hover:text-indigo-600 hover:underline"
                        title="Filter by this region"
                      >
                        {r.region}
                      </button>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-500 whitespace-nowrap">
                      {r.channel}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      ${r.revenue.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                      {r.unitsSold.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                      {r.margin.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-amber-600 font-medium tabular-nums whitespace-nowrap">
                      ★ {r.rating.toFixed(1)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-3 bg-slate-50/60 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-200 rounded px-2 py-1 text-xs"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="font-mono">
            Showing {(pageIndex - 1) * pageSize + 1} -{' '}
            {Math.min(pageIndex * pageSize, sortedRecords.length)} of {sortedRecords.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={pageIndex <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono">
            Page {pageIndex} of {totalPages}
          </span>
          <button
            disabled={pageIndex >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
