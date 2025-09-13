import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Building2, 
  Calendar, 
  MessageSquare, 
  Star, 
  TrendingUp,
  Users,
  DollarSign,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyProperties } from "../api/properties";
import { getMyBookings, getBookingRequests } from "../api/bookings";
import { getMyReviews } from "../api/reviews";
import { useToast } from "../hooks/useToast";

export function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    properties: 0,
    bookings: 0,
    requests: 0,
    reviews: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...');
        
        const [propertiesRes, bookingsRes, requestsRes, reviewsRes] = await Promise.all([
          getMyProperties(),
          getMyBookings(),
          getBookingRequests(),
          getMyReviews()
        ]);

        const properties = (propertiesRes as any).properties || [];
        const bookings = (bookingsRes as any).bookings || [];
        const requests = (requestsRes as any).bookings || [];
        const reviews = (reviewsRes as any).reviews || [];

        const totalEarnings = bookings
          .filter((booking: any) => booking.status === 'approved')
          .reduce((sum: number, booking: any) => sum + booking.totalPrice, 0);

        setStats({
          properties: properties.length,
          bookings: bookings.length,
          requests: requests.length,
          reviews: reviews.length,
          earnings: totalEarnings
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const quickActions = [
    {
      title: "List New Property",
      description: "Add a new property to start earning",
      icon: Plus,
      action: () => navigate('/create-property'),
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "Browse Properties",
      description: "Find your next stay",
      icon: Building2,
      action: () => navigate('/browse'),
      color: "from-green-500 to-teal-500"
    },
    {
      title: "Check Messages",
      description: "Stay connected with guests",
      icon: MessageSquare,
      action: () => navigate('/messages'),
      color: "from-orange-500 to-red-500"
    },
    {
      title: "View Bookings",
      description: "Manage your reservations",
      icon: Calendar,
      action: () => navigate('/my-bookings'),
      color: "from-purple-500 to-pink-500"
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100 text-lg">
          Here's what's happening with your properties and bookings today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              My Properties
            </CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.properties}</div>
            <p className="text-xs text-gray-600">
              Active listings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.bookings}</div>
            <p className="text-xs text-gray-600">
              Confirmed stays
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Requests
            </CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.requests}</div>
            <p className="text-xs text-gray-600">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${stats.earnings}</div>
            <p className="text-xs text-gray-600">
              From approved bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="group cursor-pointer bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">New booking request received</p>
                  <p className="text-sm text-gray-600">Jane Doe wants to book your downtown apartment</p>
                </div>
                <Badge variant="secondary">New</Badge>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">New review received</p>
                  <p className="text-sm text-gray-600">5-star review from your recent guest</p>
                </div>
                <Badge variant="secondary">2h ago</Badge>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Property views increased</p>
                  <p className="text-sm text-gray-600">Your listing got 15 new views this week</p>
                </div>
                <Badge variant="secondary">1d ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}