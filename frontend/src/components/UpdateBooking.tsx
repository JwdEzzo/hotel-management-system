import { useGetPublicHotelServicesQuery } from "@/api/public/publicHotelServiceApi";
import { useGetAvailableRoomsQuery } from "@/api/public/publicRoomsApi";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod/v3";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateBookingRequest } from "@/types/requestTypes";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { useEffect } from "react";
import {
  useGetBookingEntityByReferenceQuery,
  useGetUpdateBookingResponseByReferenceQuery,
  useUpdateBooking2Mutation,
} from "@/api/updateBookingApi";
import { ServicePricingType } from "@/types/enums";

const updateBookingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  country: z.string().min(2, "Country is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  selectedRoomId: z.number().min(1, "Please select a room"),
  selectedServiceIds: z.array(z.number()).optional(),
  serviceQuantities: z.record(z.number()).optional(),
  additionalGuestNames: z
    .array(
      z.object({
        name: z.string().min(1, "Guest name is required"),
      })
    )
    .optional(),
});

type UpdateBookingValues = z.infer<typeof updateBookingSchema>;

interface UpdateBookingProps {
  initialData?: {
    fullName: string;
    email: string;
    phoneNumber: string;
    country: string;
    address: string;
    city: string;
    checkInDateTime: string;
    checkOutDateTime: string;
    roomId: number;
    hotelServiceIds?: number[];
    additionalGuestNames?: string[];
    serviceQuantities?: { [key: number]: number };
  };
}

