'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Bot, ChevronRight, Gavel, Landmark, LayoutDashboard, Users, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';

export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { href: '/members', label: t('nav_members'), icon: Users },
    { href: '/parliament', label: t('nav_parliament'), icon: Landmark },
    { 
      href: '/meetings/manage',
      label: t('nav_meetings'), 
      icon: Gavel
    },
    { href: '/assistant', label: t('nav_ai_assistant'), icon: Bot },
    { href: '/settings', label: t('nav_settings'), icon: Settings },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gantt-chart"><path d="M8 6h10"/><path d="M6 12h9"/><path d="M11 18h7"/></svg>
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">PolityConnect</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
            >
                <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
