import React, { useEffect, useState } from "react";
import { useGuestAuth } from "@/hooks/useGuestAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LogOut,
  Calendar,
  Loader2,
  AlertCircle,
  User,
  CreditCard,
  Bell,
  HelpCircle,
  Home,
  Trash2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/store/store";
import { logout } from "@/auth/guestAuthSlice";
import {
  useDeleteBookingByBookingReferenceMutation,
  useGetBookingsByGuestEmailQuery,
} from "@/api/public/publicBookingsApi";
import type { BookingResponse } from "@/types/responseTypes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Hotel } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useCreateComplaintMutation } from "@/api/complaintApi";
import z from "zod/v3";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ComplaintRequest } from "@/types/requestTypes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const complaintSchema = z.object({
  guestEmail: z
    .string()
    .email("Invalid email address")
    .refine(
      (email) =>
        email.endsWith("@hotmail.com") ||
        email.endsWith("@outlook.com") ||
        email.endsWith("@gmail.com"),
      {
        message: "Email must be a Hotmail, Outlook, or Gmail address",
      }
    ),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
});

type ComplaintValues = z.infer<typeof complaintSchema>;

function GuestDashboard() {
  const { user } = useGuestAuth();
  const {
    data: bookings = [],
    isLoading: isBookingsLoading,
    error: bookingsError,
    refetch,
  } = useGetBookingsByGuestEmailQuery(user?.email || "", {
    skip: !user?.email,
  });

  const [deleteBooking, { isLoading: isDeleting }] =
    useDeleteBookingByBookingReferenceMutation();

  const [createComplaint, { isLoading: isCreatingComplaint }] =
    useCreateComplaintMutation();

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  const form = useForm<ComplaintValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      guestEmail: user?.email || "",
      title: "",
      message: "",
    },
  });

  function navigateToUpdateBooking(bookingReference: string) {
    navigate(`/guest/bookings/${bookingReference}/update`);
  }

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }

  useEffect(() => {
    refetch();
  }, []);

  async function handleDeleteBooking(booking: BookingResponse) {
    if (
      window.confirm(
        `Are you sure you want to cancel booking ${booking.bookingReference}? This action cannot be undone.`
      )
    ) {
      try {
        await deleteBooking(booking.bookingReference).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete booking:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    }
  }

  async function handleCreateComplaint(data: ComplaintValues) {
    try {
      const complaintRequest: ComplaintRequest = {
        guestEmail: data.guestEmail,
        title: data.title,
        message: data.message,
      };
      await createComplaint(complaintRequest).unwrap();
      form.reset();
      alert("Complaint has been filed");
      setActiveSection("dashboard");
    } catch (error) {
      console.log("Error creating the complaint", error);
      alert("Error creating complaint");
    }
  }

  // Menu items for the sidebar
  const menuItems = [
    {
      title: "Dashboard",
      url: "#",
      icon: Home,
      onClick: () => setActiveSection("dashboard"),
    },
  ];

  const additionalItems = [
    {
      title: "Help",
      url: "#",
      icon: HelpCircle,
      onClick: () => setActiveSection("help"),
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gray-100 flex dark:bg-black">
        {/* Sidebar */}
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-xl font-bold flex items-center gap-2">
                  <Hotel className="h-6 w-6" />
                  <span>Beirut Hotel</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    {menuItems.map((item) => (
                      <SidebarMenuButton
                        key={item.title}
                        onClick={item.onClick}
                        isActive={activeSection === item.title.toLowerCase()}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    ))}
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Additional</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {additionalItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={item.onClick}
                        isActive={activeSection === item.title.toLowerCase()}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <User className="h-4 w-4" />
                      <span>{user?.email || "Guest"}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top">
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 min-w-0 flex flex-col dark:bg-black">
          {/* Header */}
          <header className="dark:bg-black border-b px-6 py-4 shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeSection === "dashboard"
                  ? "Guest Dashboard"
                  : "File a Complaint"}
              </h1>
              <div className="flex items-center space-x-4">
                <ModeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden md:inline">{user?.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {activeSection === "dashboard" && (
              <div className="w-full">
                <div className="mb-8">
                  <p className="text-muted-foreground">
                    Welcome back,{" "}
                    <span className="font-semibold">{user?.email}</span>
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Total Bookings
                          </p>
                          <p className="text-2xl font-bold">
                            {bookings.length}
                          </p>
                        </div>
                        <Calendar className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Upcoming Stays
                          </p>
                          <p className="text-2xl font-bold">
                            {
                              bookings.filter(
                                (booking) =>
                                  new Date(booking.checkInDateTime) > new Date()
                              ).length
                            }
                          </p>
                        </div>
                        <Bell className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Total Spent
                          </p>
                          <p className="text-2xl font-bold">
                            $
                            {bookings
                              .reduce((total, booking) => {
                                const price =
                                  typeof booking.totalPrice === "string"
                                    ? parseFloat(booking.totalPrice)
                                    : booking.totalPrice;
                                return total + (price || 0);
                              }, 0)
                              .toFixed(2)}
                          </p>
                        </div>
                        <CreditCard className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bookings Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Bookings</CardTitle>
                    <CardDescription>
                      Manage your current and past reservations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isBookingsLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                        <span>Loading your bookings...</span>
                      </div>
                    ) : bookingsError ? (
                      <div className="flex flex-col items-center py-12 text-red-500">
                        <AlertCircle className="h-12 w-12 mb-4" />
                        <p className="mb-4 text-lg">Failed to load bookings.</p>
                        <Button variant="outline" onClick={() => refetch()}>
                          Retry
                        </Button>
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No bookings yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't made any bookings. Get started by booking
                          a room.
                        </p>
                        <Button onClick={() => navigate("/book")}>
                          Book a Room
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking: BookingResponse) => (
                          <Card
                            key={booking.id}
                            className="hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                                    {booking.room && (
                                      <div className="flex items-center">
                                        <Hotel className="h-4 w-4 text-muted-foreground mr-2" />
                                        <span className="font-medium">
                                          Room {booking.room.roomNumber}
                                        </span>
                                        <span className="mx-2 text-muted-foreground">
                                          •
                                        </span>
                                        <span className="text-muted-foreground">
                                          {booking.room.roomType}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex items-center">
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          new Date(booking.checkInDateTime) >
                                          new Date()
                                            ? "bg-blue-100 text-blue-800"
                                            : new Date(
                                                booking.checkOutDateTime
                                              ) < new Date()
                                            ? "bg-gray-100 text-red-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        {new Date(booking.checkInDateTime) >
                                        new Date()
                                          ? "Upcoming"
                                          : new Date(booking.checkOutDateTime) <
                                            new Date()
                                          ? "Completed"
                                          : "Active"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                                    <div>
                                      <span className="font-medium">
                                        Check-in:
                                      </span>{" "}
                                      {new Date(
                                        booking.checkInDateTime
                                      ).toLocaleDateString()}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Check-out:
                                      </span>{" "}
                                      {new Date(
                                        booking.checkOutDateTime
                                      ).toLocaleDateString()}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Total:
                                      </span>{" "}
                                      $
                                      {typeof booking.totalPrice === "string"
                                        ? parseFloat(
                                            booking.totalPrice
                                          ).toFixed(2)
                                        : booking.totalPrice.toFixed(2)}
                                    </div>
                                  </div>

                                  {booking.additionalGuestNames &&
                                    booking.additionalGuestNames.length > 0 && (
                                      <div className="mt-2 text-sm text-muted-foreground">
                                        <span className="font-medium">
                                          Guests:
                                        </span>{" "}
                                        {1 +
                                          booking.additionalGuestNames.length}
                                      </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                  <Button
                                    onClick={() => {
                                      if (booking.bookingReference) {
                                        navigateToUpdateBooking(
                                          booking.bookingReference
                                        );
                                      } else {
                                        alert(
                                          "Booking reference not found. Cannot update."
                                        );
                                        console.error(
                                          "Booking reference missing for booking ID:",
                                          booking.id
                                        );
                                      }
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="whitespace-nowrap"
                                    disabled={
                                      Date.now() >
                                      new Date(
                                        booking.checkOutDateTime
                                      ).getTime()
                                    }
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Update
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteBooking(booking)}
                                    size="sm"
                                    disabled={
                                      isDeleting ||
                                      Date.now() >
                                        new Date(
                                          booking.checkOutDateTime
                                        ).getTime()
                                    }
                                  >
                                    {isDeleting ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="mr-2 h-4 w-4" />
                                    )}
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "help" && (
              <div>
                <Card className="w-full mx-auto max-w-2xl">
                  <CardHeader>
                    <CardTitle>Create Complaint</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleCreateComplaint)}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="guestEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your ID"
                                  {...field}
                                  disabled={isCreatingComplaint}
                                  //
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your complaint's title"
                                  {...field}
                                  disabled={isCreatingComplaint}
                                  //
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter your complaint's message"
                                  {...field}
                                  disabled={isCreatingComplaint}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Submit Button */}
                        <div>
                          <Button
                            type="submit"
                            disabled={isCreatingComplaint}
                            className="w-1/2"
                          >
                            {isCreatingComplaint ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Complaint...
                              </>
                            ) : (
                              "Send Complaint"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default GuestDashboard;
