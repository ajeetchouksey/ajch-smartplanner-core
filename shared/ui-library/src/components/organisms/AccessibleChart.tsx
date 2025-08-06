import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import { useKeyboardNavigation, useLiveRegion } from '../../hooks/accessibility';
import { useResponsive } from '../../hooks/accessibility';
import { usePerformanceMonitor } from '../../hooks/performance/useVirtualScroll';

export interface ChartDataPoint {
  x: number | string | Date;
  y: number;
  label?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: 'line' | 'bar' | 'area';
  visible?: boolean;
}

export interface AccessibleChartProps {
  data: ChartSeries[];
  type?: 'line' | 'bar' | 'area' | 'mixed';
  width?: number;
  height?: number;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  interactive?: boolean;
  animationDuration?: number;
  className?: string;
  'aria-label'?: string;
  onDataPointClick?: (point: ChartDataPoint, series: ChartSeries) => void;
  onDataPointHover?: (point: ChartDataPoint | null, series: ChartSeries | null) => void;
}

interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  plotWidth: number;
  plotHeight: number;
}

export function AccessibleChart({
  data,
  type = 'line',
  width = 600,
  height = 400,
  title,
  xAxisLabel,
  yAxisLabel,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  interactive = true,
  animationDuration = 300,
  className = '',
  'aria-label': ariaLabel,
  onDataPointClick,
  onDataPointHover,
}: AccessibleChartProps) {
  const { theme } = useTheme();
  const { mobile, tablet } = useResponsive();
  const { announce } = useLiveRegion();
  const { markMilestone } = usePerformanceMonitor('AccessibleChart');
  
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    point: ChartDataPoint;
    series: ChartSeries;
    x: number;
    y: number;
  } | null>(null);
  const [focusedSeriesIndex, setFocusedSeriesIndex] = useState(0);
  const [focusedPointIndex, setFocusedPointIndex] = useState(0);

  // Responsive dimensions
  const dimensions = useMemo((): ChartDimensions => {
    const responsiveWidth = mobile ? Math.min(width, 350) : tablet ? Math.min(width, 500) : width;
    const responsiveHeight = mobile ? Math.min(height, 250) : tablet ? Math.min(height, 300) : height;
    
    const margin = {
      top: title ? 40 : 20,
      right: showLegend ? 120 : 20,
      bottom: xAxisLabel ? 60 : 40,
      left: yAxisLabel ? 80 : 60,
    };

    return {
      width: responsiveWidth,
      height: responsiveHeight,
      margin,
      plotWidth: responsiveWidth - margin.left - margin.right,
      plotHeight: responsiveHeight - margin.top - margin.bottom,
    };
  }, [width, height, title, xAxisLabel, yAxisLabel, showLegend, mobile, tablet]);

  // Data processing and scales
  const processedData = useMemo(() => {
    markMilestone('Data processing start');
    
    const visibleSeries = data.filter(series => series.visible !== false);
    
    // Calculate domain for x and y axes
    const allXValues: (number | string | Date)[] = [];
    const allYValues: number[] = [];
    
    visibleSeries.forEach(series => {
      series.data.forEach(point => {
        allXValues.push(point.x);
        allYValues.push(point.y);
      });
    });

    const xDomain = [
      Math.min(...allXValues.map(x => typeof x === 'number' ? x : 0)),
      Math.max(...allXValues.map(x => typeof x === 'number' ? x : 0))
    ];
    
    const yDomain = [
      Math.min(0, Math.min(...allYValues)),
      Math.max(...allYValues)
    ];

    // Create scale functions
    const xScale = (value: number | string | Date): number => {
      const numValue = typeof value === 'number' ? value : 0;
      return ((numValue - xDomain[0]) / (xDomain[1] - xDomain[0])) * dimensions.plotWidth;
    };

    const yScale = (value: number): number => {
      return dimensions.plotHeight - ((value - yDomain[0]) / (yDomain[1] - yDomain[0])) * dimensions.plotHeight;
    };

    markMilestone('Data processing end');
    
    return {
      visibleSeries,
      xDomain,
      yDomain,
      xScale,
      yScale,
    };
  }, [data, dimensions, markMilestone]);

  // Generate accessible data description
  const dataDescription = useMemo(() => {
    const seriesCount = processedData.visibleSeries.length;
    const totalPoints = processedData.visibleSeries.reduce((sum, series) => sum + series.data.length, 0);
    
    return `Chart contains ${seriesCount} data series with ${totalPoints} total data points. ` +
           `X-axis ranges from ${processedData.xDomain[0]} to ${processedData.xDomain[1]}. ` +
           `Y-axis ranges from ${processedData.yDomain[0]} to ${processedData.yDomain[1]}.`;
  }, [processedData]);

  // Keyboard navigation
  useKeyboardNavigation({
    onArrowKeys: (direction) => {
      const currentSeries = processedData.visibleSeries[focusedSeriesIndex];
      if (!currentSeries) return;

      switch (direction) {
        case 'up':
          setFocusedSeriesIndex(prev => 
            Math.max(0, prev - 1)
          );
          break;
        case 'down':
          setFocusedSeriesIndex(prev => 
            Math.min(processedData.visibleSeries.length - 1, prev + 1)
          );
          break;
        case 'left':
          setFocusedPointIndex(prev => 
            Math.max(0, prev - 1)
          );
          break;
        case 'right':
          setFocusedPointIndex(prev => 
            Math.min(currentSeries.data.length - 1, prev + 1)
          );
          break;
      }
    },
    onEnter: () => {
      const currentSeries = processedData.visibleSeries[focusedSeriesIndex];
      const currentPoint = currentSeries?.data[focusedPointIndex];
      
      if (currentPoint && currentSeries) {
        onDataPointClick?.(currentPoint, currentSeries);
        announce(
          `Selected data point: ${currentSeries.name}, X: ${currentPoint.x}, Y: ${currentPoint.y}`,
          'assertive'
        );
      }
    },
  });

  // Mouse interaction handlers
  const handleMouseMove = useCallback((event: React.MouseEvent<SVGElement>) => {
    if (!interactive || !showTooltip) return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = event.clientX - rect.left - dimensions.margin.left;
    const mouseY = event.clientY - rect.top - dimensions.margin.top;

    // Find closest data point
    let closestPoint: { point: ChartDataPoint; series: ChartSeries; distance: number } | null = null;

    processedData.visibleSeries.forEach(series => {
      series.data.forEach(point => {
        const x = processedData.xScale(point.x);
        const y = processedData.yScale(point.y);
        const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));

        if (!closestPoint || distance < closestPoint.distance) {
          closestPoint = { point, series, distance };
        }
      });
    });

    if (closestPoint && closestPoint.distance < 20) {
      const x = processedData.xScale(closestPoint.point.x) + dimensions.margin.left;
      const y = processedData.yScale(closestPoint.point.y) + dimensions.margin.top;
      
      setHoveredPoint({
        point: closestPoint.point,
        series: closestPoint.series,
        x,
        y,
      });
      onDataPointHover?.(closestPoint.point, closestPoint.series);
    } else {
      setHoveredPoint(null);
      onDataPointHover?.(null, null);
    }
  }, [interactive, showTooltip, dimensions, processedData, onDataPointHover]);

  const handleMouseLeave = useCallback(() => {
    setHoveredPoint(null);
    onDataPointHover?.(null, null);
  }, [onDataPointHover]);

  // Generate SVG path for line charts
  const generateLinePath = (series: ChartSeries): string => {
    return series.data
      .map((point, index) => {
        const x = processedData.xScale(point.x);
        const y = processedData.yScale(point.y);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  // Generate grid lines
  const gridLines = useMemo(() => {
    if (!showGrid) return null;

    const lines: React.ReactElement[] = [];

    // Vertical grid lines
    for (let i = 0; i <= 5; i++) {
      const x = (i / 5) * dimensions.plotWidth;
      lines.push(
        <line
          key={`vertical-${i}`}
          x1={x}
          y1={0}
          x2={x}
          y2={dimensions.plotHeight}
          stroke={theme.colors.neutral[200]}
          strokeWidth={1}
          opacity={0.5}
        />
      );
    }

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = (i / 5) * dimensions.plotHeight;
      lines.push(
        <line
          key={`horizontal-${i}`}
          x1={0}
          y1={y}
          x2={dimensions.plotWidth}
          y2={y}
          stroke={theme.colors.neutral[200]}
          strokeWidth={1}
          opacity={0.5}
        />
      );
    }

    return lines;
  }, [showGrid, dimensions, theme]);

  // Chart content based on type
  const chartContent = useMemo(() => {
    return processedData.visibleSeries.map((series, seriesIndex) => {
      const seriesColor = series.color || theme.colors.primary[500];
      const seriesType = series.type || type;

      switch (seriesType) {
        case 'line':
          return (
            <g key={series.name}>
              <path
                d={generateLinePath(series)}
                stroke={seriesColor}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {series.data.map((point, pointIndex) => (
                <circle
                  key={`${series.name}-${pointIndex}`}
                  cx={processedData.xScale(point.x)}
                  cy={processedData.yScale(point.y)}
                  r={4}
                  fill={point.color || seriesColor}
                  stroke="white"
                  strokeWidth={2}
                  style={{ cursor: interactive ? 'pointer' : 'default' }}
                  onClick={() => onDataPointClick?.(point, series)}
                  role="button"
                  tabIndex={focusedSeriesIndex === seriesIndex && focusedPointIndex === pointIndex ? 0 : -1}
                  aria-label={`Data point: ${point.label || `${point.x}, ${point.y}`}`}
                />
              ))}
            </g>
          );

        case 'bar':
          const barWidth = Math.max(10, dimensions.plotWidth / series.data.length * 0.8);
          return (
            <g key={series.name}>
              {series.data.map((point, pointIndex) => {
                const x = processedData.xScale(point.x) - barWidth / 2;
                const y = processedData.yScale(point.y);
                const height = dimensions.plotHeight - y;
                
                return (
                  <rect
                    key={`${series.name}-${pointIndex}`}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={height}
                    fill={point.color || seriesColor}
                    style={{ cursor: interactive ? 'pointer' : 'default' }}
                    onClick={() => onDataPointClick?.(point, series)}
                    role="button"
                    tabIndex={focusedSeriesIndex === seriesIndex && focusedPointIndex === pointIndex ? 0 : -1}
                    aria-label={`Bar: ${point.label || `${point.x}, ${point.y}`}`}
                  />
                );
              })}
            </g>
          );

        case 'area':
          const areaPath = generateLinePath(series) + 
            ` L ${processedData.xScale(series.data[series.data.length - 1].x)} ${dimensions.plotHeight}` +
            ` L ${processedData.xScale(series.data[0].x)} ${dimensions.plotHeight} Z`;
          
          return (
            <g key={series.name}>
              <path
                d={areaPath}
                fill={seriesColor}
                fillOpacity={0.3}
                stroke={seriesColor}
                strokeWidth={2}
              />
              {series.data.map((point, pointIndex) => (
                <circle
                  key={`${series.name}-${pointIndex}`}
                  cx={processedData.xScale(point.x)}
                  cy={processedData.yScale(point.y)}
                  r={3}
                  fill={point.color || seriesColor}
                  stroke="white"
                  strokeWidth={1}
                  style={{ cursor: interactive ? 'pointer' : 'default' }}
                  onClick={() => onDataPointClick?.(point, series)}
                  role="button"
                  tabIndex={focusedSeriesIndex === seriesIndex && focusedPointIndex === pointIndex ? 0 : -1}
                  aria-label={`Area point: ${point.label || `${point.x}, ${point.y}`}`}
                />
              ))}
            </g>
          );

        default:
          return null;
      }
    });
  }, [processedData, type, theme, dimensions, interactive, onDataPointClick, focusedSeriesIndex, focusedPointIndex]);

  return (
    <div className={className}>
      {/* Screen reader description */}
      <div className="sr-only" aria-live="polite">
        {dataDescription}
      </div>

      {/* Chart title */}
      {title && (
        <h2 style={{
          margin: 0,
          marginBottom: theme.spacing[2],
          fontSize: theme.typography.sizes.lg,
          fontWeight: theme.typography.weights.semibold,
          textAlign: 'center',
        }}>
          {title}
        </h2>
      )}

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          role="img"
          aria-label={ariaLabel || title || 'Interactive chart'}
          aria-describedby="chart-description"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            border: `1px solid ${theme.colors.neutral[200]}`,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colorMode === 'light' ? 'white' : theme.colors.neutral[800],
          }}
        >
          {/* Plot area */}
          <g transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}>
            {/* Grid */}
            {gridLines}
            
            {/* Chart content */}
            {chartContent}
            
            {/* Axes */}
            <g>
              {/* X-axis */}
              <line
                x1={0}
                y1={dimensions.plotHeight}
                x2={dimensions.plotWidth}
                y2={dimensions.plotHeight}
                stroke={theme.colors.neutral[400]}
                strokeWidth={1}
              />
              
              {/* Y-axis */}
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={dimensions.plotHeight}
                stroke={theme.colors.neutral[400]}
                strokeWidth={1}
              />
            </g>
          </g>

          {/* Axis labels */}
          {xAxisLabel && (
            <text
              x={dimensions.width / 2}
              y={dimensions.height - 10}
              textAnchor="middle"
              fontSize={theme.typography.sizes.sm}
              fill={theme.colors.neutral[600]}
            >
              {xAxisLabel}
            </text>
          )}
          
          {yAxisLabel && (
            <text
              x={15}
              y={dimensions.height / 2}
              textAnchor="middle"
              fontSize={theme.typography.sizes.sm}
              fill={theme.colors.neutral[600]}
              transform={`rotate(-90, 15, ${dimensions.height / 2})`}
            >
              {yAxisLabel}
            </text>
          )}
        </svg>

        {/* Tooltip */}
        {showTooltip && hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              left: hoveredPoint.x + 10,
              top: hoveredPoint.y - 10,
              backgroundColor: theme.colorMode === 'light' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              color: theme.colorMode === 'light' ? 'white' : 'black',
              padding: theme.spacing[2],
              borderRadius: theme.borderRadius.sm,
              fontSize: theme.typography.sizes.sm,
              pointerEvents: 'none',
              zIndex: 1000,
              boxShadow: theme.shadows.md,
            }}
            role="tooltip"
            aria-live="polite"
          >
            <div style={{ fontWeight: theme.typography.weights.semibold }}>
              {hoveredPoint.series.name}
            </div>
            <div>X: {String(hoveredPoint.point.x)}</div>
            <div>Y: {hoveredPoint.point.y}</div>
            {hoveredPoint.point.label && (
              <div>{hoveredPoint.point.label}</div>
            )}
          </div>
        )}

        {/* Legend */}
        {showLegend && (
          <div
            style={{
              position: 'absolute',
              right: -100,
              top: 20,
              width: 80,
              fontSize: theme.typography.sizes.sm,
            }}
          >
            {processedData.visibleSeries.map((series, index) => (
              <div
                key={series.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: theme.spacing[1],
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: series.color || theme.colors.primary[500],
                    marginRight: theme.spacing[1],
                    borderRadius: type === 'line' ? '50%' : '2px',
                  }}
                />
                <span style={{ fontSize: theme.typography.sizes.xs }}>
                  {series.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden description for screen readers */}
      <div id="chart-description" className="sr-only">
        {dataDescription}
        Use arrow keys to navigate between data points. Press Enter to select a data point.
      </div>
    </div>
  );
}
