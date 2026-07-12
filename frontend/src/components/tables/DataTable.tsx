import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, EyeOff, Filter, RefreshCcw, Search, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
  enableExport?: boolean;
  bulkActions?: {
    label: string;
    action: (selectedItems: T[]) => void;
    icon?: React.ReactNode;
  }[];
  rowKey: (item: T) => string | number;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchKey,
  isLoading = false,
  isError = false,
  onRetry,
  emptyMessage = 'No records found',
  enableExport = true,
  bulkActions,
  rowKey,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const itemsPerPage = 8;

  // 1. Search filtering
  const filteredData = React.useMemo(() => {
    if (!searchQuery || !searchKey) return data;
    return data.filter((item) => {
      const val = item[searchKey];
      if (typeof val === 'string') {
        return val.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return String(val).toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [data, searchQuery, searchKey]);

  // 2. Pagination split
  const totalPages = Math.max(Math.ceil(filteredData.length / itemsPerPage), 1);
  const paginatedData = React.useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(paginatedData);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, item]);
    } else {
      setSelectedItems((prev) => prev.filter((selected) => rowKey(selected) !== rowKey(item)));
    }
  };

  // State handlers
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-red-500/30 rounded-lg bg-red-500/5 gap-4">
        <h4 className="font-bold text-sm text-red-500 uppercase tracking-wider">Failed to Load Records</h4>
        <p className="text-xs text-zinc-400 max-w-sm text-center">
          The platform was unable to fetch server ledger data. Please check your connection and try again.
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RefreshCcw className="h-3.5 w-3.5" />}>
            Retry connection
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-zinc-950/20 p-4 border border-border rounded-lg">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-9 bg-background border border-border text-xs rounded-md pl-9 pr-3 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="flex items-center gap-3">
          {selectedItems.length > 0 && bulkActions && (
            <div className="flex items-center gap-2 border-r border-border pr-3">
              <span className="text-xs font-semibold text-zinc-400 mr-1 uppercase">
                {selectedItems.length} Selected
              </span>
              {bulkActions.map((action, idx) => (
                <Button
                  key={idx}
                  variant="danger"
                  size="sm"
                  leftIcon={action.icon}
                  onClick={() => {
                    action.action(selectedItems);
                    setSelectedItems([]);
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {enableExport && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="h-3.5 w-3.5" />}
              onClick={() => alert('CSV Export triggered (Interface Placeholder)')}
            >
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid Viewport */}
      {isLoading ? (
        <div className="border border-border rounded-lg divide-y divide-border/60 bg-card overflow-hidden">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="h-14 flex items-center px-6 gap-4 animate-pulse">
              <div className="h-4 w-4 bg-zinc-800 rounded" />
              <div className="h-4 w-1/4 bg-zinc-800 rounded" />
              <div className="h-4 w-1/3 bg-zinc-800 rounded" />
              <div className="h-4 w-12 bg-zinc-800 rounded ml-auto" />
            </div>
          ))}
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-border rounded-lg bg-card text-center select-none">
          <EyeOff className="h-8 w-8 text-zinc-600 mb-3" />
          <h4 className="font-semibold text-sm text-zinc-300">Empty Ledger</h4>
          <p className="text-xs text-zinc-500 max-w-sm mt-1">{emptyMessage}</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block border border-border rounded-lg bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-950/40 text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-border">
                  <tr>
                    {bulkActions && (
                      <th className="px-6 py-4 w-10">
                        <input
                          type="checkbox"
                          className="rounded border-border bg-background"
                          onChange={handleSelectAll}
                          checked={selectedItems.length === paginatedData.length}
                        />
                      </th>
                    )}
                    {columns.map((col, idx) => (
                      <th key={idx} className="px-6 py-4 font-semibold">
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedData.map((item) => {
                    const key = String(rowKey(item));
                    const isItemSelected = selectedItems.some((selected) => rowKey(selected) === key);
                    return (
                      <tr key={key} className="hover:bg-zinc-900/40 transition-colors">
                        {bulkActions && (
                          <td className="px-6 py-3.5">
                            <input
                              type="checkbox"
                              className="rounded border-border bg-background"
                              checked={isItemSelected}
                              onChange={(e) => handleSelectItem(item, e.target.checked)}
                            />
                          </td>
                        )}
                        {columns.map((col, colIdx) => (
                          <td key={colIdx} className="px-6 py-3.5 font-medium text-zinc-300">
                            {typeof col.accessor === 'function'
                              ? col.accessor(item)
                              : (item[col.accessor] as React.ReactNode)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Layout Fallback */}
          <div className="md:hidden space-y-3">
            {paginatedData.map((item) => {
              const key = String(rowKey(item));
              return (
                <div key={key} className="p-4 bg-card border border-border rounded-lg space-y-3 shadow-sm">
                  {columns.map((col, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
                      <span className="font-semibold text-zinc-500 uppercase tracking-wider">{col.header}</span>
                      <span className="font-medium text-zinc-200">
                        {typeof col.accessor === 'function' ? col.accessor(item) : String(item[col.accessor])}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Simple Pagination bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/60 pt-4 px-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
