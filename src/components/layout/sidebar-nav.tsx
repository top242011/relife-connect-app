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
import { Bot, ChevronRight, Gavel, Landmark, LayoutDashboard, Users, FileText, CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/members', label: 'Members', icon: Users },
  { href: '/parliament', label: 'Parliament', icon: Landmark },
  { 
    label: 'Meetings', 
    icon: Gavel,
    subItems: [
        { href: '/meetings/manage', label: 'Manage Meetings', icon: FileText },
        { href: '/meetings', label: 'Scheduler & AI Tools', icon: CalendarPlus },
    ]
  },
  { href: '/assistant', label: 'AI Assistant', icon: Bot },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [openMeeting, setOpenMeeting] = React.useState(pathname.startsWith('/meetings'));

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
          {navItems.map((item, index) => (
            item.subItems ? (
                <Collapsible key={item.label} open={openMeeting} onOpenChange={setOpenMeeting} className="w-full">
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                                variant="default"
                                className="justify-between"
                                isActive={pathname.startsWith('/meetings')}
                            >
                                <div className="flex items-center gap-2">
                                    <item.icon/>
                                    <span>{item.label}</span>
                                </div>
                                <ChevronRight className={cn("h-4 w-4 transition-transform", openMeeting && "rotate-90")} />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                    </SidebarMenuItem>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.subItems.map(subItem => (
                                <SidebarMenuSubItem key={subItem.href}>
                                    <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                        <Link href={subItem.href}>
                                            <subItem.icon />
                                            <span>{subItem.label}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            ) : (
                <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                >
                    <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            )
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
