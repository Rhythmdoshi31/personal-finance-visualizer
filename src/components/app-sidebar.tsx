"use client"

import * as React from "react"
import {
  LayoutDashboard,
  ListOrdered,
  PieChart,
  Settings2,
  Wallet,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"

// This is sample data.
const data = {
  user: {
    name: "Rhythm Doshi",
    email: "rhythmdoshi04@gmail.com",
    avatar: "/avatars/shadcn.jpg", // Make sure this exists or replace with a real one
  },
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Transactions",
      url: "transactions",
      icon: ListOrdered,
      isActive: true,
    },
    {
      title: "Budgets",
      url: "budgets",
      icon: Wallet,
      isActive: true,
    },
    {
      title: "Insights",
      url: "insights",
      icon: PieChart,
      isActive: true,
    },
    {
      title: "Settings",
      url: "settings",
      icon: Settings2,
      isActive: true,
    },
  ],
  projects: [], // You can leave this empty if you don't use project switching
}

export function AppSidebar({ onNavigate, ...props }: React.ComponentProps<typeof Sidebar> & { onNavigate?: (page: string) => void }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="h-16 text-xl font-bold flex pl-4 gap-2 mt-4 justify-center items-center">
          <Image src="/vercel.svg" alt="logo" width={32} height={32} />
          <h1>Personal Finance Visualizer</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="flex flex-col gap-2 mt-6">
          <NavMain items={data.navMain} onNavigate={onNavigate} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
