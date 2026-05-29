import React from "react";
import { Menu } from "lucide-react";

export function Navbar({ onOpenSidebar }) {
  return (
    <header className="md:hidden sticky top-0 z-30 glass-panel border-x-0 border-t-0 px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="text-[var(--text-primary)] focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[var(--accent-primary)] flex items-center justify-center font-display text-[var(--bg-primary)] text-sm font-bold">
            TF
          </div>
          <span className="font-display text-xl tracking-wide">
            trakFly
          </span>
        </div>
      </div>
    </header>
  );
}
