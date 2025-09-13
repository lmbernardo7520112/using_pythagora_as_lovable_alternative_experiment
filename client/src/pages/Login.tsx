import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"
import { LogIn, UserPlus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

type LoginForm = {
  email: string
  password: string
}

type RegisterForm = {
  fullName: string
  email: string
  password: string
}

export function Login() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { login, register: registerUser } = useAuth()
  const navigate = useNavigate()
  
  const loginForm = useForm<LoginForm>()
  const registerForm = useForm<RegisterForm>()

  const onLogin = async (data: LoginForm) => {
    try {
      setLoading(true)
      await login(data.email, data.password);
      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso",
      })
      navigate("/dashboard")
    } catch (error) {
      console.error("Login error:", error.message)
      toast({
        variant: "destructive",
        title: "Erro",
        description: error?.message || "Erro ao fazer login",
      })
    } finally {
      setLoading(false)
    }
  }

  const onRegister = async (data: RegisterForm) => {
    try {
      setLoading(true)
      await registerUser(data.email, data.password);
      toast({
        title: "Sucesso",
        description: "Conta criada com sucesso",
      })
      navigate("/dashboard")
    } catch (error) {
      console.error("Register error:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: error?.message || "Erro ao criar conta",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RentStay
          </CardTitle>
          <CardDescription className="text-gray-600">
            Acesse sua conta ou crie uma nova
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="text-sm font-medium">
                Entrar
              </TabsTrigger>
              <TabsTrigger value="register" className="text-sm font-medium">
                Cadastrar
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-700">E-mail</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    className="bg-white/50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...loginForm.register("email", { required: "E-mail é obrigatório" })}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-700">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Digite sua senha"
                    className="bg-white/50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...loginForm.register("password", { required: "Senha é obrigatória" })}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-all duration-200 transform hover:scale-105" 
                  disabled={loading}
                >
                  {loading ? (
                    "Entrando..."
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Entrar
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-fullname" className="text-gray-700">Nome Completo</Label>
                  <Input
                    id="register-fullname"
                    type="text"
                    placeholder="Digite seu nome completo"
                    className="bg-white/50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...registerForm.register("fullName", { required: "Nome completo é obrigatório" })}
                  />
                  {registerForm.formState.errors.fullName && (
                    <p className="text-sm text-red-600">{registerForm.formState.errors.fullName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-gray-700">E-mail</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    className="bg-white/50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...registerForm.register("email", { 
                      required: "E-mail é obrigatório",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "E-mail inválido"
                      }
                    })}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-red-600">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-gray-700">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Escolha uma senha (mín. 6 caracteres)"
                    className="bg-white/50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...registerForm.register("password", { 
                      required: "Senha é obrigatória",
                      minLength: {
                        value: 6,
                        message: "Senha deve ter pelo menos 6 caracteres"
                      }
                    })}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-red-600">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-all duration-200 transform hover:scale-105" 
                  disabled={loading}
                >
                  {loading ? (
                    "Cadastrando..."
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Cadastrar
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}