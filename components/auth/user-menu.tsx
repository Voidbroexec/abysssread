"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { User, Heart, Bookmark, Settings, LogOut, Sparkles } from "lucide-react"
import Link from "next/link"

export function UserMenu() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full button-3d">
          <Avatar className="h-10 w-10 border-2 border-purple-500/30 glow-purple">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-900/95 border-purple-500/30 glass-effect" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-purple-100">{user.username}</p>
            <p className="text-xs leading-none text-purple-300/70">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-purple-500/20" />
        <DropdownMenuItem asChild className="text-purple-100 hover:bg-purple-600/20 focus:bg-purple-600/20">
          <Link href="/profile">
            <User className="mr-2 h-4 w-4 text-purple-400" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="text-purple-100 hover:bg-purple-600/20 focus:bg-purple-600/20">
          <Link href="/favorites">
            <Heart className="mr-2 h-4 w-4 text-red-400" />
            <span>Favorites</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="text-purple-100 hover:bg-purple-600/20 focus:bg-purple-600/20">
          <Link href="/bookmarks">
            <Bookmark className="mr-2 h-4 w-4 text-blue-400" />
            <span>Bookmarks</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="text-purple-100 hover:bg-purple-600/20 focus:bg-purple-600/20">
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4 text-purple-400" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-purple-500/20" />
        <DropdownMenuItem onClick={logout} className="text-purple-100 hover:bg-red-600/20 focus:bg-red-600/20">
          <LogOut className="mr-2 h-4 w-4 text-red-400" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
