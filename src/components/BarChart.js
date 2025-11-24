import React, { useState } from 'react';

// Simple responsive SVG Bar chart
// props:
// - labels: array of labels
// - values: array of numbers (same length)
// - colors: optional array of colors
// - height: px
export default function BarChart({ labels = ['A','B','C'], values = [10,20,5], colors = [], height = 220 }){
  const max = Math.max(...values, 1);
  const [hover, setHover] = useState(null);

  const padLeft = 40;
  const padBottom = 30;
  const innerWidth = 600; // viewBox width
  const innerHeight = height - padBottom;
  const bw = (innerWidth - padLeft) / values.length * 0.7;
  const gap = ((innerWidth - padLeft) / values.length) * 0.3;

  return (
    <div className="w-full h-full">
      <svg viewBox={`0 0 ${innerWidth} ${height}`} className="w-full h-full">
        <g transform={`translate(0,0)`}>
          {/* y axis lines */}
          {[0,0.25,0.5,0.75,1].map((t,i)=>{
            const y = (innerHeight - (innerHeight * t)) + 10;
            return (<line key={i} x1={padLeft} x2={innerWidth-10} y1={y} y2={y} stroke="#e6edf3" strokeWidth={1} />);
          })}

          {/* bars */}
          {values.map((v,i)=>{
            const x = padLeft + i * (bw + gap) + gap/2;
            const h = (v / max) * (innerHeight - 10);
            const y = innerHeight - h + 10;
            const color = colors[i] || `hsl(${i*50 % 360} 70% 50%)`;
            return (
              <g key={i}>
                <rect x={x} y={y} width={bw} height={h} rx={4} fill={color} opacity={hover==null || hover===i ? 1 : 0.35}
                  onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{cursor:'pointer', transition: 'opacity 140ms'}} />
                <text x={x + bw/2} y={innerHeight + 24} textAnchor="middle" fontSize={11} fill="#374151">{labels[i]}</text>
                {hover===i && (
                  <g>
                    <rect x={x + bw/2 - 28} y={y - 28} width={56} height={20} rx={6} fill="#111827" opacity={0.9} />
                    <text x={x + bw/2} y={y - 14} textAnchor="middle" fontSize={12} fill="#fff">{v}</text>
                  </g>
                )}
              </g>
            );
          })}

          {/* y labels (0 and max) */}
          <text x={8} y={innerHeight + 8} fontSize={11} fill="#6b7280">0</text>
          <text x={8} y={14} fontSize={11} fill="#6b7280">{max}</text>
        </g>
      </svg>
    </div>
  );
}
