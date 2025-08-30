package com.backend.hotel_management.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.hotel_management.dto.request.BookingRequestDto;
import com.backend.hotel_management.dto.response.BookingResponseDto;
import com.backend.hotel_management.dto.response.GuestResponseDto;
import com.backend.hotel_management.dto.response.HotelServingResponseDto;
import com.backend.hotel_management.dto.response.RoomResponseDto;
import com.backend.hotel_management.model.Booking;
import com.backend.hotel_management.model.Guest;
import com.backend.hotel_management.model.HotelServing;
import com.backend.hotel_management.model.Room;
import com.backend.hotel_management.repository.BookingRepository;
import com.backend.hotel_management.repository.GuestRepository;
import com.backend.hotel_management.repository.HotelServingRepository;
import com.backend.hotel_management.repository.RoomRepository;

@Service
public class BookingService {

   @Autowired
   private BookingRepository bookingRepository;

   @Autowired
   private GuestRepository guestRepository;

   @Autowired
   private RoomRepository roomRepository;

   @Autowired
   private HotelServingRepository hotelServingRepository;

   private static final Logger log = LoggerFactory.getLogger(BookingService.class);

   // Convert Entity to Response DTO
   private BookingResponseDto convertToResponseDto(Booking booking) {
      // Convert guest
      GuestResponseDto guestDto = new GuestResponseDto();
      if (booking.getGuest() != null) {
         Guest guest = booking.getGuest();
         guestDto.setId(guest.getId());
         guestDto.setFullName(guest.getFullName());
         guestDto.setEmail(guest.getEmail());
         guestDto.setPhoneNumber(guest.getPhoneNumber());
         guestDto.setCountry(guest.getCountry());
         guestDto.setAddress(guest.getAddress());
         guestDto.setCity(guest.getCity());
      }

      // Convert room
      RoomResponseDto roomDto = new RoomResponseDto();
      if (booking.getRoom() != null) {
         Room room = booking.getRoom();
         roomDto.setId(room.getId());
         roomDto.setRoomNumber(room.getRoomNumber());
         roomDto.setRoomType(room.getRoomType());
         roomDto.setRoomStatus(room.getRoomStatus());
         roomDto.setPricePerNight(room.getPricePerNight());
         roomDto.setMaxOccupancy(room.getMaxOccupancy());
      }

      // Create BookingResponseDto
      BookingResponseDto bookingDto = new BookingResponseDto();
      bookingDto.setId(booking.getId());
      bookingDto.setBookingReference(booking.getBookingReference());
      bookingDto.setCheckInDateTime(booking.getCheckInDateTime());
      bookingDto.setCheckOutDateTime(booking.getCheckOutDateTime());
      bookingDto.setTotalPrice(booking.getTotalPrice());
      bookingDto.setGuest(guestDto);
      bookingDto.setAdditionalGuestNames(booking.getAdditionalGuests());
      bookingDto.setRoom(roomDto);
      bookingDto.setTotalGuests(booking.getTotalGuests());
      bookingDto.setServiceQuantities(booking.getServiceQuantities());

      if (booking.getSelectedServices() != null) {
         List<HotelServingResponseDto> serviceDtos = booking.getSelectedServices().stream()
               .map(service -> new HotelServingResponseDto(
                     service.getId(),
                     service.getName(),
                     service.getPricingType(),
                     service.getPrice(),
                     service.getDuration()))
               .collect(Collectors.toList());
         bookingDto.setSelectedServices(serviceDtos);
      }

      return bookingDto;
   }

