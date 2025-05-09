"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import type { User } from "@/lib/types"

export default function ChatLayout() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Set a default user - in a real app, this would come from authentication
    setCurrentUser({
      id: "1",
      name: "John Doe",
      status: "online",
    })
  }, [])

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser)
  }

  const handleLogout = () => {
    router.push("/login")
  }

  if (!currentUser) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <SidebarProvider>
      <AppSidebar currentUser={currentUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold">ChatApp</h1>
        </header>
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center max-w-md p-8 rounded-lg bg-card border border-border">
            <h3 className="text-xl font-medium mb-2">Welcome to ChatApp</h3>
            <p className="text-muted-foreground">Select a chat to start messaging or create a new conversation.</p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
