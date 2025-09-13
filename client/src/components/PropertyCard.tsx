import { Card, CardContent } from "./ui/card";
import { Property } from "../types";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/properties/${property._id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Card 
      className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={property.photos[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
          alt={property.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">
          {property.title}
        </h3>
        
        <p className="text-lg font-bold text-gray-900">
          {formatPrice(property.nightlyRate)} <span className="text-sm font-normal text-gray-600">/ noite</span>
        </p>
      </CardContent>
    </Card>
  );
}