import type {
  EmployeeRole2,
  RoomStatus,
  RoomType,
  ServicePricingType,
} from "./enums";

export interface GuestResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  address: string;
  city: string;
  bookingIds: number[];
}

export interface RoomResponse {
  id: number;
  roomNumber: string;
  roomType: RoomType;
  roomStatus: RoomStatus;
  pricePerNight: number;
  maxOccupancy: number;
}

export interface EmployeeResponse {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role: EmployeeRole2;
}

export interface BookingResponse {
  id: number;
  bookingReference: string;
  checkInDateTime: string; // LocalDateTime comes as ISO string from Spring Boot
  checkOutDateTime: string; // LocalDateTime comes as ISO string from Spring Boot
  totalPrice: string | number; // BigDecimal can come as string or number
  guest: GuestResponse;
  room: RoomResponse;
}

export interface HotelServiceResponse {
  id: number;
  name: string;
  price: number;
  pricingType: ServicePricingType;
  duration: string;
}

// Apply Booking Response Type
export interface ApplyBookingResponse {
  // Booking Information
  bookingId: number;
  checkInDateTime: string; // ISO datetime string
  checkOutDateTime: string; // ISO datetime string
  totalPrice: number;

  // Guest Information (confirmation)
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  address: string;
  city: string;

  // Selected Hotel Services
  hotelServings: HotelServiceResponse[];
  serviceQuantities?: { [key: number]: number };
}

export interface ComplaintResponse {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  guestId: number;
}

export interface UpdateBookingResponse {
  // Guest Information (confirmation)
  fullName: string;
  additionalGuests: string[];
  bookingReference: string;
  email: string;
  phoneNumber: string;
  country: string;
  address: string;
  city: string;

  // Booking Information
  roomId: number;
  bookingId: number;
  checkInDateTime: string; // ISO datetime string
  checkOutDateTime: string; // ISO datetime string
  totalPrice: number;

  // Selected Hotel Services
  hotelServings: HotelServiceResponse[];
  serviceQuantities?: { [key: number]: number };
}

export interface ContactUsResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}
