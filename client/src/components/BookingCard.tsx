import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CalendarDays, MapPin, MessageCircle, Star } from "lucide-react";
import { Booking } from "../types";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
  onApprove?: (bookingId: string) => void;
  onDecline?: (bookingId: string) => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  declined: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
};

export function BookingCard({ booking, showActions = false, onApprove, onDecline }: BookingCardProps) {
  const navigate = useNavigate();

  const handleMessage = () => {
    navigate(`/messages/${booking._id}`);
  };

  const handleReview = () => {
    navigate(`/review/${booking._id}`);
  };

  const isCompleted = new Date(booking.checkOut) < new Date() && booking.status === 'approved';

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={showActions ? booking.guest.profilePicture : booking.owner.profilePicture} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                {showActions ? booking.guest.fullName.charAt(0) : booking.owner.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-gray-900">
                {showActions ? booking.guest.fullName : booking.property?.title}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {showActions ? booking.guest.email : `Host: ${booking.owner.fullName}`}
              </p>
            </div>
          </div>
          <Badge className={statusColors[booking.status]}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {booking.property && (
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {booking.property.address?.neighborhood}, {booking.property.address?.city}
            </span>
          </div>
        )}

        <div className="flex items-center text-gray-600">
          <CalendarDays className="h-4 w-4 mr-2" />
          <span className="text-sm">
            {format(new Date(booking.checkIn), 'MMM dd, yyyy')} - {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm font-medium text-gray-900 mb-1">Total Price</p>
          <p className="text-2xl font-bold text-gray-900">${booking.totalPrice}</p>
        </div>

        {booking.message && (
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900 mb-1">Message</p>
            <p className="text-sm text-blue-800">{booking.message}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {showActions && booking.status === 'pending' && (
            <>
              <Button
                onClick={() => onApprove?.(booking._id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Approve
              </Button>
              <Button
                onClick={() => onDecline?.(booking._id)}
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              >
                Decline
              </Button>
            </>
          )}

          {booking.status === 'approved' && (
            <Button
              onClick={handleMessage}
              variant="outline"
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
          )}

          {isCompleted && (
            <Button
              onClick={handleReview}
              variant="outline"
              className="flex-1 border-yellow-200 text-yellow-600 hover:bg-yellow-50"
            >
              <Star className="h-4 w-4 mr-2" />
              Leave Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}