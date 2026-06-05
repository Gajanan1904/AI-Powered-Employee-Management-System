import React, { useState } from 'react';
import './Charts.css';

// ==========================================
// 1. LINE CHART COMPONENT (Custom SVG)
// ==========================================
export const LineChart = ({ data = [], labels = [], height = 200 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (data.length === 0) return <div className="chart-fallback">No data provided</div>;

  const maxVal = Math.max(...data, 100);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal;

  const padding = 30;
  const chartWidth = 500;
  const chartHeight = height;

  const getCoordinates = () => {
    const coords = [];
    const stepX = (chartWidth - padding * 2) / (data.length - 1 || 1);
    
    data.forEach((val, i) => {
      const x = padding + i * stepX;
      // Invert Y because SVG coordinates start from top-left (0,0)
      const y = chartHeight - padding - ((val - minVal) / range) * (chartHeight - padding * 2);
      coords.push({ x, y, value: val });
    });
    return coords;
  };

  const points = getCoordinates();
  
  // Construct SVG path string for the line
  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Construct SVG path string for the filled area under the line
  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : '';

  return (
    <div className="svg-chart-container">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="svg-chart-element">
        {/* Gradients */}
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + ratio * (chartHeight - padding * 2);
          const gridVal = Math.round(maxVal - ratio * range);
          return (
            <g key={i} className="chart-grid-line">
              <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="var(--border-color)" strokeWidth="0.8" strokeDasharray="3 3" />
              <text x={padding - 5} y={y + 4} textAnchor="end" className="chart-axis-text">{gridVal}</text>
            </g>
          );
        })}

        {/* Area under line */}
        {areaD && <path d={areaD} fill="url(#areaGrad)" />}

        {/* The line itself */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="chart-line-path"
          />
        )}

        {/* Markers / Dots */}
        {points.map((p, i) => (
          <g key={i} className="chart-dot-group">
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? 6 : 4.5}
              fill="var(--bg-card)"
              stroke="var(--color-primary)"
              strokeWidth={hoveredIndex === i ? 3 : 2}
              style={{ transition: 'all var(--transition-fast)' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {/* Tooltip Popup inside SVG */}
            {hoveredIndex === i && (
              <g className="chart-tooltip-group">
                <rect x={p.x - 25} y={p.y - 32} width="50" height="20" rx="4" fill="var(--bg-sidebar)" />
                <text x={p.x} y={p.y - 18} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                  {p.value}%
                </text>
              </g>
            )}
          </g>
        ))}

        {/* X Axis Labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={chartHeight - 10}
            textAnchor="middle"
            className="chart-axis-text"
          >
            {labels[i]}
          </text>
        ))}
      </svg>
    </div>
  );
};


// ==========================================
// 2. BAR CHART COMPONENT (Custom SVG)
// ==========================================
export const BarChart = ({ data = [], labels = [], height = 200 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (data.length === 0) return <div className="chart-fallback">No data provided</div>;

  const maxVal = Math.max(...data, 10);
  const padding = 30;
  const chartWidth = 500;
  const chartHeight = height;

  const chartAreaWidth = chartWidth - padding * 2;
  const chartAreaHeight = chartHeight - padding * 2;
  const barWidth = (chartAreaWidth / data.length) * 0.55;
  const barGap = (chartAreaWidth / data.length) * 0.45;

  return (
    <div className="svg-chart-container">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="svg-chart-element">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + ratio * chartAreaHeight;
          const gridVal = Math.round(maxVal - ratio * maxVal);
          return (
            <g key={i} className="chart-grid-line">
              <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="var(--border-color)" strokeWidth="0.8" />
              <text x={padding - 5} y={y + 4} textAnchor="end" className="chart-axis-text">{gridVal}</text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((val, i) => {
          const barHeight = (val / maxVal) * chartAreaHeight;
          const x = padding + i * (barWidth + barGap) + barGap / 2;
          const y = chartHeight - padding - barHeight;

          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Sleek rounded bar using SVG rect */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 4)}
                rx="6"
                fill={hoveredIndex === i ? 'var(--color-primary)' : 'var(--color-secondary)'}
                className="chart-bar-rect"
                style={{
                  transition: 'fill var(--transition-fast), filter var(--transition-fast)',
                  filter: hoveredIndex === i ? 'drop-shadow(0px 4px 8px var(--color-primary-glow))' : 'none'
                }}
              />

              {/* Inline values showing on hover */}
              {hoveredIndex === i && (
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className="chart-bar-value"
                  fill="var(--text-primary)"
                  fontWeight="700"
                  fontSize="11"
                >
                  {val}
                </text>
              )}

              {/* X Axis Label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight - 8}
                textAnchor="middle"
                className="chart-axis-text"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};


// ==========================================
// 3. DONUT CHART COMPONENT (Custom SVG)
// ==========================================
export const DonutChart = ({ percentage = 75, label = 'Present', color = 'var(--color-success)', size = 120 }) => {
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="donut-chart-wrapper" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Track circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={strokeWidth}
        />
        {/* Percentage circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          className="donut-percentage-ring"
        />
        {/* Inner text labels */}
        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="donut-text-val" fill="var(--text-primary)">
          {percentage}%
        </text>
        <text x="50" y="68" textAnchor="middle" dominantBaseline="middle" className="donut-text-lbl" fill="var(--text-muted)">
          {label}
        </text>
      </svg>
    </div>
  );
};
