import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export function PublicHeader() {
  const navigate = useNavigate()
  const { isAuthenticated, currentUser, logout } = useAuth()

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
          {!isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
              >
                Entrar
              </Button>
              <Button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200 transform hover:scale-105"
              >
                Cadastrar
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 font-medium">
                Olá, {currentUser?.fullName || currentUser?.email || "Usuário"}
              </span>
              
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
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer hover:bg-gray-50">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-gray-50 text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}