import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { 
  MapPin, 
  Star, 
  Wifi, 
  Car, 
  Utensils, 
  CalendarIcon,
  MessageSquare,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Property } from "../types";
import { getProperty } from "../api/properties";
import { createBooking } from "../api/bookings";
import { useToast } from "../hooks/useToast";
import { format, differenceInDays } from "date-fns";

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Kitchen': Utensils,
};

export function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [message, setMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        console.log('Fetching property details for ID:', id);
        const response = await getProperty(id);
        setProperty((response as any).property);
      } catch (error) {
        console.error('Error fetching property:', error);
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, toast]);

  const handleBookingRequest = async () => {
    if (!property || !checkInDate || !checkOutDate) {
      toast({
        title: "Error",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    setBookingLoading(true);
    try {
      console.log('Creating booking request...');
      await createBooking({
        propertyId: property._id,
        checkIn: format(checkInDate, 'yyyy-MM-dd'),
        checkOut: format(checkOutDate, 'yyyy-MM-dd'),
        message: message.trim() || undefined
      });

      toast({
        title: "Success",
        description: "Booking request sent successfully!",
      });

      navigate('/my-bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Failed to send booking request",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate || !property) return 0;
    const nights = differenceInDays(checkOutDate, checkInDate);
    return nights * property.nightlyRate;
  };

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === property.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.photos.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
        <Button onClick={() => navigate('/browse')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Button>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const nights = checkInDate && checkOutDate ? differenceInDays(checkOutDate, checkInDate) : 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        onClick={() => navigate('/browse')} 
        variant="ghost" 
        className="text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Browse
      </Button>

      {/* Image Gallery */}
      <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-100">
        <img
          src={property.photos[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {property.photos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {property.photos.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span>
                {property.address.street} {property.address.number}, {property.address.neighborhood}, {property.address.city} {property.address.zipCode}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">4.8</span>
                <span className="text-gray-500 ml-1">(24 reviews)</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ${property.nightlyRate}/night
              </Badge>
            </div>
          </div>

          {/* Host Info */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={property.owner.profilePicture} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg">
                    {property.owner.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    Hosted by {property.owner.fullName}
                  </h3>
                  <p className="text-gray-600">Host since {format(new Date(property.owner.createdAt), 'MMMM yyyy')}</p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">4.9 host rating</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Host
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">About this place</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity];
                  return (
                    <div key={amenity} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {Icon && <Icon className="h-5 w-5 text-gray-600" />}
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Widget */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">${property.nightlyRate}</span>
                <span className="text-gray-600 ml-1">per night</span>
              </div>

              <div className="space-y-4">
                {/* Check-in Date */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Check-in</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
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
                        disabled={(date) => 
                          date < new Date() || 
                          property.blockedDates.includes(format(date, 'yyyy-MM-dd'))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check-out Date */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Check-out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
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
                        disabled={(date) => 
                          date <= (checkInDate || new Date()) ||
                          property.blockedDates.includes(format(date, 'yyyy-MM-dd'))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Message */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Message (optional)</Label>
                  <Textarea
                    placeholder="Tell the host about your stay..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>

                {/* Price Breakdown */}
                {checkInDate && checkOutDate && (
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>${property.nightlyRate} × {nights} nights</span>
                      <span>${property.nightlyRate * nights}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleBookingRequest}
                  disabled={!checkInDate || !checkOutDate || bookingLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
                >
                  {bookingLoading ? "Sending Request..." : "Request to Book"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  You won't be charged yet. The host will review your request.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}