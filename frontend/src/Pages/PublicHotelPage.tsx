import { ArrowRight, Star, Users } from "lucide-react";

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
import MyFooter from "@/components/MyFooter";

interface PublicHotelPageProps {
  tagline?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

function PublicHotelPage({ heading, description }: PublicHotelPageProps) {
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

  if (roomsLoading || servicesLoading) {
    return (
      <section className="py-32">
        <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
          <div className="text-center">Loading rooms...</div>
        </div>
      </section>
    );
  }

  if (roomsError || servicesError) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-[url(./images/penthouse.jpg)] bg-hero-pattern bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10"></div>
        <div className="container mx-auto px-4 lg:px-16 relative">
          <div className="max-w-4xl mx-auto text-center p-5 border-primary/20 bg-white/50 dark:bg-slate-800/60">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6 leading-tight">
              {heading}
            </h1>
            <p className="text-lg md:text-xl text-bold max-w-2xl mx-auto mb-10 leading-relaxed ">
              {description}
            </p>
            <Button
              size="lg"
              onClick={handleBookNow}
              className="px-8 py-4 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Apply a Booking
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Our Exquisite Rooms
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Each room is carefully designed to provide maximum comfort and
              luxury for your stay
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {roomsData?.map((room, index) => (
              <Card
                key={room.roomNumber}
                className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-slate-800"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={getPlaceholderImageUrl(room)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={`${room.roomType} room`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Badge className="absolute top-4 left-4 bg-white/90 text-gray-800 hover:bg-white">
                    {room.roomStatus}
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {room.roomType} Room
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${room.pricePerNight}
                      <span className="text-sm font-normal text-muted-foreground">
                        /night
                      </span>
                    </span>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">up to {room.maxOccupancy}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      Luxury
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    className="w-full dark:bg-teal-900  group-hover:bg-blue-200 group-hover:text- transition-all duration-200 bg-accent hover:bg-teal-800 hover:text-white dark:group-hover:bg-teal-600"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Premium Services
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto rounded-full mb-6"></div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Elevate your stay with our carefully curated services and
              amenities
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {servicesData?.map((service, index) => (
              <Card
                key={service.name}
                className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-slate-800"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={getServiceImageUrl(service)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={service.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardHeader className="pb-3">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      ${service.price}
                    </span>
                    <Badge variant="outline" className="capitalize">
                      {service.pricingType
                        .toString()
                        .replace("_", " ")
                        .toLowerCase()}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    className="w-full dark:bg-teal-900  group-hover:bg-blue-200 group-hover:text- transition-all duration-200 bg-accent hover:bg-teal-800 hover:text-white dark:group-hover:bg-teal-600"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <MyFooter />
    </div>
  );
}
export default PublicHotelPage;