   // Convert Request DTO to Entity
   private Booking convertToEntity(BookingRequestDto requestDto) {
      Booking booking = new Booking();
      booking.setCheckInDateTime(requestDto.getCheckInDateTime());
      booking.setCheckOutDateTime(requestDto.getCheckOutDateTime());
      booking.setTotalPrice(requestDto.getTotalPrice());
      booking.setAdditionalGuests(requestDto.getAdditionalGuestNames());

      // Check if room can accommodate all guests
      Room room = roomRepository.findById(requestDto.getRoomId())
            .orElseThrow(() -> new RuntimeException("Room not found with id: " + requestDto.getRoomId()));

      int totalGuests = 1
            + (requestDto.getAdditionalGuestNames() != null ? requestDto.getAdditionalGuestNames().size() : 0);

      if (totalGuests > room.getMaxOccupancy()) {
         throw new RuntimeException("Room can only accommodate " + room.getMaxOccupancy() + " guests");
      }

      // Set guest if exists
      if (requestDto.getGuestId() != null) {
         Guest guest = guestRepository.findById(requestDto.getGuestId())
               .orElseThrow(() -> new RuntimeException("Guest not found with id: " + requestDto.getGuestId()));
         booking.setGuest(guest);
      }

      // Set room
      booking.setRoom(room);

      if (booking.getCheckInDateTime().isAfter(booking.getCheckOutDateTime())) {
         throw new RuntimeException("Check-in date is after check-out date");
      }

      if (requestDto.getSelectedServiceIds() != null && requestDto.getServiceQuantities() != null) {
         List<HotelServing> services = hotelServingRepository.findAllById(requestDto.getSelectedServiceIds());
         booking.setSelectedServices(services);
         booking.setServiceQuantities(requestDto.getServiceQuantities());
      }

      return booking;
   }

   // Convert List of Entities to List of Response DTOs
   private List<BookingResponseDto> convertToResponseDtoList(List<Booking> bookings) {
      return bookings.stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
   }

   // Create new booking
   public BookingResponseDto createBooking(BookingRequestDto requestDto) {
      Booking booking = convertToEntity(requestDto);
      // Calculate total price here if needed
      Booking savedBooking = bookingRepository.save(booking);
      return convertToResponseDto(savedBooking);
   }

   // Get all bookings
   public List<BookingResponseDto> getAllBookings() {
      List<Booking> bookings = bookingRepository.findAll();
      return convertToResponseDtoList(bookings);
   }

   // Get booking by ID
   public BookingResponseDto getBookingByReference(String reference) {
      Booking booking = bookingRepository.findByBookingReference(reference)
            .orElseThrow(() -> new RuntimeException("Booking not found with reference: " + reference));
      return convertToResponseDto(booking);
   }

   public Booking getBookingEntityByReference(String reference) {
      return bookingRepository.findByBookingReference(reference)
            .orElseThrow(() -> new RuntimeException("Booking not found with reference: " + reference));
   }

   // Update Booking
   public BookingResponseDto updateBooking(Long id, BookingRequestDto requestDto) {
      Booking existingBooking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

      // Update fields
      existingBooking.setCheckInDateTime(requestDto.getCheckInDateTime());
      existingBooking.setCheckOutDateTime(requestDto.getCheckOutDateTime());
      existingBooking.setTotalPrice(requestDto.getTotalPrice());

      // Set guest if exists
      if (requestDto.getGuestId() != null) {
         Guest guest = guestRepository.findById(requestDto.getGuestId())
               .orElseThrow(() -> new RuntimeException("Guest not found with id: " + requestDto.getGuestId()));
         existingBooking.setGuest(guest);
      }

      // Set room if exists
      if (requestDto.getRoomId() != null) {
         Room room = roomRepository.findById(requestDto.getRoomId())
               .orElseThrow(() -> new RuntimeException("Room not found with id: " + requestDto.getRoomId()));
         existingBooking.setRoom(room);
      }

      // if setCheckInDateTime > setCheckOutDateTime, throw exception
      if (existingBooking.getCheckInDateTime().isAfter(existingBooking.getCheckOutDateTime())) {
         throw new RuntimeException("Check-in date is after check-out date");
      }

      Booking updatedBooking = bookingRepository.save(existingBooking);
      return convertToResponseDto(updatedBooking);
   }

   // Delete booking by ID
   public void deleteBooking(Long id) {
      if (!bookingRepository.existsById(id)) {
         throw new RuntimeException("Booking not found with id: " + id);
      }
      bookingRepository.deleteById(id);
   }

   public List<BookingResponseDto> getBookingsByGuestEmail(String email) {
      List<Booking> bookings = bookingRepository.findByGuestEmail(email);
      return convertToResponseDtoList(bookings);
   }

}
