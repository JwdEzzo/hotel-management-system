// import { useCreateBookingMutation } from "@/api/bookingsApi";
// import { useGetGuestsQuery } from "@/api/guestsApi";
// import { useGetRoomsQuery } from "@/api/roomsApi";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import type { BookingRequest } from "@/types/requestTypes";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2 } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import z from "zod/v3";

// const bookingSchema = z.object({
//   checkInDateTime: z.string().min(1, "Check-in date and time is required"),
//   checkOutDateTime: z.string().min(1, "Check-out date and time is required"),
//   totalPrice: z.coerce.number().min(0, "Total price must be greater than 0"),
//   guestId: z.coerce.number().min(1, "Guest is required"),
//   roomId: z.coerce.number().min(1, "Room is required"),
// });

// type BookingValues = z.infer<typeof bookingSchema>;

// function CreateBooking() {
//   const navigate = useNavigate();
//   const [createBooking, { isLoading, isError, error }] =
//     useCreateBookingMutation();

//   // Fetch guests and rooms for dropdowns
//   const { data: guests = [], isLoading: isLoadingGuests } = useGetGuestsQuery();
//   const { data: rooms = [], isLoading: isLoadingRooms } = useGetRoomsQuery();

//   const form = useForm<BookingValues>({
//     resolver: zodResolver(bookingSchema),
//     defaultValues: {
//       checkInDateTime: "",
//       checkOutDateTime: "",
//       totalPrice: 0,
//       guestId: undefined,
//       roomId: undefined,
//     },
//   });

//   async function handleFormSubmit(data: BookingValues) {
//     try {
//       const bookingRequest: BookingRequest = {
//         checkInDateTime: data.checkInDateTime,
//         checkOutDateTime: data.checkOutDateTime,
//         totalPrice: data.totalPrice,
//         guestId: data.guestId,
//         roomId: data.roomId,
//       };
//       await createBooking(bookingRequest).unwrap();
//       form.reset();
//       navigate("/manager/bookingstable");
//     } catch (error) {
//       console.log("Error creating the booking", error);
//       alert("Error creating booking");
//     }
//   }

//   return (
//     <div>
//       <Card className="w-full mx-auto max-w-2xl">
//         <CardHeader>
//           <CardTitle>Create Booking</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleFormSubmit)}
//               className="space-y-6"
//             >
//               <FormField
//                 control={form.control}
//                 name="checkInDateTime"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Check-In Date & Time</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="datetime-local"
//                         {...field}
//                         disabled={isLoading}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="checkOutDateTime"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Check-Out Date & Time</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="datetime-local"
//                         {...field}
//                         disabled={isLoading}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="totalPrice"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Total Price</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         step="50"
//                         min="50"
//                         placeholder="Enter the total price"
//                         {...field}
//                         disabled={isLoading}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="guestId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Guest</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value?.toString()}
//                       disabled={isLoading || isLoadingGuests}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a guest" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {guests.map((guest) => (
//                           <SelectItem
//                             key={guest.id}
//                             value={guest.id.toString()}
//                           >
//                             {guest.fullName} - {guest.email}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="roomId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Room</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value?.toString()}
//                       disabled={isLoading || isLoadingRooms}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a room" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {rooms.map((room) => (
//                           <SelectItem key={room.id} value={room.id.toString()}>
//                             Room {room.roomNumber} - {room.roomType} (
//                             {room.roomStatus})
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Error Alert */}
//               {isError && (
//                 <Alert variant="destructive">
//                   <AlertDescription>
//                     {(() => {
//                       if (!error)
//                         return "Failed to create booking. Please try again.";
//                       if (
//                         "message" in error &&
//                         typeof error.message === "string"
//                       ) {
//                         return error.message;
//                       }
//                       if ("data" in error && typeof error.data === "string") {
//                         return error.data;
//                       }
//                       return "Failed to create booking. Please try again.";
//                     })()}
//                   </AlertDescription>
//                 </Alert>
//               )}

//               {/* Submit Button */}
//               <div>
//                 <Button type="submit" disabled={isLoading} className="w-1/2">
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Creating Booking...
//                     </>
//                   ) : (
//                     "Create Booking"
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default CreateBooking;
