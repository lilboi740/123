"use client"

import { useState } from "react"
import { Search, Plus, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useSidebar } from "@/components/ui/sidebar"
import { useLanguage } from "@/lib/language-context"
import AddContactModal from "@/components/add-contact-modal"
import type { Contact } from "@/lib/types"

interface ContactListProps {
  contacts: Contact[]
  onContactSelect: (contact: Contact) => void
  onAddContact: (contact: Partial<Contact>) => void
}

export default function ContactList({ contacts, onContactSelect, onAddContact }: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [addContactOpen, setAddContactOpen] = useState(false)
  const { state } = useSidebar()
  const { t } = useLanguage()

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">{state === "expanded" ? t("contacts") : ""}</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setAddContactOpen(true)}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">{t("add_contact")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{t("add_contact")}</TooltipContent>
          </Tooltip>
        </div>

        {state === "expanded" && contacts.length > 0 && (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("search_contacts")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {contacts.length > 0 ? (
          <div className="space-y-1">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <ContactItem key={contact.id} contact={contact} onClick={() => onContactSelect(contact)} />
              ))
            ) : (
              <div className="text-center py-2 text-sm text-muted-foreground">{t("no_contacts_found")}</div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="bg-muted rounded-full p-4">
                <UserPlus className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">{t("no_contacts")}</p>
              <p className="text-xs text-muted-foreground mb-4">{t("add_your_first_contact")}</p>
              <Button size="sm" onClick={() => setAddContactOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("add_contact")}
              </Button>
            </div>
          </div>
        )}

        <AddContactModal open={addContactOpen} onOpenChange={setAddContactOpen} onAddContact={onAddContact} />
      </div>
    </TooltipProvider>
  )
}

interface ContactItemProps {
  contact: Contact
  onClick: () => void
}

function ContactItem({ contact, onClick }: ContactItemProps) {
  const { state } = useSidebar()

  const statusColor = getStatusColor(contact.status || "offline")

  const contactItem = (
    <div
      className="flex items-center gap-3 rounded-md p-2 cursor-pointer hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={contact.avatar || `/placeholder.svg?height=32&width=32`} />
          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
        </Avatar>
        {contact.isOnline && (
          <span
            className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${statusColor} ring-1 ring-background`}
          ></span>
        )}
      </div>

      {state === "expanded" && (
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium truncate">{contact.name}</p>
            {contact.unreadCount ? (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
                {contact.unreadCount}
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {contact.status === "online" ? "Online" : contact.lastSeen}
          </p>
        </div>
      )}
    </div>
  )

  if (state === "collapsed") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{contactItem}</TooltipTrigger>
        <TooltipContent side="right" className="flex flex-col gap-1">
          <p className="font-medium">{contact.name}</p>
          <p className="text-xs text-muted-foreground">{contact.status === "online" ? "Online" : contact.lastSeen}</p>
          {contact.unreadCount ? (
            <div className="flex items-center gap-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              <span>{contact.unreadCount} unread messages</span>
            </div>
          ) : null}
        </TooltipContent>
      </Tooltip>
    )
  }

  return contactItem
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
      return "bg-gray-500"
  }
}
