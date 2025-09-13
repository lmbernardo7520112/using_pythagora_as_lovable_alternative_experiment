import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Star, Wifi, Car, Utensils } from "lucide-react";
import { Property } from "../types";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  property: Property;
}

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Kitchen': Utensils,
};

export function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/property/${property._id}`);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={property.photos[0]}
          alt={property.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800 font-semibold">
            ${property.nightlyRate}/night
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-gray-900">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {property.address.neighborhood}, {property.address.city}
          </span>
        </div>
        
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {property.amenities.slice(0, 3).map((amenity) => {
            const Icon = amenityIcons[amenity];
            return (
              <Badge key={amenity} variant="outline" className="text-xs">
                {Icon && <Icon className="h-3 w-3 mr-1" />}
                {amenity}
              </Badge>
            );
          })}
          {property.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{property.amenities.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">4.8</span>
            <span className="text-sm text-gray-500 ml-1">(24 reviews)</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleViewDetails}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}