import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  MessageSquare,
  ChevronDown,
  Settings,
  LogOut,
  User,
  X,
  Globe,
  Lock,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { NotificationCenter, useNotifications } from "./NotificationCenter";
import LanguageSwitcher from "./LanguageSwitcher";
import BranchSwitcher from "../BranchSwitcher";
import { useLanguage } from "@/hooks/useLanguage";
import Link from 'next/link';
import { useMerchantRegion } from "@/hooks/useMerchantRegion";
import { getAllCountries } from "@/data/regionModules";

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Header = ({ sidebarOpen, onToggleSidebar }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { country, region, setCountry, isOnboarded, code } = useMerchantRegion();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");
  const notifications = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  const regionRef = useRef<HTMLDivElement>(null);
  const allCountries = getAllCountries();
  const filteredCountries = regionSearch
    ? allCountries.filter(c => c.name.toLowerCase().includes(regionSearch.toLowerCase()) || c.code.toLowerCase().includes(regionSearch.toLowerCase()))
    : allCountries;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false);
        setRegionSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-card/95 backdrop-blur-md px-4 py-2.5 sm:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className={`hidden sm:flex items-center gap-2 rounded-xl border bg-background px-3.5 py-2 transition-all duration-200 ${searchFocused ? 'border-primary/50 ring-2 ring-primary/10 shadow-sm' : 'border-border'}`}>
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("header.search")}
            className="w-48 bg-transparent text-sm outline-none placeholder:text-muted-foreground lg:w-72"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Region Switcher */}
        <div className="relative" ref={regionRef}>
          <button
            onClick={() => { if (!isOnboarded) setRegionOpen(!regionOpen); setProfileOpen(false); setNotifOpen(false); }}
            disabled={isOnboarded}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm text-muted-foreground transition-all duration-200 ${isOnboarded ? 'opacity-80 cursor-not-allowed' : 'hover:bg-accent hover:text-foreground hover:shadow-sm'}`}
          >
            {isOnboarded ? <Lock className="h-3.5 w-3.5 text-primary/60" /> : <Globe className="h-4 w-4" />}
            <span className="hidden sm:inline text-xs font-medium">
              {region ? `${region.flag} ${region.name.split("(")[0].trim()} (${code})` : "🌍 Region"}
            </span>
            {!isOnboarded && <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${regionOpen ? "rotate-180" : ""}`} />}
          </button>

          {regionOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border/60 bg-card shadow-xl shadow-black/5 animate-fade-in z-50">
              <div className="p-2 border-b border-border/60">
                <input
                  type="text"
                  placeholder="Search country..."
                  value={regionSearch}
                  onChange={(e) => setRegionSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  autoFocus
                />
              </div>
              <div className="max-h-56 overflow-y-auto p-1">
                {filteredCountries.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => { setCountry(c.name); setRegionOpen(false); setRegionSearch(""); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors hover:bg-accent ${country === c.name ? "bg-primary/10 text-primary font-medium" : "text-card-foreground"}`}
                  >
                    <span>{c.flag}</span>
                    <span className="flex-1 text-left">{c.name} ({c.code})</span>
                    {country === c.name && <span className="ml-auto text-primary">✓</span>}
                  </button>
                ))}
                {filteredCountries.length === 0 && (
                  <p className="px-3 py-2 text-xs text-muted-foreground">No countries found</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Branch Switcher */}
        <div className="hidden lg:block mr-2">
          <BranchSwitcher />
        </div>

        {/* Language switcher */}
        <LanguageSwitcher />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground hover:shadow-sm"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative rounded-xl p-2.5 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground hover:shadow-sm"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* Messages */}
        <button className="relative rounded-xl p-2.5 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground hover:shadow-sm">
          <MessageSquare className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </button>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-border/60 mx-1 sm:block" />

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 rounded-xl p-1.5 transition-all duration-200 hover:bg-accent"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/10">
              <User className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-card-foreground leading-tight">Musharof</p>
              <p className="text-[11px] text-muted-foreground">Admin</p>
            </div>
            <ChevronDown className={`hidden h-4 w-4 text-muted-foreground sm:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border/60 bg-card p-1.5 shadow-xl shadow-black/5 animate-fade-in">
              <Link href="/profile" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-card-foreground transition-colors hover:bg-accent">
                <User className="h-4 w-4 text-muted-foreground" /> {t("header.myProfile")}
              </Link>
              <Link href="/settings" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-card-foreground transition-colors hover:bg-accent">
                <Settings className="h-4 w-4 text-muted-foreground" /> {t("header.settings")}
              </Link>
              <div className="my-1 h-px bg-border/60" />
              <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10">
                <LogOut className="h-4 w-4" /> {t("header.logOut")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
