"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/lib/language-context"
import { useTheme } from "@/components/custom-theme-provider"
import { X, Moon, Sun, CircleDot } from "lucide-react"

interface SettingsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("appearance")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{t("settings")}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">{t("close")}</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="appearance">{t("appearance")}</TabsTrigger>
            <TabsTrigger value="language">{t("language")}</TabsTrigger>
            <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
            <TabsTrigger value="privacy">{t("privacy")}</TabsTrigger>
            <TabsTrigger value="help">{t("help")}</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => setTheme("light")}
              >
                <Sun className="h-8 w-8" />
                <span>{t("light_mode")}</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-8 w-8" />
                <span>{t("dark_mode")}</span>
              </Button>
              <Button
                variant={theme === "black" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => setTheme("black")}
              >
                <CircleDot className="h-8 w-8" />
                <span>{t("black_mode")}</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="language" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {["en", "fr", "es", "de", "ru", "am"].map((lang) => (
                <Button
                  key={lang}
                  variant={language === lang ? "default" : "outline"}
                  className="flex items-center justify-center h-12"
                  onClick={() => setLanguage(lang as any)}
                >
                  {lang.toUpperCase()}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Notification Settings</h3>
              <p className="text-muted-foreground mb-4">Configure how and when you receive notifications.</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Message notifications</p>
                <p>• Group notifications</p>
                <p>• Call notifications</p>
                <p>• Notification sounds</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Privacy Settings</h3>
              <p className="text-muted-foreground mb-4">Manage your privacy and security settings.</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Who can see my profile</p>
                <p>• Who can contact me</p>
                <p>• Message history</p>
                <p>• Two-factor authentication</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="help">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Help & Support</h3>
              <p className="text-muted-foreground mb-4">Get help with using ChatApp.</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• FAQ</p>
                <p>• Contact support</p>
                <p>• Report a problem</p>
                <p>• Terms of service</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
