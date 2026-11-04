"use client";

import { Menu } from "lucide-react";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-paper/90 px-4 backdrop-blur lg:hidden">
      <button
        onClick={onMenu}
        className="rounded-md p-2 text-ink hover:bg-white"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
      <span className="font-semibold">Doctor Tracker</span>
    </header>
  );
}