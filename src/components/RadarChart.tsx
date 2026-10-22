import React from 'react';

interface RadarDataPoint {
  label: string;
  value: number; // 0 - 100
  fullMark?: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  color?: string;
  fillOpacity?: number;
  showLabels?: boolean;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 320,
  color = '#4f46e5',
  fillOpacity = 0.25,
  showLabels = true,
}) => {
  const center = size / 2;
  const radius = (size / 2) * 0.72;
  const totalAxes = data.length;
  if (totalAxes < 3) return null;

  const angleSlice = (Math.PI * 2) / totalAxes;

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Calculate polygon coordinates for a given radius ratio
  const getCoordinates = (index: number, ratio: number) => {
    const angle = angleSlice * index - Math.PI / 2;
    const x = center + radius * ratio * Math.cos(angle);
    const y = center + radius * ratio * Math.sin(angle);
    return { x, y };
  };

  // Generate data polygon points
  const pointsString = data
    .map((d, i) => {
      const ratio = Math.max(0.05, Math.min(1, d.value / (d.fullMark || 100)));
      const { x, y } = getCoordinates(i, ratio);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background circular web / grid */}
        {levels.map((lvl, idx) => (
          <polygon
            key={`grid-${idx}`}
            points={data
              .map((_, i) => {
                const { x, y } = getCoordinates(i, lvl);
                return `${x},${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray={idx === levels.length - 1 ? 'none' : '3 3'}
          />
        ))}

        {/* Axis lines */}
        {data.map((_, i) => {
          const { x, y } = getCoordinates(i, 1.0);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          );
        })}

        {/* Active data polygon */}
        <polygon
          points={pointsString}
          fill={color}
          fillOpacity={fillOpacity}
          stroke={color}
          strokeWidth="2.5"
          className="transition-all duration-500 ease-out"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const ratio = Math.max(0.05, Math.min(1, d.value / (d.fullMark || 100)));
          const { x, y } = getCoordinates(i, ratio);
          return (
            <g key={`point-${i}`} className="group">
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill="#ffffff"
                stroke={color}
                strokeWidth="2.5"
                className="transition-transform group-hover:scale-150 duration-200"
              />
            </g>
          );
        })}

        {/* Labels */}
        {showLabels &&
          data.map((d, i) => {
            const { x, y } = getCoordinates(i, 1.2);
            const anchor =
              Math.abs(x - center) < 10
                ? 'middle'
                : x > center
                ? 'start'
                : 'end';

            return (
              <text
                key={`label-${i}`}
                x={x}
                y={y}
                textAnchor={anchor}
                dominantBaseline="central"
                className="text-[11px] font-semibold fill-slate-700 tracking-tight"
              >
                {d.label} ({d.value}%)
              </text>
            );
          })}
      </svg>
    </div>
  );
};
