import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Sun, Moon } from "lucide-react";
import { cn } from "../utils/cn";

export function BottomNav({ theme, toggleTheme }) {
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Orders", path: "/orders", icon: Package },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-[var(--border-color)] border-x-0 border-b-0 flex justify-around items-center px-4 py-2 z-50 rounded-none pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 p-1 rounded-lg font-body transition-colors duration-200",
              isActive
                ? "text-[var(--accent-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )
          }
        >
          <item.icon size={20} />
          <span className="text-[9px] uppercase font-bold tracking-wider">
            {item.name}
          </span>
        </NavLink>
      ))}

      <button
        onClick={toggleTheme}
        className="flex flex-col items-center gap-1 p-1 rounded-lg font-body text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        <span className="text-[9px] uppercase font-bold tracking-wider">
          {theme === "dark" ? "Light" : "Dark"}
        </span>
      </button>
    </div>
  );
}
