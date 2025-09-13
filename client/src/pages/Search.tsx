import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { PropertyCard } from "../components/PropertyCard";
import { Property, SearchFilters } from "../types";
import { getProperties } from "../api/properties";
import { useToast } from "../hooks/useToast";

const availableAmenities = [
  "WiFi",
  "Kitchen", 
  "Parking",
  "Air Conditioning",
  "Gym",
  "Pool",
  "Laundry",
  "Pet Friendly",
  "Beach Access"
];

export function Search() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    minPrice: undefined,
    maxPrice: undefined,
    amenities: []
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        const propertiesData = (response as any).properties || [];
        setProperties(propertiesData);
        setFilteredProperties(propertiesData);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar propriedades",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [toast]);

  const applyFilters = () => {
    let filtered = [...properties];

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(property =>
        property.address.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        property.address.neighborhood.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(property => property.nightlyRate >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.nightlyRate <= filters.maxPrice!);
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(property =>
        filters.amenities!.every(amenity => property.amenities.includes(amenity))
      );
    }

    setFilteredProperties(filtered);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      amenities: checked 
        ? [...(prev.amenities || []), amenity]
        : (prev.amenities || []).filter(a => a !== amenity)
    }));
  };

  const searchLocation = filters.location || 'todas as localidades';

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-0 shadow-lg sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Filtros</h3>
            
            {/* Price Range */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Faixa de Preço</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-600">Preço Mínimo</Label>
                  <Input
                    type="number"
                    placeholder="R$ 0"
                    value={filters.minPrice || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      minPrice: e.target.value ? Number(e.target.value) : undefined
                    }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Preço Máximo</Label>
                  <Input
                    type="number"
                    placeholder="R$ 1000"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      maxPrice: e.target.value ? Number(e.target.value) : undefined
                    }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Comodidades</Label>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {availableAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={(filters.amenities || []).includes(amenity)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    />
                    <Label htmlFor={amenity} className="text-sm text-gray-700 cursor-pointer">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={applyFilters}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Resultados para {searchLocation}
            </h1>
            <p className="text-gray-600">
              {filteredProperties.length} propriedade{filteredProperties.length !== 1 ? 's' : ''} encontrada{filteredProperties.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma propriedade encontrada</h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar seus filtros para ver mais resultados.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}