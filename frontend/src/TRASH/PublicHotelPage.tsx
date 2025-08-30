// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Loader2 } from "lucide-react";
// import type { HotelServiceResponse, RoomResponse } from "@/types/responseTypes";
// import { useGetPublicRoomsQuery } from "@/api/public/publicRoomsApi";
// import { useGetPublicHotelServicesQuery } from "@/api/public/publicHotelServiceApi";

// const PublicHotelPage = () => {
//   const navigate = useNavigate();
//   const {
//     data: roomsData,
//     isLoading: roomsLoading,
//     error: roomsError,
//   } = useGetPublicRoomsQuery();
//   const {
//     data: servicesData,
//     isLoading: servicesLoading,
//     error: servicesError,
//   } = useGetPublicHotelServicesQuery();

//   const handleBookNow = () => {
//     // Navigate to the first step of booking: Guest Information
//     navigate("/applybooking");
//   };

//   // Simple placeholder image functions for testing
//   const getPlaceholderImageUrl = (room: RoomResponse) => {
//     const seed = room.roomNumber || room.id;
//     return `https://picsum.photos/seed/${seed}/400/300`;
//   };

//   const getServiceImageUrl = (service: HotelServiceResponse) => {
//     const seed = service.id || service.name;
//     return `https://picsum.photos/seed/${seed}/400/300`;
//   };

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold mb-4">Welcome to Our Hotel</h1>
//         <p className="text-lg text-muted-foreground mb-6">
//           Experience luxury and comfort in our beautifully appointed rooms and
//           enjoy our premium services.
//         </p>
//         <Button size="lg" onClick={handleBookNow} className="animate-pulse">
//           Apply a Booking
//         </Button>
//       </div>

//       {/* Rooms Section */}
//       <section className="mb-16">
//         <h2 className="text-3xl font-semibold mb-6 text-center">Our Rooms</h2>
//         {roomsLoading && (
//           <div className="flex justify-center items-center py-10">
//             <Loader2 className="mr-2 h-6 w-6 animate-spin" />
//             <span>Loading Rooms...</span>
//           </div>
//         )}
//         {roomsError && (
//           <div className="text-center py-10 text-red-500">
//             Error loading rooms. Please try again later.
//           </div>
//         )}
//         {roomsData && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {roomsData.map((room: RoomResponse) => (
//               <Card key={room.id} className="flex flex-col">
//                 {/* Image Section */}
//                 <div className="aspect-video w-full overflow-hidden rounded-t-md">
//                   <img
//                     src={getPlaceholderImageUrl(room)}
//                     alt={`Image of Room ${room.roomNumber}`}
//                     className="h-full w-full object-cover transition-all hover:scale-105"
//                     onError={(e) => {
//                       // Fallback if image fails to load
//                       e.currentTarget.src = `https://via.placeholder.com/400x300/f0f0f0/666?text=Room+${room.roomNumber}`;
//                     }}
//                   />
//                 </div>
//                 <CardHeader>
//                   <CardTitle className="flex justify-between items-center">
//                     <span>Room {room.roomNumber}</span>
//                     <Badge
//                       variant={
//                         room.roomStatus === "AVAILABLE"
//                           ? "default"
//                           : "secondary"
//                       }
//                     >
//                       {room.roomStatus}
//                     </Badge>
//                   </CardTitle>
//                   <p className="text-sm text-muted-foreground">
//                     {room.roomType}
//                   </p>
//                 </CardHeader>
//               </Card>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Services Section */}
//       <section>
//         <h2 className="text-3xl font-semibold mb-6 text-center">
//           Our Services
//         </h2>
//         {servicesLoading && (
//           <div className="flex justify-center items-center py-10">
//             <Loader2 className="mr-2 h-6 w-6 animate-spin" />
//             <span>Loading Services...</span>
//           </div>
//         )}
//         {servicesError && (
//           <div className="text-center py-10 text-red-500">
//             Error loading services. Please try again later.
//           </div>
//         )}
//         {servicesData && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {servicesData.map((service: HotelServiceResponse) => (
//               <Card key={service.id} className="flex flex-col">
//                 {/* Image Section */}
//                 <div className="aspect-video w-full overflow-hidden rounded-t-md">
//                   <img
//                     src={getServiceImageUrl(service)}
//                     alt={`Image of ${service.name}`}
//                     className="h-full w-full object-cover transition-all hover:scale-105"
//                     onError={(e) => {
//                       // Fallback if image fails to load
//                       e.currentTarget.src = `https://via.placeholder.com/400x300/f0f0f0/666?text=${encodeURIComponent(
//                         service.name
//                       )}`;
//                     }}
//                   />
//                 </div>
//                 <CardHeader>
//                   <CardTitle>{service.name}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex-grow">
//                   <p className="mb-2">
//                     <strong>Price:</strong> ${service.price?.toFixed(2)}
//                   </p>
//                   <p className="mb-2">
//                     <strong>Duration:</strong> {service.duration}
//                   </p>
//                   <p>
//                     <strong>Description:</strong>{" "}
//                     {service.name || "Enhance your stay with this service."}
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default PublicHotelPage;
