import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Layout } from "./components/Layout"
import { BlankPage } from "./pages/BlankPage"
import { Dashboard } from "./pages/Dashboard"
import { BrowseProperties } from "./pages/BrowseProperties"
import { PropertyDetails } from "./pages/PropertyDetails"
import { MyBookings } from "./pages/MyBookings"
import { MyProperties } from "./pages/MyProperties"
import { Messages } from "./pages/Messages"
import { Reviews } from "./pages/Reviews"
import { Profile } from "./pages/Profile"

function App() {
  return (
  <AuthProvider>
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/browse" element={<ProtectedRoute><Layout><BrowseProperties /></Layout></ProtectedRoute>} />
          <Route path="/property/:id" element={<ProtectedRoute><Layout><PropertyDetails /></Layout></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><Layout><MyBookings /></Layout></ProtectedRoute>} />
          <Route path="/my-properties" element={<ProtectedRoute><Layout><MyProperties /></Layout></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
          <Route path="/messages/:bookingId" element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><Layout><Reviews /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="*" element={<BlankPage />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  </AuthProvider>
  )
}

export default App