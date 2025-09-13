import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Home, 
  Search, 
  Building2, 
  Calendar, 
  MessageSquare, 
  Star, 
  Plus,
  User
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Browse Properties', href: '/browse', icon: Search },
  { name: 'My Properties', href: '/my-properties', icon: Building2 },
  { name: 'My Bookings', href: '/my-bookings', icon: Calendar },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Reviews', href: '/reviews', icon: Star },
  { name: 'Profile', href: '/profile', icon: User },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-4">
            <Button
              onClick={() => navigate('/create-property')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              <Plus className="mr-2 h-4 w-4" />
              List Property
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={location.pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    location.pathname === item.href
                      ? "bg-blue-100 text-blue-900 hover:bg-blue-200"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}