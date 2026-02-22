"use client";

/**
 * NavItem â€” Shared navigation item component for all sidebar sections.
 * Supports: simple links, expandable sub-menus, and addon-locked items.
 */
import { useState } from "react";
import Link from 'next/link';
import { ChevronDown, Lock } from "lucide-react";
import type { NavItemProps } from "./types";

export const NavItem = ({ icon, label, to, children, currentPath, isAddon, onAddonClick, moduleId }: NavItemProps) => {
  const matchPath = (target: string) => {
    const targetUrl = new URL(target, "http://x");
    const curUrl = new URL(currentPath, "http://x");
    if (curUrl.pathname !== targetUrl.pathname) return false;
    const targetTab = targetUrl.searchParams.get("tab");
    const curTab = curUrl.searchParams.get("tab");
    if (!targetTab) return !curTab;
    return curTab === targetTab;
  };
  const isActive = to ? matchPath(to) : children?.some((c) => matchPath(c.to));
  const [expanded, setExpanded] = useState(
    children?.some((c) => currentPath.startsWith(c.to.split("?")[0])) || isActive || false
  );

  if (children) {
    return (
      <li>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            }`}
        >
          <span className={`transition-colors ${isActive ? "text-sidebar-primary" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"}`}>{icon}</span>
          <span className="flex-1 text-start">{label}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-200 ${expanded ? "max-h-96 mt-1" : "max-h-0"}`}>
          <ul className="space-y-0.5 ps-11">
            {children.map((child) => (
              <li key={child.to}>
                <Link
                  href={child.to}
                  className={`block rounded-lg px-3 py-2 text-sm transition-all duration-150 ${matchPath(child.to)
                    ? "text-sidebar-primary font-semibold"
                    : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                    }`}
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  }

  if (isAddon) {
    return (
      <li>
        <button
          onClick={() => moduleId && onAddonClick?.(moduleId)}
          className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 text-sidebar-foreground/50 hover:bg-amber-500/10 hover:text-amber-400"
        >
          <span className="text-sidebar-foreground/40 group-hover:text-amber-400 transition-colors">{icon}</span>
          <span className="flex-1 text-start">{label}</span>
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-amber-500/70" />
            <span className="text-[9px] font-semibold text-amber-500/70 uppercase tracking-wide">Pro</span>
          </span>
        </button>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={to || "/"}
        className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
          ? "bg-sidebar-primary/10 text-sidebar-primary shadow-sm shadow-sidebar-primary/5"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          }`}
      >
        <span className={`transition-colors ${isActive ? "text-sidebar-primary" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"}`}>{icon}</span>
        <span>{label}</span>
        {isActive && <span className="ms-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}
      </Link>
    </li>
  );
};
