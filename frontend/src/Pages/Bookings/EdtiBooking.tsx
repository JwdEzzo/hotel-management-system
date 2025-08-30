import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BookingRequest } from "../../types/requestTypes";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import z from "zod/v3";
import { useEffect } from "react";
import {
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
} from "@/api/bookingsApi";
import { useGetGuestsQuery } from "@/api/guestsApi"; // Adjust import paths as needed
import { useGetRoomsQuery } from "@/api/roomsApi";

const bookingSchema = z
  .object({
    checkInDateTime: z.string().min(1, "Check-in date and time is required"),
    checkOutDateTime: z.string().min(1, "Check-out date and time is required"),
    totalPrice: z.number().min(0.01, "Total price must be at least $0.01"),
    guestId: z.number().min(1, "Please select a guest"),
    roomId: z.number().min(1, "Please select a room"),
  })
  .refine(
    (data) => {
      const checkIn = new Date(data.checkInDateTime);
      const checkOut = new Date(data.checkOutDateTime);
      return checkOut > checkIn;
    },
    {
      message: "Check-out date must be after check-in date",
      path: ["checkOutDateTime"],
    }
  );

type BookingFormValues = z.infer<typeof bookingSchema>;

function EditBooking() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  // Fetch existing booking data
  const {
    data: booking,
    isLoading: isBookingLoading,
    isError: isBookingError,
    error: bookingError,
  } = useGetBookingByIdQuery(Number(bookingId), {
    skip: !bookingId, // Skip query if bookingId is not available
  });

  // Fetch guests and rooms for dropdowns
  const { data: guests = [], isLoading: isGuestsLoading } = useGetGuestsQuery();
  const { data: rooms = [], isLoading: isRoomsLoading } = useGetRoomsQuery();

  // Initialize update mutation
  const [updateBooking, { isLoading: isUpdating, isError, error }] =
    useUpdateBookingMutation();

  // Initialize form with react-hook-form and Zod resolver
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkInDateTime: "",
      checkOutDateTime: "",
      totalPrice: undefined,
      guestId: undefined,
      roomId: undefined,
    },
  });

  // Set form values once booking data is fetched
  useEffect(() => {
    if (booking) {
      form.reset({
        checkInDateTime: booking.checkInDateTime,
        checkOutDateTime: booking.checkOutDateTime,
        totalPrice:
          typeof booking.totalPrice === "string"
            ? parseFloat(booking.totalPrice)
            : booking.totalPrice,
        guestId: booking.guest.id,
        roomId: booking.room.id,
      });
    }
  }, [booking, form]);

  // Handle form submission
  async function handleFormSubmit(data: BookingFormValues) {
    if (!bookingId) return; // Safety check

    try {
      const bookingRequest: BookingRequest = {
        checkInDateTime: data.checkInDateTime,
        checkOutDateTime: data.checkOutDateTime,
        totalPrice: data.totalPrice,
        guestId: data.guestId,
        roomId: data.roomId,
      };

      await updateBooking({
        id: Number(bookingId),
        booking: bookingRequest,
      }).unwrap(); // Perform update
      navigate("/manager/bookingstable"); // Navigate back to bookings list on success
    } catch (error) {
      console.error("Error updating the booking:", error);
      // Error alert will be shown via isError and error state
    }
  }

  // Handle loading state
  if (isBookingLoading || isGuestsLoading || isRoomsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading booking details...</span>
      </div>
    );
  }

  // Handle error state for fetching booking
  if (isBookingError || !booking) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-4">
        <AlertDescription>
          {bookingError &&
          "data" in bookingError &&
          typeof bookingError.data === "string"
            ? bookingError.data
            : "Failed to load booking details. Please try again."}
        </AlertDescription>
        <div className="mt-2">
          <Button
            variant="outline"
            onClick={() => navigate("/manager/bookingstable")}
          >
            Back to Bookings
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="checkInDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-in Date & Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkOutDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-out Date & Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Price (USD)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-8"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                        disabled={isUpdating}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                    disabled={isUpdating}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a guest" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {guests.map((guest) => (
                        <SelectItem key={guest.id} value={guest.id.toString()}>
                          {guest.fullName} ({guest.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                    disabled={isUpdating}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          Room {room.roomNumber} - {room.roomType} (
                          {room.roomStatus})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Alert for Update */}
            {isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error && "data" in error && typeof error.data === "string"
                    ? error.data
                    : "Failed to update booking. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/manager/bookingstable")}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating booking...
                  </>
                ) : (
                  "Update Booking"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default EditBooking;
