import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { MessageSquare, Send, ArrowLeft } from "lucide-react";
import { Message, Booking } from "../types";
import { getMessages, sendMessage } from "../api/messages";
import { getMyBookings } from "../api/bookings";
import { useToast } from "../hooks/useToast";
import { format } from "date-fns";

export function Messages() {
  const { bookingId } = useParams<{ bookingId?: string }>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log('Fetching bookings for messages...');
        const response = await getMyBookings();
        const approvedBookings = ((response as any).bookings || []).filter(
          (booking: Booking) => booking.status === 'approved'
        );
        setBookings(approvedBookings);

        if (bookingId) {
          const booking = approvedBookings.find((b: Booking) => b._id === bookingId);
          if (booking) {
            setSelectedBooking(booking);
            await fetchMessages(bookingId);
          }
        } else if (approvedBookings.length > 0) {
          setSelectedBooking(approvedBookings[0]);
          await fetchMessages(approvedBookings[0]._id);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [bookingId, toast]);

  const fetchMessages = async (bookingId: string) => {
    try {
      console.log('Fetching messages for booking:', bookingId);
      const response = await getMessages(bookingId);
      setMessages((response as any).messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedBooking || sendingMessage) return;

    setSendingMessage(true);
    try {
      console.log('Sending message...');
      const response = await sendMessage({
        bookingId: selectedBooking._id,
        content: newMessage.trim()
      });

      const sentMessage = (response as any).message;
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');

      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        <Card className="lg:col-span-1 animate-pulse">
          <CardContent className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 animate-pulse">
          <CardContent className="p-4">
            <div className="h-full bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">
          Communicate with your guests and hosts
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-350px)]">
              {bookings.length === 0 ? (
                <div className="p-4 text-center">
                  <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No conversations yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedBooking?._id === booking._id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                      onClick={() => {
                        setSelectedBooking(booking);
                        fetchMessages(booking._id);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={booking.owner.profilePicture} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {booking.owner.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {booking.owner.fullName}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {booking.property?.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(booking.checkIn), 'MMM dd')} - {format(new Date(booking.checkOut), 'MMM dd')}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          {selectedBooking ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedBooking.owner.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {selectedBooking.owner.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {selectedBooking.owner.fullName}
                    </h3>
                    <p className="text-gray-600">{selectedBooking.property?.title}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(selectedBooking.checkIn), 'MMM dd, yyyy')} - {format(new Date(selectedBooking.checkOut), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    ${selectedBooking.totalPrice}
                  </Badge>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-0 flex flex-col h-[calc(100vh-400px)]">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.senderId === 'current-user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === 'current-user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === 'current-user'
                                ? 'text-blue-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {format(new Date(message.createdAt), 'MMM dd, HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={sendingMessage}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-600">
                Choose a conversation from the list to start messaging.
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}