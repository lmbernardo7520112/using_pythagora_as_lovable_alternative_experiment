import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"

export function PublicHeader() {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm border-gray-200">
      <div className="flex h-16 items-center justify-between px-6">
        <div
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate("/")}
        >
          RentStay
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/login")}
            className="text-gray-700 hover:text-gray-900"
          >
            Entrar
          </Button>
          <Button 
            onClick={() => navigate("/register")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Cadastrar
          </Button>
        </div>
      </div>
    </header>
  )
}