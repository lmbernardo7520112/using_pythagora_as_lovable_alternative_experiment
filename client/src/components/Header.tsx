import { Bell, LogOut, User } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ui/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export function Header() {
  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const getUserInitials = (name: string) => {
    if (!name) return "U"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm border-gray-200">
      <div className="flex h-16 items-center justify-between px-6">
        <div
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer transition-all duration-200 hover:scale-105"
          onClick={() => navigate("/")}
        >
          RentStay
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 font-medium">
            {currentUser?.fullName || currentUser?.email || "Usuário"}
          </span>

          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
            <Bell className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-100 transition-all duration-200">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                    {getUserInitials(currentUser?.fullName || currentUser?.email || "U")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg" align="end" forceMount>
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-gray-50">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-gray-50 text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}