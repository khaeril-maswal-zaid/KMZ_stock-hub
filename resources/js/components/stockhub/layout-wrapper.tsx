"use client"

import type React from "react"

import { useEffect } from "react"
import { Sidebar } from "./sidebar"
import { Toaster } from "@/components/ui/toaster"
import { initializeStorage } from "@/lib/storage"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeStorage()
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-4 md:p-8">{children}</div>
      </main>
      <Toaster />
    </div>
  )
}
