import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export function Register() {
  const navigate = useNavigate()
  
  useEffect(() => {
    // Redirect to login page since we now have tabs there
    navigate("/login")
  }, [navigate])

  return null
}