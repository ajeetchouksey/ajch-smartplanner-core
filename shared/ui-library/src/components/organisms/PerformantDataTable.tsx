import React, { useMemo, useCallback, useState } from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import { useVirtualScroll, useDebounce, usePerformanceMonitor } from '../../hooks/performance/useVirtualScroll';
import { useKeyboardNavigation, useAriaLabeling, useLiveRegion } from '../../hooks/accessibility';
import { useResponsive } from '../../hooks/accessibility';

export interface DataTableColumn<T = any> {
  key: keyof T;
  label: string;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  headerRender?: () => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  height?: number;
  rowHeight?: number;
  loading?: boolean;
  emptyMessage?: string;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: keyof T, order: 'asc' | 'desc') => void;
  onRowClick?: (row: T, index: number) => void;
  onRowSelect?: (selectedRows: T[]) => void;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedRows?: T[];
  searchValue?: string;
  onSearch?: (value: string) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  className?: string;
  'aria-label'?: string;
}

export function PerformantDataTable<T extends Record<string, any>>({
  data,
  columns,
  height = 400,
  rowHeight = 48,
  loading = false,
  emptyMessage = 'No data available',
  sortBy,
  sortOrder = 'asc',
  onSort,
  onRowClick,
  onRowSelect,
  selectable = false,
  multiSelect = false,
  selectedRows = [],
  searchValue = '',
  onSearch,
  pagination,
  className = '',
  'aria-label': ariaLabel,
}: DataTableProps<T>) {
  const { theme } = useTheme();
  const { mobile, tablet } = useResponsive();
  const { announce } = useLiveRegion();
  const { markMilestone } = usePerformanceMonitor('PerformantDataTable');
  const [internalSelectedRows, setInternalSelectedRows] = useState<T[]>(selectedRows);
  
  // Use debounced search for performance
  const debouncedSearchValue = useDebounce(searchValue, 300);

  // Filter and sort data
  const processedData = useMemo(() => {
    markMilestone('Data processing start');
    
    let result = [...data];

    // Apply search filter
    if (debouncedSearchValue) {
      const searchLower = debouncedSearchValue.toLowerCase();
      result = result.filter(row =>
        columns.some(column => {
          const value = row[column.key];
          return value != null && 
                 value.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    markMilestone('Data processing end');
    return result;
  }, [data, debouncedSearchValue, sortBy, sortOrder, columns, markMilestone]);

  // Virtual scrolling setup
  const {
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    onScroll,
    scrollToIndex,
  } = useVirtualScroll({
    itemHeight: rowHeight,
    containerHeight: height - 48, // Account for header height
    itemCount: processedData.length,
    overscan: 5,
  });

  // Visible rows for rendering
  const visibleRows = useMemo(() => {
    return processedData.slice(startIndex, endIndex + 1);
  }, [processedData, startIndex, endIndex]);

  // Selection handlers
  const handleRowSelect = useCallback((row: T, selected: boolean) => {
    let newSelectedRows: T[];
    
    if (multiSelect) {
      if (selected) {
        newSelectedRows = [...internalSelectedRows, row];
      } else {
        newSelectedRows = internalSelectedRows.filter(r => r !== row);
      }
    } else {
      newSelectedRows = selected ? [row] : [];
    }

    setInternalSelectedRows(newSelectedRows);
    onRowSelect?.(newSelectedRows);

    // Announce selection change
    const selectedCount = newSelectedRows.length;
    const message = selectedCount === 0 ? 'No rows selected' :
                   selectedCount === 1 ? '1 row selected' :
                   `${selectedCount} rows selected`;
    announce(message, 'polite');
  }, [internalSelectedRows, multiSelect, onRowSelect, announce]);

  const handleSelectAll = useCallback((selected: boolean) => {
    const newSelectedRows = selected ? processedData : [];
    setInternalSelectedRows(newSelectedRows);
    onRowSelect?.(newSelectedRows);

    const message = selected ? 
      `All ${processedData.length} rows selected` : 
      'All rows deselected';
    announce(message, 'polite');
  }, [processedData, onRowSelect, announce]);

  // Sort handler
  const handleSort = useCallback((column: DataTableColumn<T>) => {
    if (!column.sortable || !onSort) return;

    const newOrder = sortBy === column.key && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(column.key, newOrder);

    announce(`Table sorted by ${column.label} ${newOrder}ending`, 'polite');
  }, [sortBy, sortOrder, onSort, announce]);

  // Keyboard navigation
  const [focusedRowIndex, setFocusedRowIndex] = useState(0);
  const [focusedColumnIndex, setFocusedColumnIndex] = useState(0);

  useKeyboardNavigation({
    onArrowKeys: (direction) => {
      switch (direction) {
        case 'up':
          setFocusedRowIndex(prev => Math.max(0, prev - 1));
          break;
        case 'down':
          setFocusedRowIndex(prev => Math.min(processedData.length - 1, prev + 1));
          break;
        case 'left':
          setFocusedColumnIndex(prev => Math.max(0, prev - 1));
          break;
        case 'right':
          setFocusedColumnIndex(prev => Math.min(columns.length - 1, prev + 1));
          break;
      }
    },
    onEnter: () => {
      const row = processedData[focusedRowIndex];
      if (row) {
        onRowClick?.(row, focusedRowIndex);
      }
    },
  });

  // Responsive column configuration
  const responsiveColumns = useMemo(() => {
    if (mobile) {
      // Show only essential columns on mobile
      return columns.slice(0, 2);
    } else if (tablet) {
      // Show more columns on tablet
      return columns.slice(0, Math.ceil(columns.length * 0.7));
    }
    return columns;
  }, [columns, mobile, tablet]);

  const containerStyles: React.CSSProperties = {
    height,
    border: `1px solid ${theme.colors.neutral[200]}`,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colorMode === 'light' ? 'white' : theme.colors.neutral[800],
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    backgroundColor: theme.colorMode === 'light' ? theme.colors.neutral[50] : theme.colors.neutral[700],
    borderBottom: `1px solid ${theme.colors.neutral[200]}`,
    height: '48px',
    alignItems: 'center',
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.sm,
  };

  const scrollContainerStyles: React.CSSProperties = {
    height: height - 48,
    overflow: 'auto',
    position: 'relative',
  };

  const virtualContentStyles: React.CSSProperties = {
    height: totalHeight,
    position: 'relative',
  };

  const visibleContentStyles: React.CSSProperties = {
    transform: `translateY(${offsetY}px)`,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  };

  const getColumnWidth = (column: DataTableColumn<T>, index: number) => {
    if (column.width) return column.width;
    return `${100 / responsiveColumns.length}%`;
  };

  const getCellStyles = (column: DataTableColumn<T>): React.CSSProperties => ({
    padding: theme.spacing[3],
    textAlign: column.align || 'left',
    borderRight: `1px solid ${theme.colors.neutral[100]}`,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: getColumnWidth(column, 0),
    minWidth: column.minWidth || 100,
    maxWidth: column.maxWidth,
  });

  const getRowStyles = (index: number, isSelected: boolean): React.CSSProperties => ({
    display: 'flex',
    height: rowHeight,
    alignItems: 'center',
    backgroundColor: isSelected ? theme.colors.primary[50] :
                    index % 2 === 0 ? 'transparent' : theme.colors.neutral[25],
    borderBottom: `1px solid ${theme.colors.neutral[100]}`,
    cursor: onRowClick ? 'pointer' : 'default',
  });

  if (loading) {
    return (
      <div style={containerStyles} className={className}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%' 
        }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div style={containerStyles} className={className}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: theme.colors.neutral[500]
        }}>
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div 
      style={containerStyles} 
      className={className}
      role="table"
      aria-label={ariaLabel || 'Data table'}
      aria-rowcount={processedData.length}
      aria-colcount={responsiveColumns.length}
    >
      {/* Header */}
      <div style={headerStyles} role="row">
        {selectable && (
          <div style={{ ...getCellStyles({ key: 'select' } as DataTableColumn<T>), width: '48px' }}>
            <input
              type="checkbox"
              checked={internalSelectedRows.length === processedData.length && processedData.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              aria-label="Select all rows"
            />
          </div>
        )}
        {responsiveColumns.map((column, index) => (
          <div
            key={String(column.key)}
            style={getCellStyles(column)}
            role="columnheader"
            aria-sort={sortBy === column.key ? 
              (sortOrder === 'asc' ? 'ascending' : 'descending') : 
              'none'
            }
          >
            <button
              onClick={() => handleSort(column)}
              disabled={!column.sortable}
              style={{
                background: 'none',
                border: 'none',
                cursor: column.sortable ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[1],
                fontSize: 'inherit',
                fontWeight: 'inherit',
                color: 'inherit',
              }}
            >
              {column.headerRender ? column.headerRender() : column.label}
              {column.sortable && sortBy === column.key && (
                <span aria-hidden="true">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Scrollable Content */}
      <div style={scrollContainerStyles} onScroll={onScroll}>
        <div style={virtualContentStyles}>
          <div style={visibleContentStyles}>
            {visibleRows.map((row, virtualIndex) => {
              const actualIndex = startIndex + virtualIndex;
              const isSelected = internalSelectedRows.includes(row);
              
              return (
                <div
                  key={actualIndex}
                  style={getRowStyles(actualIndex, isSelected)}
                  role="row"
                  aria-rowindex={actualIndex + 1}
                  aria-selected={selectable ? isSelected : undefined}
                  onClick={() => onRowClick?.(row, actualIndex)}
                >
                  {selectable && (
                    <div style={{ ...getCellStyles({ key: 'select' } as DataTableColumn<T>), width: '48px' }} role="cell">
                      <input
                        type={multiSelect ? 'checkbox' : 'radio'}
                        checked={isSelected}
                        onChange={(e) => handleRowSelect(row, e.target.checked)}
                        aria-label={`Select row ${actualIndex + 1}`}
                      />
                    </div>
                  )}
                  {responsiveColumns.map((column, columnIndex) => (
                    <div
                      key={String(column.key)}
                      style={getCellStyles(column)}
                      role="cell"
                      aria-describedby={`col-${columnIndex}`}
                    >
                      {column.render 
                        ? column.render(row[column.key], row, actualIndex)
                        : String(row[column.key] || '')
                      }
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
