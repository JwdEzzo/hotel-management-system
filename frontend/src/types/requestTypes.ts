import type { EmployeeRole2, ServicePricingType } from "./enums";

export interface GuestRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  country: string;
  address: string;
  city: string;
}

export interface RoomRequest {
  roomNumber: string;
  roomType: "SINGLE" | "DOUBLE" | "DELUXE" | "SUITE";
  roomStatus: "AVAILABLE" | "OCCUPIED";
  maxOccupancy: number;
}

export interface EmployeeRequest {
  fullName: string;
  email: string;
  password: string;
  role: EmployeeRole2;
}

export interface HotelServiceRequest {
  name: string;
  price: number;
  pricingType: ServicePricingType;
  duration: string;
}

export interface BookingRequest {
  checkInDateTime: string; // ISO string
  checkOutDateTime: string; // ISO string
  totalPrice: number;
  guestId: number;
  roomId: number;
}

// Apply Booking Request Type
export interface ApplyBookingRequest {
  // Guest Information
  fullName: string;
  additionalGuestNames: string[] | null;
  email: string;
  password: string;
  phoneNumber: string;
  country: string;
  address: string;
  city: string;

  // Booking Information
  checkInDateTime: string; // ISO datetime string
  checkOutDateTime: string; // ISO datetime string
  roomId: number;

  // Optional Hotel Services
  hotelServiceIds?: number[];
  serviceQuantities?: { [key: number]: number }; // NEW FIELD
}

export interface UpdateBookingRequest {
  // Guest Information
  fullName: string;
  additionalGuestNames: string[] | null;
  email: string;
  password: string;
  phoneNumber: string;
  country: string;
  address: string;
  city: string;

  // Booking Information
  checkInDateTime: string; // ISO datetime string
  checkOutDateTime: string; // ISO datetime string
  roomId: number;
  // bookingReference: string;

  // Optional Hotel Services
  hotelServiceIds?: number[];
  serviceQuantities?: { [key: number]: number };
}

export interface ComplaintRequest {
  guestId: number;
  title: string;
  message: string;
}

export interface ContactUsRequest {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}
