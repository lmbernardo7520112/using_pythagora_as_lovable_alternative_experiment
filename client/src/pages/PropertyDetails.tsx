
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
     const [error, setError] = useState<string | null>(null);
     const [currentImageIndex, setCurrentImageIndex] = useState(0);
     const [checkInDate, setCheckInDate] = useState<Date>();
     const [checkOutDate, setCheckOutDate] = useState<Date>();
     const [message, setMessage] = useState('');
     const [bookingLoading, setBookingLoading] = useState(false);

     useEffect(() => {
       const fetchProperty = async () => {
         if (!id) {
           setError('ID da propriedade não fornecido');
           setLoading(false);
           return;
         }

         try {
           console.log('Fetching property details for ID:', id);
           const response = await getProperty(id);
           console.log('API response:', response);
           setProperty((response as any).property);
         } catch (error: any) {
           console.error('Error fetching property:', error);
           setError(error.message || 'Falha ao carregar propriedade');
           toast({
             title: "Erro",
             description: error.message || "Falha ao carregar detalhes da propriedade",
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
           title: "Erro",
           description: "Por favor, selecione as datas de check-in e check-out",
           variant: "destructive",
         });
         return;
       }

       const accessToken = localStorage.getItem('accessToken');
       if (!accessToken) {
         toast({
           title: "Login necessário",
           description: "Você precisa fazer login para solicitar uma reserva",
           variant: "destructive",
         });
         navigate('/login');
         return;
       }

       setBookingLoading(true);
       try {
         console.log('Creating booking request...', { propertyId: property._id, checkIn: checkInDate, checkOut: checkOutDate });
         await createBooking({
           propertyId: property._id,
           checkIn: format(checkInDate, 'yyyy-MM-dd'),
           checkOut: format(checkOutDate, 'yyyy-MM-dd'),
           message: message.trim() || undefined
         });

         toast({
           title: "Sucesso",
           description: "Solicitação de reserva enviada com sucesso!",
         });

         navigate('/my-bookings');
       } catch (error: any) {
         console.error('Error creating booking:', error);
         toast({
           title: "Erro",
           description: error.message || "Falha ao enviar solicitação de reserva",
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

     const formatPrice = (price: number) => {
       return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL'
       }).format(price);
     };

     if (loading) {
       return (
         <div className="container mx-auto px-6 py-8">
           <div className="animate-pulse space-y-6">
             <div className="h-96 bg-gray-200 rounded-lg"></div>
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

     if (error || !property) {
       return (
         <div className="container mx-auto px-6 py-8">
           <div className="text-center py-12">
             <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Propriedade não encontrada"}</h2>
             <Button onClick={() => navigate('/')} variant="outline">
               <ArrowLeft className="h-4 w-4 mr-2" />
               Voltar ao início
             </Button>
           </div>
         </div>
       );
     }

     const totalPrice = calculateTotalPrice();
     const nights = checkInDate && checkOutDate ? differenceInDays(checkOutDate, checkInDate) : 0;

     return (
       <div className="container mx-auto px-6 py-8 space-y-8">
         {/* Back Button */}
         <Button
           onClick={() => navigate(-1)}
           variant="ghost"
           className="text-gray-600 hover:text-gray-900"
         >
           <ArrowLeft className="h-4 w-4 mr-2" />
           Voltar
         </Button>

         {/* Bloco 1 - Galeria de Fotos */}
         <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-100">
           <img
             src={property.photos[currentImageIndex] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
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

         {/* Bloco 2 - Conteúdo Principal */}
         <div className="grid lg:grid-cols-3 gap-8">
           {/* Coluna da Esquerda - Informações */}
           <div className="lg:col-span-2 space-y-6">
             {/* Header */}
             <div>
               <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
               <div className="flex items-center text-gray-600 mb-4">
                 <MapPin className="h-5 w-5 mr-2" />
                 <span>
                   {property.address.neighborhood}, {property.address.city}
                 </span>
               </div>
               <div className="flex items-center space-x-4">
                 <div className="flex items-center">
                   <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                   <span className="font-medium">4.8</span>
                   <span className="text-gray-500 ml-1">(24 avaliações)</span>
                 </div>
                 <Badge variant="secondary" className="bg-green-100 text-green-800">
                   {formatPrice(property.nightlyRate)}/noite
                 </Badge>
               </div>
             </div>

             {/* Description */}
             <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
               <CardContent className="p-6">
                 <h3 className="font-semibold text-lg text-gray-900 mb-3">Sobre este lugar</h3>
                 <p className="text-gray-700 leading-relaxed">{property.description}</p>
               </CardContent>
             </Card>

             {/* Amenities */}
             <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
               <CardContent className="p-6">
                 <h3 className="font-semibold text-lg text-gray-900 mb-4">Comodidades</h3>
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

             {/* Host Info */}
             <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
               <CardContent className="p-6">
                 <div className="flex items-center space-x-4">
                   <Avatar className="h-16 w-16">
                     <AvatarImage src={property.owner?.profilePicture} />
                     <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg">
                       {property.owner?.fullName?.charAt(0) || 'H'}
                     </AvatarFallback>
                   </Avatar>
                   <div className="flex-1">
                     <h3 className="font-semibold text-lg text-gray-900">
                       Hospedado por {property.owner?.fullName || 'Anfitrião'}
                     </h3>
                     <p className="text-gray-600">Anfitrião desde {format(new Date(property.owner?.createdAt || Date.now()), 'MMMM yyyy')}</p>
                     <div className="flex items-center mt-2">
                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                       <span className="text-sm font-medium">4.9 avaliação do anfitrião</span>
                     </div>
                   </div>
                   <Button variant="outline" size="sm">
                     <MessageSquare className="h-4 w-4 mr-2" />
                     Contatar
                   </Button>
                 </div>
               </CardContent>
             </Card>
           </div>

           {/* Coluna da Direita - Box de Reserva */}
           <div className="lg:col-span-1">
             <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
               <CardContent className="p-6">
                 <div className="text-center mb-6">
                   <span className="text-3xl font-bold text-gray-900">{formatPrice(property.nightlyRate)}</span>
                   <span className="text-gray-600 ml-1">por noite</span>
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
                           {checkInDate ? format(checkInDate, "dd/MM/yyyy") : "Selecionar data"}
                         </Button>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0 bg-white" align="start">
                         <Calendar
                           mode="single"
                           selected={checkInDate}
                           onSelect={setCheckInDate}
                           disabled={(date) =>
                             date < new Date() ||
                             property.blockedDates.some(d => format(new Date(d), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
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
                           {checkOutDate ? format(checkOutDate, "dd/MM/yyyy") : "Selecionar data"}
                         </Button>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0 bg-white" align="start">
                         <Calendar
                           mode="single"
                           selected={checkOutDate}
                           onSelect={setCheckOutDate}
                           disabled={(date) =>
                             date <= (checkInDate || new Date()) ||
                             property.blockedDates.some(d => format(new Date(d), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
                           }
                           initialFocus
                         />
                       </PopoverContent>
                     </Popover>
                   </div>

                   {/* Message */}
                   <div>
                     <Label className="text-sm font-medium text-gray-700">Mensagem (opcional)</Label>
                     <Textarea
                       placeholder="Conte ao anfitrião sobre sua estadia..."
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
                         <span>{formatPrice(property.nightlyRate)} × {nights} noites</span>
                         <span>{formatPrice(property.nightlyRate * nights)}</span>
                       </div>
                       <div className="flex justify-between font-semibold text-lg border-t pt-2">
                         <span>Total</span>
                         <span>{formatPrice(totalPrice)}</span>
                       </div>
                     </div>
                   )}

                   <Button
                     onClick={handleBookingRequest}
                     disabled={!checkInDate || !checkOutDate || bookingLoading}
                     className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
                   >
                     {bookingLoading ? "Enviando Solicitação..." : "Solicitar Reserva"}
                   </Button>

                   <p className="text-xs text-gray-500 text-center">
                     Você não será cobrado ainda. O anfitrião revisará sua solicitação.
                   </p>
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>

         {/* Bloco 3 - Calendário de Disponibilidade */}
         <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
           <CardContent className="p-6">
             <h3 className="font-semibold text-lg text-gray-900 mb-4">Disponibilidade</h3>
             <div className="flex justify-center">
               <Calendar
                 mode="single"
                 className="rounded-md border"
                 disabled={(date) => 
                   property.blockedDates.some(d => format(new Date(d), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
                 }
               />
             </div>
             <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
               <div className="flex items-center space-x-2">
                 <div className="w-4 h-4 bg-gray-200 rounded"></div>
                 <span>Indisponível</span>
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-4 h-4 bg-white border rounded"></div>
                 <span>Disponível</span>
               </div>
             </div>
           </CardContent>
         </Card>

         {/* Bloco 4 - Avaliações */}
         <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
           <CardContent className="p-6">
             <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaliações</h2>
             
             <div className="flex items-center space-x-4 mb-6">
               <div className="flex items-center">
                 <Star className="h-6 w-6 fill-yellow-400 text-yellow-400 mr-2" />
                 <span className="text-2xl font-bold">4.8</span>
               </div>
               <span className="text-gray-600">24 avaliações</span>
             </div>

             <div className="space-y-6">
               <div className="border-b pb-6">
                 <div className="flex items-center space-x-3 mb-3">
                   <Avatar className="h-10 w-10">
                     <AvatarFallback className="bg-blue-500 text-white">M</AvatarFallback>
                   </Avatar>
                   <div>
                     <p className="font-medium text-gray-900">Maria Silva</p>
                     <div className="flex items-center">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                       ))}
                     </div>
                   </div>
                 </div>
                 <p className="text-gray-700">
                   Excelente propriedade! Muito limpa, bem localizada e o anfitrião foi super atencioso. 
                   Recomendo para quem busca conforto e praticidade.
                 </p>
               </div>

               <div className="border-b pb-6">
                 <div className="flex items-center space-x-3 mb-3">
                   <Avatar className="h-10 w-10">
                     <AvatarFallback className="bg-green-500 text-white">J</AvatarFallback>
                   </Avatar>
                   <div>
                     <p className="font-medium text-gray-900">João Santos</p>
                     <div className="flex items-center">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                       ))}
                     </div>
                   </div>
                 </div>
                 <p className="text-gray-700">
                   Perfeito para trabalho remoto. Internet excelente, espaço confortável e silencioso. 
                   Voltaria com certeza!
                 </p>
               </div>
             </div>
           </CardContent>
         </Card>
       </div>
     );
   }