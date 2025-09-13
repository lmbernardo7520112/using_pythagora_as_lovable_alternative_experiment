import { useEffect, useState } from "react";
import { PropertyCard } from "../components/PropertyCard";
import { SearchFilters } from "../components/SearchFilters";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Filter, Grid, List } from "lucide-react";
import { Property, SearchFilters as SearchFiltersType } from "../types";
import { getProperties } from "../api/properties";
import { useToast } from "../hooks/useToast";

export function BrowseProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<SearchFiltersType>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('Fetching properties...');
        const response = await getProperties();
        const propertiesData = (response as any).properties || [];
        setProperties(propertiesData);
        setFilteredProperties(propertiesData);
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

  const handleFiltersChange = (filters: SearchFiltersType) => {
    console.log('Applying filters:', filters);
    setActiveFilters(filters);
    
    let filtered = [...properties];

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(property =>
        property.address.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        property.address.neighborhood.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Apply price filters
    if (filters.minPrice) {
      filtered = filtered.filter(property => property.nightlyRate >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.nightlyRate <= filters.maxPrice!);
    }

    // Apply amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(property =>
        filters.amenities!.every(amenity => property.amenities.includes(amenity))
      );
    }

    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setFilteredProperties(properties);
  };

  const activeFilterCount = Object.values(activeFilters).filter(value => 
    value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)
  ).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Properties</h1>
          <p className="text-gray-600 mt-1">
            Discover amazing places for your medium-term stay
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-gray-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          
          <div className="flex border border-gray-200 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>
          {activeFilters.location && (
            <Badge variant="secondary">Location: {activeFilters.location}</Badge>
          )}
          {activeFilters.minPrice && (
            <Badge variant="secondary">Min: ${activeFilters.minPrice}</Badge>
          )}
          {activeFilters.maxPrice && (
            <Badge variant="secondary">Max: ${activeFilters.maxPrice}</Badge>
          )}
          {activeFilters.amenities?.map(amenity => (
            <Badge key={amenity} variant="secondary">{amenity}</Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <SearchFilters onFiltersChange={handleFiltersChange} />
          </div>
        )}

        {/* Properties Grid */}
        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Filter className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to see more results.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  {filteredProperties.length} propert{filteredProperties.length === 1 ? 'y' : 'ies'} found
                </p>
              </div>
              
              <div className={
                viewMode === 'grid' 
                  ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3" 
                  : "space-y-6"
              }>
                {filteredProperties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}