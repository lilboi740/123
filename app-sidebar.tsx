"use client"

import { useState, useEffect } from "react"
import { LogOut, Settings, Moon, Sun, Edit, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/custom-theme-provider"
import { useLanguage } from "@/lib/language-context"
import SettingsPanel from "@/components/settings-panel"
import UserProfileEditor from "@/components/user-profile-editor"
import ContactList from "@/components/contact-list"
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, useSidebar } from "@/components/ui/sidebar"
import { useToast } from "@/components/ui/use-toast"
import type { User, Contact } from "@/lib/types"

interface AppSidebarProps {
  currentUser: User
  onLogout: () => void
  onUserUpdate: (updatedUser: User) => void
}

export function AppSidebar({ currentUser, onLogout, onUserUpdate }: AppSidebarProps) {
  const { theme, cycleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [profileEditorOpen, setProfileEditorOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([]) // Empty array instead of mock data
  const { t } = useLanguage()
  const { state } = useSidebar()
  const { toast } = useToast()

  // Ensure theme toggle only renders client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleContactSelect = (contact: Contact) => {
    console.log("Selected contact:", contact)
    // In a real app, this would open a chat with the contact
  }

  const handleAddContact = (newContact: Partial<Contact>) => {
    // Create a new contact with a unique ID
    const contact: Contact = {
      id: `contact-${Date.now()}`,
      name: newContact.name || "Unknown",
      status: newContact.status || "offline",
      lastSeen: newContact.lastSeen || "Never",
      isOnline: newContact.isOnline || false,
    }

    // Add the new contact to the list
    setContacts((prevContacts) => [...prevContacts, contact])

    // Show a success toast
    toast({
      title: t("contact_added"),
      description: t("contact_added_description").replace("{name}", contact.name),
    })
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Sidebar>
        <SidebarHeader className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {state === "expanded" ? (
                <div className="relative group">
                  <Avatar className="cursor-pointer" onClick={() => setProfileEditorOpen(true)}>
                    <AvatarImage src={currentUser.avatar || `/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Edit className="h-4 w-4 text-white" />
                  </div>
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative group">
                      <Avatar className="cursor-pointer" onClick={() => setProfileEditorOpen(true)}>
                        <AvatarImage src={currentUser.avatar || `/placeholder.svg?height=40&width=40`} />
                        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Edit className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">{currentUser.name}</TooltipContent>
                </Tooltip>
              )}
              {state === "expanded" && (
                <div>
                  <h2 className="font-semibold">{currentUser.name}</h2>
                  {currentUser.status && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className={`h-1.5 w-1.5 rounded-full mr-1 ${getStatusColor(currentUser.status)}`}></span>
                      <span>{t(`status_${currentUser.status}`)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {state === "expanded" ? (
              <div className="flex space-x-1">
                {mounted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => cycleTheme()}
                    className="h-8 w-8"
                    aria-label="Toggle theme"
                  >
                    {theme === "light" ? (
                      <Sun className="h-4 w-4" />
                    ) : theme === "dark" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4 text-blue-400" />
                    )}
                  </Button>
                )}

                <Button variant="ghost" size="icon" onClick={onLogout} className="h-8 w-8">
                  <LogOut className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSettingsOpen(true)}>
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                {mounted && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => cycleTheme()}
                        className="h-8 w-8"
                        aria-label="Toggle theme"
                      >
                        {theme === "light" ? (
                          <Sun className="h-4 w-4" />
                        ) : theme === "dark" ? (
                          <Moon className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4 text-blue-400" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{t("theme")}</TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={onLogout} className="h-8 w-8">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{t("logout")}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSettingsOpen(true)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{t("settings")}</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </SidebarHeader>

        {state === "expanded" && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                className="pl-8"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        <SidebarContent className="p-4">
          <ContactList contacts={contacts} onContactSelect={handleContactSelect} onAddContact={handleAddContact} />
        </SidebarContent>
        <SidebarRail />

        <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
        <UserProfileEditor
          open={profileEditorOpen}
          onOpenChange={setProfileEditorOpen}
          user={currentUser}
          onUserUpdate={onUserUpdate}
        />
      </Sidebar>
    </TooltipProvider>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case "online":
      return "bg-green-500"
    case "away":
      return "bg-yellow-500"
    case "busy":
      return "bg-red-500"
    case "offline":
      return "bg-gray-500"
    default:
      return "bg-green-500"
  }
}
