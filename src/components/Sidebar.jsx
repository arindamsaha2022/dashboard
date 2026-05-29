import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart2,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "../utils/cn";

export function Sidebar({ theme, toggleTheme }) {
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard, active: true },
    { name: "Orders", path: "/orders", icon: Package, active: true },
    { name: "Customers", path: "/customers", icon: Users, active: false },
    { name: "Reports", path: "/reports", icon: BarChart2, active: false },
    { name: "Settings", path: "/settings", icon: Settings, active: false },
  ];

  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-full w-[240px] z-50 glass-panel border-l-0 border-t-0 border-b-0 flex-col">
      <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[var(--accent-primary)] flex items-center justify-center font-display text-[var(--bg-primary)] text-xl font-bold">
            TF
          </div>
          <span className="font-display text-2xl tracking-wide">
            trakFly
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => {
          if (!item.active) {
            return (
              <div
                key={item.name}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] opacity-50 cursor-not-allowed font-body"
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </div>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-body transition-colors duration-200",
                  isActive
                    ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] font-semibold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                )
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6 border-t border-[var(--border-color)]">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 font-body"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </aside>
  );
}
