// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { useNavigate, useParams } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import type { GuestRequest } from "../../types/requestTypes";

// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import z from "zod/v3";
// import { useEffect } from "react";
// import { useGetGuestByIdQuery, useUpdateGuestMutation } from "@/api/guestsApi";

// const guestSchema = z.object({
//   fullName: z.string().min(2, "Full name is required"),
//   email: z.string().email("Please enter a valid email address"),
//   phoneNumber: z.string().min(1, "Phone number is required"),
//   country: z.string().min(2, "Country is required"),
//   address: z.string().min(5, "Address is required"),
//   city: z.string().min(2, "City is required"),
// });

// type GuestFormValues = z.infer<typeof guestSchema>;

// function EditGuest() {
//   const { guestId } = useParams<{ guestId: string }>();
//   const navigate = useNavigate();

//   // Fetch existing guest data
//   const {
//     data: guest,
//     isLoading: isGuestLoading,
//     isError: isGuestError,
//     error: guestError,
//   } = useGetGuestByIdQuery(Number(guestId), {
//     skip: !guestId, // Skip query if guestId is not available
//   });

//   // Initialize update mutation
//   const [updateGuest, { isLoading: isUpdating, isError, error }] =
//     useUpdateGuestMutation();

//   // Initialize form with react-hook-form and Zod resolver
//   const form = useForm<GuestFormValues>({
//     resolver: zodResolver(guestSchema),
//     defaultValues: {
//       fullName: "",
//       email: "",
//       phoneNumber: "",
//       country: "",
//       address: "",
//       city: "",
//     },
//   });

//   // Set form values once guest data is fetched
//   useEffect(() => {
//     if (guest) {
//       form.reset({
//         fullName: guest.fullName,
//         email: guest.email,
//         phoneNumber: guest.phoneNumber,
//         country: guest.country,
//         address: guest.address,
//         city: guest.city,
//       });
//     }
//   }, [guest, form]);

//   // Handle form submission
//   async function handleFormSubmit(data: GuestFormValues) {
//     if (!guestId) return; // Safety check

//     try {
//       const guestRequest: GuestRequest = {
//         fullName: data.fullName,
//         email: data.email,
//         phoneNumber: data.phoneNumber,
//         country: data.country,
//         address: data.address,
//         city: data.city,
//       };

//       await updateGuest({
//         id: Number(guestId),
//         guest: guestRequest,
//       }).unwrap(); // Perform update
//       navigate("/manager/gueststable"); // Navigate back to guests list on success
//     } catch (error) {
//       console.error("Error updating the guest:", error);
//       // Error alert will be shown via isError and error state
//     }
//   }

//   // Handle loading state
//   if (isGuestLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <span className="ml-2">Loading guest details...</span>
//       </div>
//     );
//   }

//   // Handle error state for fetching guest
//   if (isGuestError || !guest) {
//     return (
//       <Alert variant="destructive" className="max-w-2xl mx-auto mt-4">
//         <AlertDescription>
//           {guestError &&
//           "data" in guestError &&
//           typeof guestError.data === "string"
//             ? guestError.data
//             : "Failed to load guest details. Please try again."}
//         </AlertDescription>
//         <div className="mt-2">
//           <Button
//             variant="outline"
//             onClick={() => navigate("/manager/gueststable")}
//           >
//             Back to Guests
//           </Button>
//         </div>
//       </Alert>
//     );
//   }

//   return (
//     <Card className="w-full max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle>Edit Guest</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleFormSubmit)}
//             className="space-y-6"
//           >
//             <FormField
//               control={form.control}
//               name="fullName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Full Name</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Enter full name"
//                       {...field}
//                       disabled={isUpdating}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="email"
//                       placeholder="Enter email address"
//                       {...field}
//                       disabled={isUpdating}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="phoneNumber"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone Number</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Enter phone number"
//                       {...field}
//                       disabled={isUpdating}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="country"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Country</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Enter country"
//                       {...field}
//                       disabled={isUpdating}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="address"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Address</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Enter address"
//                       {...field}
//                       disabled={isUpdating}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="city"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>City</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Enter city"
//                       {...field}
//                       disabled={isUpdating}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Error Alert for Update */}
//             {isError && (
//               <Alert variant="destructive">
//                 <AlertDescription>
//                   {error && "data" in error && typeof error.data === "string"
//                     ? error.data
//                     : "Failed to update guest. Please try again."}
//                 </AlertDescription>
//               </Alert>
//             )}

//             {/* Action Buttons */}
//             <div className="flex justify-between">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => navigate("/manager/gueststable")}
//                 disabled={isUpdating}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isUpdating}>
//                 {isUpdating ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Updating guest...
//                   </>
//                 ) : (
//                   "Update Guest"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }

// export default EditGuest;
