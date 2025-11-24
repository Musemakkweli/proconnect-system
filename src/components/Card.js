import React from 'react';

export default function Card({ children, className = '', height = 'min-h-[60vh]' }){
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow p-6 ${height} ${className}`}>
      {children}
    </div>
  );
}
