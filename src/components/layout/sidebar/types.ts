/**
 * ============================================================================
 * Sidebar Types — Shared TypeScript Interfaces
 * ============================================================================
 *
 * All sidebar components (NavItem, SectionHeader, vertical sidebars, etc.)
 * import their types from this single file.
 *
 * ============================================================================
 */

export interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to?: string;
  children?: { label: string; to: string }[];
  currentPath: string;
  isAddon?: boolean;
  onAddonClick?: (moduleId: string) => void;
  moduleId?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Props passed to every vertical sidebar component.
 * Each vertical (EcommerceSidebar, RestaurantSidebar, etc.) receives these.
 *
 * Backend note: These props are derived from useMerchantRegion() hook.
 * When backend is added, the hook will fetch from API instead of localStorage.
 */
export interface VerticalSidebarProps {
  currentPath: string;
  isRouteVisible: (route: string) => boolean;
  isRouteAddon: (route: string) => boolean;
  setUpgradeModule: (moduleId: string) => void;
  t: (key: string) => string;
  isModuleAvailable: (moduleId: string) => boolean;
}
