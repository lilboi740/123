"use client"

import { useState } from "react"
import { X, Search, UserPlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/language-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Contact } from "@/lib/types"

interface AddContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddContact: (contact: Partial<Contact>) => void
}

export default function AddContactModal({ open, onOpenChange, onAddContact }: AddContactModalProps) {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Partial<Contact>[]>([])
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // Mock search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchResults([])

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock search results based on query
    const results: Partial<Contact>[] = [
      {
        id: "search-1",
        name: `${searchQuery} Smith`,
        status: "online",
        isOnline: true,
      },
      {
        id: "search-2",
        name: `Alex ${searchQuery}`,
        status: "offline",
        isOnline: false,
        lastSeen: "2 hours ago",
      },
      {
        id: "search-3",
        name: `${searchQuery} Johnson`,
        status: "away",
        isOnline: true,
      },
    ]

    setSearchResults(results)
    setIsSearching(false)
  }

  const handleAddContact = async () => {
    if (!selectedContact) return

    setIsAdding(true)

    // Find the selected contact from search results
    const contactToAdd = searchResults.find((contact) => contact.id === selectedContact)

    if (contactToAdd) {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call the onAddContact callback with the selected contact
      onAddContact(contactToAdd)

      // Reset form and close modal
      setSearchQuery("")
      setSearchResults([])
      setSelectedContact(null)
      onOpenChange(false)
    }

    setIsAdding(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{t("add_contact")}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">{t("close")}</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="search-contact">{t("search_by_username_or_phone")}</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search-contact"
                  placeholder={t("enter_username_or_phone")}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleSearch()
                    }
                  }}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {t("search")}
              </Button>
            </div>
          </div>

          {isSearching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              <Label>{t("search_results")}</Label>
              <RadioGroup value={selectedContact || ""} onValueChange={setSelectedContact}>
                <div className="space-y-2">
                  {searchResults.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent"
                    >
                      <RadioGroupItem value={contact.id || ""} id={contact.id} />
                      <Label htmlFor={contact.id} className="flex items-center gap-3 flex-1 cursor-pointer">
                        <Avatar>
                          <AvatarImage src={contact.avatar || `/placeholder.svg?height=40&width=40`} />
                          <AvatarFallback>{contact.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {contact.status === "online" ? t("status_online") : contact.lastSeen}
                          </p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <Button className="w-full" onClick={handleAddContact} disabled={!selectedContact || isAdding}>
                {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                {t("add_contact")}
              </Button>
            </div>
          ) : searchQuery && !isSearching ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t("no_users_found")}</p>
              <p className="text-sm mt-1">{t("try_different_search")}</p>
            </div>
          ) : null}

          <div className="text-sm text-muted-foreground">
            <p>{t("add_contact_description")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
