// import { useCreateGuestMutation } from "@/api/guestsApi";
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
// import type { GuestRequest } from "@/types/requestTypes";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2 } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import z from "zod/v3";

// const guestSchema = z.object({
//   fullName: z.string().min(3, "Guest name is required"),
//   email: z.string().email("Invalid email address"),
//   phoneNumber: z.string().min(10, "Phone number is required"),
//   country: z.string().min(2, "Country is required"),
//   address: z.string().min(5, "Address is required"),
//   city: z.string().min(2, "City is required"),
// });

// type GuestValues = z.infer<typeof guestSchema>;

// function CreateHotelService() {
//   //
//   const navigate = useNavigate();
//   const [createGuest, { isLoading, isError, error }] = useCreateGuestMutation();

//   const form = useForm<GuestValues>({
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

//   async function handleFormSubmit(data: GuestValues) {
//     try {
//       const guestRequest: GuestRequest = {
//         fullName: data.fullName,
//         email: data.email,
//         phoneNumber: data.phoneNumber,
//         country: data.country,
//         address: data.address,
//         city: data.city,
//       };
//       await createGuest(guestRequest).unwrap();
//       form.reset();
//       navigate("/manager/gueststable");
//     } catch (error) {
//       console.log("Error creating the guest", error);
//       alert("Error creating guest");
//     }
//   }

//   return (
//     <div>
//       <Card className="w-full mx-auto max-w-2xl">
//         <CardHeader>
//           <CardTitle>Create Guest</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleFormSubmit)}
//               className="space-y-6"
//             >
//               <FormField
//                 control={form.control}
//                 name="fullName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Name</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter the guest's name"
//                         {...field}
//                         disabled={isLoading}
//                         //
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter the guest's email"
//                         {...field}
//                         disabled={isLoading}
//                         //
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="phoneNumber"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Phone Number</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter the phone number"
//                         {...field}
//                         disabled={isLoading}
//                         //
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="country"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Country</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter the country"
//                         {...field}
//                         disabled={isLoading}
//                         //
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="city"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>City</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter the city"
//                         {...field}
//                         disabled={isLoading}
//                         //
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="address"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Address</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter the address"
//                         {...field}
//                         disabled={isLoading}
//                         //
//                       />
//                     </FormControl>
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
//                         return "Failed to create room. Please try again.";
//                       if (
//                         "message" in error &&
//                         typeof error.message === "string"
//                       ) {
//                         return error.message;
//                       }
//                       if ("data" in error && typeof error.data === "string") {
//                         return error.data;
//                       }
//                       return "Failed to create room. Please try again.";
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
//                       Creating Guest...
//                     </>
//                   ) : (
//                     "Create Guest"
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

// export default CreateHotelService;
