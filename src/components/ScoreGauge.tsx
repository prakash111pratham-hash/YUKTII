import React from 'react';

interface ScoreGaugeProps {
  score: number; // 0 - 100
  size?: number;
  label?: string;
  sublabel?: string;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'orange';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 140,
  label = 'Readiness',
  sublabel,
  colorScheme = 'orange',
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorMap = {
    orange: {
      stroke: 'stroke-orange-500',
      text: 'text-orange-400',
      bgStroke: 'stroke-orange-950/40',
    },
    indigo: {
      stroke: 'stroke-indigo-600',
      text: 'text-indigo-600',
      bgStroke: 'stroke-indigo-100',
    },
    emerald: {
      stroke: 'stroke-emerald-500',
      text: 'text-emerald-400',
      bgStroke: 'stroke-emerald-950/40',
    },
    amber: {
      stroke: 'stroke-amber-500',
      text: 'text-amber-600',
      bgStroke: 'stroke-amber-100',
    },
    rose: {
      stroke: 'stroke-rose-600',
      text: 'text-rose-600',
      bgStroke: 'stroke-rose-100',
    },
  };

  const scheme = colorMap[colorScheme];

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`${scheme.bgStroke} fill-none`}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`${scheme.stroke} fill-none transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`text-2xl font-bold tracking-tight ${scheme.text}`}>
          {score}%
        </span>
        {label && <span className="text-[11px] font-medium text-slate-500">{label}</span>}
      </div>
      {sublabel && (
        <span className="mt-2 text-xs font-semibold text-slate-600">{sublabel}</span>
      )}
    </div>
  );
};
