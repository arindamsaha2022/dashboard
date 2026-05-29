import React from "react";

export function StatCard({ title, value, icon: Icon, trend, colorClass }) {
  return (
    <div
      className={`glass-panel p-6 rounded-xl flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 shadow-lg border-t-2 ${colorClass}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[var(--text-secondary)] font-body text-sm font-medium">
          {title}
        </h3>
        <div className={`p-2 rounded-lg bg-[var(--bg-primary)]`}>
          <Icon size={20} className="text-current opacity-80" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-display tracking-wide">{value}</div>
        {trend && (
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-body">
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
