import React, { useState } from 'react';

// Simple SVG Donut chart without external deps
// props:
// - data: array of numbers
// - labels: array of labels (same length)
// - colors: array of colors (same length) optional
// - size: px (default 160)
// - thickness: ring thickness (default 28)
export default function DonutChart({ data = [60,40], labels = ['A','B'], colors = ['#7c3aed', '#06b6d4'], size = 160, thickness = 28, responsive = true }) {
  const total = data.reduce((s, v) => s + v, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
    let offset = 0;
    const [hovered, setHovered] = useState(null);

  const svgProps = responsive
    ? { width: '100%', height: '100%', preserveAspectRatio: 'xMidYMid meet' }
    : { width: size, height: size };

  return (
    <div className="flex items-center w-full h-full">
      <svg {...svgProps} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size/2}, ${size/2})`}>
          {data.map((value, i) => {
            const portion = value / total;
            const dash = `${portion * circumference} ${circumference}`;
            const rotation = (offset / circumference) * 360;
            offset += portion * circumference;
              const isHovered = hovered === i;
              const strokeW = isHovered ? thickness + 8 : thickness;
              const opacity = hovered == null ? 1 : isHovered ? 1 : 0.35;
              return (
              <circle
                key={i}
                r={radius}
                cx={0}
                cy={0}
                fill="transparent"
                stroke={colors[i] || `hsl(${i * 60}, 70%, 50%)`}
                  strokeWidth={strokeW}
                  strokeOpacity={opacity}
                strokeDasharray={dash}
                strokeDashoffset={-circumference * 0}
                strokeLinecap="round"
                transform={`rotate(${-90 + rotation})`}
                  style={{ transition: 'stroke-width 140ms, opacity 140ms, transform 140ms', cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
              />
            );
          })}
          {/* center text */}
          <text x="0" y="4" textAnchor="middle" fontSize="18" fontWeight="700" fill="currentColor">
            {hovered != null ? data[hovered] : `${Math.round((data[0]/total)*100)}%`}
          </text>
          <text x="0" y="22" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.8">
            {hovered != null ? labels[hovered] : labels[0]}
          </text>
        </g>
      </svg>
      {/* Legend removed per request — only the chart remains. */}
    </div>
  );
}