function UpdateBooking({ initialData }: UpdateBookingProps) {
  const navigate = useNavigate();
  const { bookingReference } = useParams<{ bookingReference: string }>();
  const [updateBooking2, { isLoading: isUpdating }] =
    useUpdateBooking2Mutation();

  const today = new Date().toISOString().split("T")[0];

  const { data: services = [], isLoading: isServicesLoading } =
    useGetPublicHotelServicesQuery();

  const {
    data: existingUpdateBookingResponse,
    isLoading: isUpdateBookingResponseLoading,
  } = useGetUpdateBookingResponseByReferenceQuery(
    { bookingReference: bookingReference! },
    {
      skip: !bookingReference,
    }
  );

  const { data: existingBooking, isLoading: isExistingBookingLoading } =
    useGetBookingEntityByReferenceQuery(
      { bookingReference: bookingReference! },
      {
        skip: !bookingReference,
      }
    );

  const form = useForm<UpdateBookingValues>({
    resolver: zodResolver(updateBookingSchema),
    defaultValues: {
      fullName: existingBooking?.guest?.fullName || "",
      email: existingBooking?.guest?.email || "",
      phoneNumber: existingBooking?.guest?.phoneNumber || "",
      password: "",
      country: existingBooking?.guest?.country || "",
      address: existingBooking?.guest?.address || "",
      city: existingBooking?.guest?.city || "",
      checkInDate: existingBooking?.checkInDateTime || today,
      checkOutDate: existingBooking?.checkOutDateTime || today,
      selectedRoomId: existingBooking?.room?.id || 0,
      selectedServiceIds:
        existingUpdateBookingResponse?.hotelServings?.map(
          (service) => service.id
        ) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "additionalGuestNames",
  });

  // Populate form with existing booking data when it loads
  useEffect(() => {
    if (existingBooking && existingUpdateBookingResponse) {
      const bookingData = {
        fullName: existingBooking.guest?.fullName || "",
        email: existingBooking.guest?.email || "",
        password: "",
        phoneNumber: existingBooking.guest?.phoneNumber || "",
        country: existingBooking.guest?.country || "",
        address: existingBooking.guest?.address || "",
        city: existingBooking.guest?.city || "",
        checkInDate: existingBooking.checkInDateTime
          ? new Date(existingBooking.checkInDateTime).toISOString().slice(0, 16)
          : "",
        checkOutDate: existingBooking.checkOutDateTime
          ? new Date(existingBooking.checkOutDateTime)
              .toISOString()
              .slice(0, 16)
          : "",
        selectedRoomId: existingBooking.room?.id || 0,
        selectedServiceIds:
          existingUpdateBookingResponse.hotelServings?.map(
            (service) => service.id
          ) || [],
        serviceQuantities:
          existingUpdateBookingResponse.serviceQuantities || {},
        additionalGuestNames: (
          existingUpdateBookingResponse.additionalGuests || []
        ).map((name) => ({ name })),
      };

      // Reset form with existing data
      form.reset(bookingData);
    }
  }, [existingBooking, existingUpdateBookingResponse, form]);

  // Set email from URL params if available
  useEffect(() => {
    if (initialData?.email && !form.getValues("email")) {
      form.setValue("email", initialData.email);
    }
  }, [initialData, form]);

  // Watch form values - same pattern as ApplyBooking
  const checkInDate = form.watch("checkInDate");
  const checkOutDate = form.watch("checkOutDate");
  const selectedRoomId = form.watch("selectedRoomId");
  const selectedServiceIds = form.watch("selectedServiceIds");
  const serviceQuantities = form.watch("serviceQuantities");

  // Calculate number of nights - same as ApplyBooking
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const numberOfNights = calculateNights();

  // Only fetch available rooms when both dates are selected and valid
  const shouldFetchRooms =
    checkInDate && checkOutDate && checkOutDate > checkInDate;

  const { data: availableRooms = [], isLoading: isRoomsLoading } =
    useGetAvailableRoomsQuery(
      {
        checkIn: checkInDate,
        checkOut: checkOutDate,
      },
      {
        skip: !shouldFetchRooms,
      }
    );

  // Get selected room details for occupancy validation - same as ApplyBooking
  const selectedRoom = availableRooms.find(
    (room) => room.id === selectedRoomId
  );
  const maxOccupancy = selectedRoom?.maxOccupancy || 1;
  const totalGuests = 1 + (form.watch("additionalGuestNames")?.length || 0);

  // Check if we can add more guests
  const canAddMoreGuests = totalGuests < maxOccupancy;

  // Helper function to get max quantity for PER_NIGHT services - same as ApplyBooking
  const getMaxQuantityForService = (service: any) => {
    if (service.pricingType === ServicePricingType.PER_NIGHT) {
      return numberOfNights;
    }
    return 99;
  };

  async function handleFormSubmit(data: UpdateBookingValues) {
    if (!bookingReference) {
      alert("Booking reference is missing. Cannot update booking.");
      return;
    }

    if (!bookingReference.trim()) {
      alert("Booking reference is invalid. Cannot update booking.");
      return;
    }

    try {
      // Validate PER_NIGHT service quantities - same as ApplyBooking
      const perNightServices = services.filter(
        (service) => service.pricingType === ServicePricingType.PER_NIGHT
      );

      for (const service of perNightServices) {
        const quantity = data.serviceQuantities?.[service.id] || 0;
        if (quantity > numberOfNights) {
          alert(
            `Cannot order ${quantity} ${service.name} - maximum is ${numberOfNights} (number of nights booked)`
          );
          return;
        }
      }

      const addThreeHours = (dateString: string) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 3);
        return date.toISOString();
      };

      // Extract just the names from the additional guests array - same as ApplyBooking
      const additionalGuestNames =
        data.additionalGuestNames?.map((guest) => guest.name) || [];

      const updateBookingRequest: UpdateBookingRequest = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        country: data.country,
        address: data.address,
        city: data.city,
        checkInDateTime: addThreeHours(data.checkInDate),
        checkOutDateTime: addThreeHours(data.checkOutDate),
        roomId: data.selectedRoomId,
        hotelServiceIds: data.selectedServiceIds,
        serviceQuantities: data.serviceQuantities,
        additionalGuestNames: additionalGuestNames,
      };

      const checkInDateObj = new Date(data.checkInDate);
      const checkOutDateObj = new Date(data.checkOutDate);

      if (checkOutDateObj <= checkInDateObj) {
        alert("Check-out date must be after check-in date");
        return;
      }

      // Validate occupancy - same as ApplyBooking
      if (totalGuests > maxOccupancy) {
        alert(
          `This room can accommodate a maximum of ${maxOccupancy} guests. You have ${totalGuests} guests.`
        );
        return;
      }

      await updateBooking2({
        bookingReference: bookingReference,
        ...updateBookingRequest,
      }).unwrap();

      alert("Booking updated successfully!");
      navigate("/my-bookings");
    } catch (error) {
      console.log("Error updating the booking", error);
      alert("Error updating booking");
    }
  }

  // Handle service selection - same logic as ApplyBooking
  const handleServiceSelection = (serviceId: number, checked: boolean) => {
    const currentSelectedIds = form.getValues("selectedServiceIds") || [];
    const currentQuantities = form.getValues("serviceQuantities") || {};

    if (checked) {
      form.setValue("selectedServiceIds", [...currentSelectedIds, serviceId]);
      form.setValue("serviceQuantities", {
        ...currentQuantities,
        [serviceId]: 1,
      });
    } else {
      form.setValue(
        "selectedServiceIds",
        currentSelectedIds.filter((id) => id !== serviceId)
      );
      const newQuantities = { ...currentQuantities };
      delete newQuantities[serviceId];
      form.setValue("serviceQuantities", newQuantities);
    }
  };

  // Handle quantity change - same logic as ApplyBooking
  const handleQuantityChange = (serviceId: number, quantity: number) => {
    const currentQuantities = form.getValues("serviceQuantities") || {};
    const service = services.find((s) => s.id === serviceId);

    let maxQuantity = 99;
    if (service?.pricingType === ServicePricingType.PER_NIGHT) {
      maxQuantity = numberOfNights;
    }

    const validatedQuantity = Math.max(1, Math.min(quantity, maxQuantity));

    form.setValue("serviceQuantities", {
      ...currentQuantities,
      [serviceId]: validatedQuantity,
    });
  };

  // Loading states - same as ApplyBooking
  if (
    isServicesLoading ||
    isExistingBookingLoading ||
    isUpdateBookingResponseLoading
  ) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading form data...</span>
      </div>
    );
  }

  return (
    <div>
      <Card className="w-full mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Update Booking</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {/* Personal Information - same as ApplyBooking but without password */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Primary Guest Information
                </h3>

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          disabled={isServicesLoading || isUpdating}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          disabled={isServicesLoading || isUpdating}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password for further confirmation"
                          disabled={isServicesLoading || isUpdating}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your phone number"
                          disabled={isServicesLoading || isUpdating}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your country"
                          disabled={isServicesLoading || isUpdating}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your Address"
                          disabled={isServicesLoading || isUpdating}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your City"
                          disabled={isServicesLoading || isUpdating}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Booking Dates - same as ApplyBooking */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Booking Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="checkInDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-in Date *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            min={today}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              form.setValue("selectedRoomId", 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkOutDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-out Date *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            min={form.watch("checkInDate") || today}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              form.setValue("selectedRoomId", 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Room Selection - same as ApplyBooking */}
              <FormField
                control={form.control}
                name="selectedRoomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Selection *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                        form.setValue("additionalGuestNames", []);
                      }}
                      value={field.value ? field.value.toString() : ""}
                      disabled={!shouldFetchRooms || isRoomsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              !shouldFetchRooms
                                ? "Please select check-in and check-out dates first"
                                : isRoomsLoading
                                ? "Loading available rooms..."
                                : availableRooms.length === 0
                                ? "No rooms available for selected dates"
                                : "Select a room"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRooms.length === 0 &&
                        shouldFetchRooms &&
                        !isRoomsLoading ? (
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            No rooms available for selected dates
                          </div>
                        ) : (
                          availableRooms.map((room) => (
                            <SelectItem
                              key={room.id}
                              value={room.id.toString()}
                            >
                              Room {room.roomNumber} - {room.roomType} - $
                              {room.pricePerNight}/night (Max{" "}
                              {room.maxOccupancy} guests)
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional Guests Section - same as ApplyBooking */}
              {selectedRoom && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Additional Guests</h3>
                    <div className="text-sm text-muted-foreground">
                      {totalGuests}/{maxOccupancy} guests
                    </div>
                  </div>

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-end">
                        <FormField
                          control={form.control}
                          name={`additionalGuestNames.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Guest {index + 2} Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter guest name"
                                  disabled={isUpdating}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={isUpdating}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {canAddMoreGuests && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ name: "" })}
                        disabled={isUpdating}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Guest ({totalGuests}/{maxOccupancy})
                      </Button>
                    )}

                    {!canAddMoreGuests && maxOccupancy > 1 && (
                      <p className="text-sm text-muted-foreground">
                        Maximum occupancy reached for this room type.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Hotel Services with Quantities - exactly like ApplyBooking */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Hotel Services (Optional)
                </h3>
                {numberOfNights > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Booking duration: {numberOfNights} night
                    {numberOfNights !== 1 ? "s" : ""}
                  </p>
                )}
                <div className="border rounded-md p-4 space-y-3 max-h-96 overflow-y-auto">
                  {services && services.length > 0 ? (
                    services.map((service) => {
                      const isSelected = selectedServiceIds?.includes(
                        service.id
                      );
                      const quantity = serviceQuantities?.[service.id] || 1;
                      const maxQuantity = getMaxQuantityForService(service);
                      const isPerNight =
                        service.pricingType === ServicePricingType.PER_NIGHT;

                      return (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-2 border-b last:border-b-0"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleServiceSelection(
                                  service.id,
                                  checked as boolean
                                )
                              }
                              disabled={
                                isUpdating ||
                                (isPerNight && numberOfNights === 0)
                              }
                            />
                            <div className="flex-1">
                              <label className="text-sm font-medium cursor-pointer">
                                {service.name} - ${service.price}
                                {service.duration && ` (${service.duration})`}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {service.pricingType ===
                                  ServicePricingType.PER_ORDER && "Per order"}
                                {service.pricingType ===
                                  ServicePricingType.PER_HOUR && "Per hour"}
                                {service.pricingType ===
                                  ServicePricingType.PER_NIGHT && "Per night"}
                                {isPerNight &&
                                  numberOfNights > 0 &&
                                  ` (max: ${numberOfNights})`}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="flex items-center space-x-2">
                              <label className="text-sm text-muted-foreground">
                                Qty:
                              </label>
                              <Input
                                type="number"
                                min="1"
                                max={maxQuantity}
                                value={quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    service.id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-16 h-8 text-sm"
                                disabled={isUpdating}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground">
                      No hotel services available at the moment.
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button - same as ApplyBooking */}
              <div>
                <Button
                  type="submit"
                  disabled={
                    !shouldFetchRooms ||
                    isRoomsLoading ||
                    isUpdating ||
                    availableRooms.length === 0
                  }
                  className="w-1/2"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Booking...
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
    </div>
  );
}

export default UpdateBooking;
