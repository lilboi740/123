"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/language-context"
import StatusSelector from "@/components/status-selector"
import type { User } from "@/lib/types"
import { X } from "lucide-react"

interface UserProfileEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onUserUpdate: (updatedUser: User) => void
}

export default function UserProfileEditor({ open, onOpenChange, user, onUserUpdate }: UserProfileEditorProps) {
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio || "")
  const [status, setStatus] = useState(user.status || "online")
  const { t } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedUser: User = {
      ...user,
      name,
      bio,
      status,
    }

    onUserUpdate(updatedUser)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{t("edit_profile")}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">{t("close")}</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("display_name")}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t("status")}</Label>
              <StatusSelector currentStatus={status} onStatusChange={setStatus} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{t("bio")}</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t("bio_placeholder")}
                className="resize-none h-20"
              />
              <p className="text-xs text-muted-foreground">{t("bio_description")}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit">{t("save_changes")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
