"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"

interface StatusSelectorProps {
  currentStatus: string
  onStatusChange: (status: string) => void
}

export default function StatusSelector({ currentStatus, onStatusChange }: StatusSelectorProps) {
  const { t } = useLanguage()

  const statuses = [
    { value: "online", color: "bg-green-500" },
    { value: "away", color: "bg-yellow-500" },
    { value: "busy", color: "bg-red-500" },
    { value: "offline", color: "bg-gray-500" },
  ]

  const currentStatusObj = statuses.find((s) => s.value === currentStatus) || statuses[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <span className={`h-2 w-2 rounded-full mr-2 ${currentStatusObj.color}`}></span>
          {t(`status_${currentStatus}`)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={currentStatus} onValueChange={onStatusChange}>
          {statuses.map((status) => (
            <DropdownMenuRadioItem key={status.value} value={status.value} className="cursor-pointer">
              <div className="flex items-center">
                <span className={`h-2 w-2 rounded-full mr-2 ${status.color}`}></span>
                {t(`status_${status.value}`)}
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
