/**
 * DynamicVerticalSidebar — Automatically generates sidebar sections for any vertical.
 */
"use client";

import { useMemo } from "react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";
import { getPurposeModulesByCategory } from "@/data/businessPurposeModules";
import { type BusinessPurpose } from "@/types/businessPurpose";

interface DynamicVerticalSidebarProps extends VerticalSidebarProps {
    purpose: BusinessPurpose;
}

export const DynamicVerticalSidebar = ({
    purpose,
    currentPath,
    isRouteVisible,
    isRouteAddon,
    setUpgradeModule,
    t
}: DynamicVerticalSidebarProps) => {
    const categories = useMemo(() => getPurposeModulesByCategory(purpose), [purpose]);

    return (
        <>
            {Object.entries(categories).map(([category, modules]) => (
                <div key={category} className="animate-fade-in">
                    <SectionHeader label={category} />
                    <ul className="space-y-1">
                        {modules.map((mod) => (
                            <NavItem
                                key={mod.id}
                                icon={<span className="h-5 w-5 flex items-center justify-center text-lg leading-none">{mod.icon}</span>}
                                label={mod.name}
                                to={`/${mod.id}`}
                                currentPath={currentPath}
                                children={mod.features.map(f => ({
                                    label: f,
                                    to: `/${mod.id}/${f.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
                                }))}
                            />
                        ))}
                    </ul>
                </div>
            ))}
        </>
    );
};
