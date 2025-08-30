import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import type { HotelServiceResponse, RoomResponse } from "@/types/responseTypes";
import { useNavigate } from "react-router-dom";
import { useGetPublicRoomsQuery } from "@/api/public/publicRoomsApi";
import { useGetPublicHotelServicesQuery } from "@/api/public/publicHotelServiceApi";
import Navbar from "@/components/Navbar";

interface PublicHotelPage2Props {
  tagline?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

function PublicHotelPage2({
  tagline,
  heading,
  description,
  buttonText,
  buttonUrl,
}: PublicHotelPage2Props) {
  const navigate = useNavigate();
  const {
    data: roomsData,
    isLoading: roomsLoading,
    error: roomsError,
  } = useGetPublicRoomsQuery();
  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useGetPublicHotelServicesQuery();

  const handleBookNow = () => {
    // Navigate to the first step of booking: Guest Information
    navigate("/applybooking");
  };

  // Simple placeholder image functions for testing
  const getPlaceholderImageUrl = (room: RoomResponse) => {
    const seed = room.roomNumber || room.id;
    return `https://picsum.photos/seed/${seed}/400/300`;
  };

  const getServiceImageUrl = (service: HotelServiceResponse) => {
    const seed = service.id || service.name;
    return `https://picsum.photos/seed/${seed}/400/300`;
  };

  if (roomsLoading) {
    return (
      <section className="py-32">
        <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
          <div className="text-center">Loading rooms...</div>
        </div>
      </section>
    );
  }

  if (roomsError) {
    return (
      <section className="py-32">
        <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
          <div className="text-center text-red-500">
            Error loading rooms. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="">
      <Navbar />
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="my-6 text-xl">
            {tagline}
          </Badge>
          <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            {heading}
          </h2>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            {description}
          </p>
          <Button
            size="lg"
            onClick={handleBookNow}
            className="animate-pulse p-6"
          >
            Apply a Booking
          </Button>
          <h2 className="mt-16 mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Our Rooms
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {roomsData?.map((room) => (
            <Card
              key={room.roomNumber}
              className="grid grid-rows-[auto_auto_1fr_auto] pt-0"
            >
              <div className="aspect-16/9 w-full">
                <img
                  src={getPlaceholderImageUrl(room)}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <CardHeader>
                <h3 className="text-lg font-semibold hover:underline md:text-xl">
                  {room.roomType} ROOM - {room.pricePerNight}$/night
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {room.roomStatus} - up to {room.maxOccupancy} people
                </p>
              </CardContent>
              <CardFooter>
                <a
                  href={getPlaceholderImageUrl(room)}
                  target="_blank"
                  className="flex items-center text-foreground hover:underline"
                >
                  View Room
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16 mt-10">
        <div className="text-center">
          <h2 className="mt-10 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Our Services
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {servicesData?.map((service) => (
            <Card
              key={service.name}
              className="grid grid-rows-[auto_auto_1fr_auto] pt-0"
            >
              <div className="aspect-16/9 w-full">
                <img
                  src={getServiceImageUrl(service)}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <CardHeader>
                <h3 className="text-lg font-semibold hover:underline md:text-xl">
                  {service.name}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {service.price}${" "}
                  {service.pricingType
                    .toString()
                    .toUpperCase()
                    .replace("_", " ")}{" "}
                </p>
              </CardContent>
              <CardFooter>
                <a
                  href={getServiceImageUrl(service)}
                  target="_blank"
                  className="flex items-center text-foreground hover:underline"
                >
                  View Room
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { PublicHotelPage2 };
