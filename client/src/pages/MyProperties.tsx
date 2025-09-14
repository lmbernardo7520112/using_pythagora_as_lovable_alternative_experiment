import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Building2, 
  Plus, 
  Eye, 
  Edit, 
  Calendar,
  DollarSign,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Property } from "../types";
import { getMyProperties } from "../api/properties";
import { useToast } from "../hooks/useToast";
import { useNavigate } from "react-router-dom";

export function MyProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('Fetching my properties...');
        const response = await getMyProperties();
        // Ajuste para tipagem segura, assumindo que getMyProperties retorna { properties: Property[] }
        setProperties(response.properties || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: "Error",
          description: "Failed to load properties",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [toast]);

  const publishedProperties = properties.filter(p => p.status === 'published');
  const draftProperties = properties.filter(p => p.status === 'draft');

  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img
          src={property.photos[0] || 'https://via.placeholder.com/300'} // Fallback para caso não haja foto
          alt={property.title}
          className="h-48 w-full object-cover rounded-t-lg"
        />
        <Badge 
          className={`absolute top-3 right-3 ${
            property.status === 'published' 
              ? 'bg-green-100 text-green-800 border-green-200' 
              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
          }`}
        >
          {property.status}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white" align="end">
              <DropdownMenuItem onClick={() => navigate(`/property/${property._id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/edit-property/${property._id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/property/${property._id}/calendar`)}>
                <Calendar className="mr-2 h-4 w-4" />
                Manage Calendar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {property.address.neighborhood}, {property.address.city}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-green-600">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="font-semibold">${property.nightlyRate}/night</span>
          </div>
          <div className="text-sm text-gray-500">
            {property.photos.length} photo{property.photos.length !== 1 ? 's' : ''}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-600 mt-1">
            Manage your property listings and bookings
          </p>
        </div>
        <Button 
          onClick={() => navigate('/create-property')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{properties.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{publishedProperties.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{draftProperties.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Properties ({properties.length})</TabsTrigger>
          <TabsTrigger value="published">Published ({publishedProperties.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftProperties.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {properties.length === 0 ? (
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                <p className="text-gray-600 mb-4">
                  Start by creating your first property listing.
                </p>
                <Button 
                  onClick={() => navigate('/create-property')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Property
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="published">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publishedProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drafts">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {draftProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}