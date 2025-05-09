export interface User {
  id: string
  name: string
  avatar?: string
  status?: string
  bio?: string
}

export interface Contact {
  id: string
  name: string
  avatar?: string
  status?: string
  lastSeen?: string
  unreadCount?: number
  isOnline?: boolean
}

export interface Chat {
  id: string
  name: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  isOnline?: boolean
}
