// src/Pages/Guest/GuestDashboard.tsx
import React from "react";
import { useGuestAuth } from "@/hooks/useGuestAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogOut, Calendar, Loader2, AlertCircle } from "lucide-react"; // Import icons
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/store/store";
import { logout } from "@/auth/guestAuthSlice";
import { useGetBookingsByGuestEmailQuery } from "@/api/public/publicBookingsApi";
import type { BookingResponse } from "@/types/responseTypes"; // Import BookingResponse type

const GuestDashboard: React.FC = () => {
  const { user } = useGuestAuth();
  const {
    data: bookings = [],
    isLoading: isBookingsLoading,
    error: bookingsError,
    refetch, // Get refetch function in case of error
  } = useGetBookingsByGuestEmailQuery(user?.email || "", {
    skip: !user?.email, // Skip query if email is not available
  });

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  // Function to navigate to the update booking page using bookingReference
  // The path should match the one defined in your App.tsx for UpdateBooking component
  function navigateToUpdateBooking(bookingReference: string) {
    // Example path: /guest/bookings/{bookingReference}/update
    navigate(`/guest/bookings/${bookingReference}/update`);
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        {" "}
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Guest Dashboard</CardTitle>
          <CardDescription>
            Welcome, <span className="font-semibold">{user?.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-lg font-semibold text-primary">{user?.role}</p>
          </div>

          <Separator />

          {/* Bookings Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Your Bookings</h3>

            {isBookingsLoading ? (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>Loading your bookings...</span>
              </div>
            ) : bookingsError ? (
              <div className="flex flex-col items-center py-6 text-red-500">
                <AlertCircle className="h-10 w-10 mb-2" />
                <p className="mb-2">Failed to load bookings.</p>
                <Button variant="outline" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                You have no bookings yet.
              </p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: BookingResponse) => (
                  <Card key={booking.id} className="p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div>
                        {booking.room && (
                          <p className="text-sm">
                            <span className="font-medium">Room:</span>{" "}
                            {booking.room.roomNumber} ({booking.room.roomType})
                          </p>
                        )}
                        <p className="text-sm">
                          <span className="font-medium">Check-in:</span>{" "}
                          {new Date(
                            booking.checkInDateTime
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Check-out:</span>{" "}
                          {new Date(
                            booking.checkOutDateTime
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Total Price:</span> $
                          {typeof booking.totalPrice === "string"
                            ? parseFloat(booking.totalPrice).toFixed(2)
                            : booking.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          // Assuming the backend now includes bookingReference in BookingResponse
                          // If not, you'll need to fetch it or use ID differently.
                          // For now, let's assume bookingReference is in BookingResponse based on your types.
                          if (booking.bookingReference) {
                            navigateToUpdateBooking(booking.bookingReference);
                          } else {
                            // Fallback or alert if bookingReference is missing
                            alert(
                              "Booking reference not found. Cannot update."
                            );
                            console.error(
                              "Booking reference missing for booking ID:",
                              booking.id
                            );
                          }
                        }}
                        className="w-full md:w-auto"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Update Booking
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-center">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full md:w-auto text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestDashboard;
