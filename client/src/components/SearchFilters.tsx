import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Search, MapPin, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { SearchFilters as SearchFiltersType } from "../types";

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFiltersType) => void;
}

const availableAmenities = [
  'WiFi', 'Kitchen', 'Parking', 'Air Conditioning', 'Gym', 'Pool', 'Laundry', 'Pet Friendly', 'Beach Access'
];

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();

  const handleFilterChange = (key: keyof SearchFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = checked
      ? [...currentAmenities, amenity]
      : currentAmenities.filter(a => a !== amenity);
    
    handleFilterChange('amenities', newAmenities);
  };

  const handleSearch = () => {
    const searchFilters: SearchFiltersType = {
      ...filters,
      checkIn: checkInDate ? format(checkInDate, 'yyyy-MM-dd') : undefined,
      checkOut: checkOutDate ? format(checkOutDate, 'yyyy-MM-dd') : undefined,
    };
    
    console.log('Applying search filters:', searchFilters);
    onFiltersChange(searchFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    onFiltersChange({});
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Location */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </Label>
            <Input
              placeholder="City, neighborhood..."
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="border-gray-200 focus:border-blue-500"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Check-in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-gray-200"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Check-out</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-gray-200"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    disabled={(date) => date < (checkInDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Price Range (per night)
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Min price"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="border-gray-200 focus:border-blue-500"
              />
              <Input
                type="number"
                placeholder="Max price"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="border-gray-200 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Amenities</Label>
            <div className="grid grid-cols-2 gap-3">
              {availableAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities?.includes(amenity) || false}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                  />
                  <Label htmlFor={amenity} className="text-sm text-gray-700">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSearch}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}