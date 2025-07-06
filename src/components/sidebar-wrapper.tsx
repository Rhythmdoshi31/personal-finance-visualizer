"use client"

import { AppSidebar } from "./app-sidebar"
import { useNavigation } from "@/contexts/navigation-context"

export function SidebarWrapper() {
  const { setCurrentPage } = useNavigation()

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  return <AppSidebar onNavigate={handleNavigate} />
} 