package com.backend.hotel_management.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.hotel_management.dto.request.ApplyBookingRequestDto;
import com.backend.hotel_management.dto.response.ApplyBookingResponseDto;
import com.backend.hotel_management.dto.response.HotelServingResponseDto;
import com.backend.hotel_management.enums.RoomStatus;
import com.backend.hotel_management.enums.ServicePricingType;
import com.backend.hotel_management.model.Booking;
import com.backend.hotel_management.model.Guest;
import com.backend.hotel_management.model.HotelServing;
import com.backend.hotel_management.model.Room;
import com.backend.hotel_management.repository.BookingRepository;
import com.backend.hotel_management.repository.GuestRepository;
import com.backend.hotel_management.repository.HotelServingRepository;
import com.backend.hotel_management.repository.RoomRepository;

@Service
@Transactional
public class ApplyBookingService {

   @Autowired
   private BookingRepository bookingRepository;

   @Autowired
   private GuestRepository guestRepository;

   @Autowired
   private RoomRepository roomRepository;

   @Autowired
   private HotelServingRepository hotelServingRepository;

   @Autowired
   private BCryptPasswordEncoder passwordEncoder;

   private static final Logger log = LoggerFactory.getLogger(ApplyBookingService.class);

   // Convert Request DTO to Guest Entity
   private Guest convertToGuestEntity(ApplyBookingRequestDto requestDto) {
      Guest guest = new Guest();
      guest.setFullName(requestDto.getFullName());
      guest.setEmail(requestDto.getEmail());
      guest.setPassword(passwordEncoder.encode(requestDto.getPassword()));
      guest.setPhoneNumber(requestDto.getPhoneNumber());
      guest.setCountry(requestDto.getCountry());
      guest.setAddress(requestDto.getAddress());
      guest.setCity(requestDto.getCity());
      return guest;
   }

   // Convert Request DTO to Booking Entity
   private Booking convertToBookingEntity(ApplyBookingRequestDto requestDto, Guest guest, Room room,
         BigDecimal totalPrice, List<HotelServing> selectedServices, Map<Long, Integer> serviceQuantities) {
      //
      Booking booking = new Booking();
      booking.setCheckInDateTime(requestDto.getCheckInDateTime());
      booking.setCheckOutDateTime(requestDto.getCheckOutDateTime());
      booking.setTotalPrice(totalPrice);
      booking.setGuest(guest);
      booking.setRoom(room);
      booking.setAdditionalGuests(requestDto.getAdditionalGuestNames());
      booking.setSelectedServices(selectedServices);

      if (selectedServices != null) {
         booking.setSelectedServices(selectedServices);
         booking.setServiceQuantities(serviceQuantities);
      }

      return booking;

   }

   // Convert to Response DTO
   private ApplyBookingResponseDto convertToResponseDto(Booking booking, List<HotelServing> services) {
      ApplyBookingResponseDto response = new ApplyBookingResponseDto();

      // Set booking info
      response.setBookingId(booking.getId());
      response.setBookingReference(booking.getBookingReference());
      response.setCheckInDateTime(booking.getCheckInDateTime());
      response.setCheckOutDateTime(booking.getCheckOutDateTime());
      response.setTotalPrice(booking.getTotalPrice());
      response.setAdditionalGuestNames(booking.getAdditionalGuests());
      response.setTotalGuests(booking.getTotalGuests());

      // Set guest info
      Guest guest = booking.getGuest();
      response.setFullName(guest.getFullName());
      response.setEmail(guest.getEmail());
      response.setPhoneNumber(guest.getPhoneNumber());
      response.setCountry(guest.getCountry());
      response.setAddress(guest.getAddress());
      response.setCity(guest.getCity());

      // Convert services to response DTOs
      List<HotelServingResponseDto> serviceResponses = services.stream()
            .map(service -> new HotelServingResponseDto(
                  service.getId(),
                  service.getName(),
                  service.getPricingType(),
                  service.getPrice(),
                  service.getDuration()))
            .collect(Collectors.toList());
      response.setSelectedServices(serviceResponses);

      response.setServiceQuantities(booking.getServiceQuantities());

      return response;
   }

   private BigDecimal calculateTotalPrice(Room room, List<HotelServing> services, ApplyBookingRequestDto request) {
      long nights = Duration.between(request.getCheckInDateTime(), request.getCheckOutDateTime()).toDays();
      BigDecimal roomPricePerNight = room.getPricePerNight();
      BigDecimal roomTotal = roomPricePerNight.multiply(BigDecimal.valueOf(nights));

      System.out.println("Room price: " + roomPricePerNight + " x " + nights + " nights = " + roomTotal);

      BigDecimal servicesTotal = services.stream()
            .map(service -> {
               Integer quantity = request.getServiceQuantities() != null
                     ? request.getServiceQuantities().getOrDefault(service.getId(), 1)
                     : 1;

               BigDecimal serviceCost;
               if (service.getPricingType() == ServicePricingType.PER_NIGHT) {
                  serviceCost = service.getPrice().multiply(BigDecimal.valueOf(quantity));
                  System.out.println("PER_NIGHT service: " + service.getName() + " - " + service.getPrice() + " x "
                        + quantity + " x " + nights + " = " + serviceCost);
               } else if (service.getPricingType() == ServicePricingType.PER_HOUR) {
                  serviceCost = service.getPrice().multiply(BigDecimal.valueOf(quantity));
                  System.out.println("PER_HOUR service: " + service.getName() + " - " + service.getPrice() + " x "
                        + quantity + " = " + serviceCost);
               } else {
                  serviceCost = service.getPrice().multiply(BigDecimal.valueOf(quantity));
                  System.out.println("PER_ORDER service: " + service.getName() + " - " + service.getPrice() + " x "
                        + quantity + " = " + serviceCost);
               }
               return serviceCost;
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);

      System.out.println("Services total: " + servicesTotal);
      System.out.println("Grand total: " + roomTotal.add(servicesTotal));

      return roomTotal.add(servicesTotal);
   }

   // Check if room has booking conflicts
   private boolean hasBookingConflict(Long roomId, LocalDateTime checkIn, LocalDateTime checkOut) {
      List<Booking> existingBookings = bookingRepository.findByRoom_IdAndDateRangeOverlap(roomId, checkIn, checkOut);
      return !existingBookings.isEmpty();
   }

   public ApplyBookingResponseDto createApplyBooking(ApplyBookingRequestDto request) {
      // Basic validation
      if (request.getCheckInDateTime().isAfter(request.getCheckOutDateTime())) {
         throw new RuntimeException("Check-in date cannot be after check-out date");
      }

      // Get room
      Room room = roomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new RuntimeException("Room not found"));

      // Check occupancy
      int totalGuests = 1 + (request.getAdditionalGuestNames() != null ? request.getAdditionalGuestNames().size() : 0);

      if (totalGuests > room.getMaxOccupancy()) {
         throw new RuntimeException("Room can only accommodate " + room.getMaxOccupancy() + " guests");
      }

      // Check if room has any booking conflicts
      if (hasBookingConflict(request.getRoomId(), request.getCheckInDateTime(), request.getCheckOutDateTime())) {
         throw new RuntimeException("Room is not available for the selected dates");
      }

      // Find or create primary guest
      Guest primaryGuest = findOrCreateGuest(request);

      // Get selected services (if any)
      List<HotelServing> selectedServices = getSelectedServices(request.getHotelServiceIds());

      // Calculate total price
      BigDecimal totalPrice = calculateTotalPrice(room, selectedServices, request);

      // Create and save booking WITH selected services
      Booking booking = convertToBookingEntity(request, primaryGuest, room, totalPrice, selectedServices,
            request.getServiceQuantities());
      Booking savedBooking = bookingRepository.save(booking);

      // Update room status
      LocalDateTime now = LocalDateTime.now();
      if (request.getCheckInDateTime().isBefore(now) || request.getCheckInDateTime().isEqual(now)) {
         room.setRoomStatus(RoomStatus.OCCUPIED);
         log.info("Room {} marked as OCCUPIED immediately (check-in time has passed)", room.getId());
      } else {
         room.setRoomStatus(RoomStatus.AVAILABLE);
         log.info("Room {} kept as AVAILABLE (future booking)", room.getId());
      }

      roomRepository.save(room);

      return convertToResponseDto(savedBooking, selectedServices);
   }

   private Guest findOrCreateGuest(ApplyBookingRequestDto request) {
      Optional<Guest> existingGuestOpt = guestRepository.findByEmail(request.getEmail());

      if (existingGuestOpt.isPresent()) {
         Guest existingGuest = existingGuestOpt.get();
         existingGuest.setFullName(request.getFullName());
         existingGuest.setPhoneNumber(request.getPhoneNumber());
         existingGuest.setPassword(passwordEncoder.encode(request.getPassword()));
         existingGuest.setCountry(request.getCountry());
         existingGuest.setAddress(request.getAddress());
         existingGuest.setCity(request.getCity());
         return guestRepository.save(existingGuest);
      } else {
         Guest newGuest = convertToGuestEntity(request);
         return guestRepository.save(newGuest);
      }
   }

   private List<HotelServing> getSelectedServices(List<Long> serviceIds) {
      if (serviceIds == null || serviceIds.isEmpty()) {
         return List.of();
      }
      return hotelServingRepository.findAllById(serviceIds);
   }

   @Scheduled(fixedRate = 60000 * 60)
   public void updateRoomStatuses() {
      LocalDateTime now = LocalDateTime.now();
      log.debug("Running room status update at: {}", now);

      List<Booking> activeBookings = bookingRepository.findByCheckInDateTimeBeforeAndCheckOutDateTimeAfter(now);
      for (Booking booking : activeBookings) {
         Room room = booking.getRoom();
         if (room != null && room.getRoomStatus() != RoomStatus.OCCUPIED) {
            room.setRoomStatus(RoomStatus.OCCUPIED);
            roomRepository.save(room);
         }
      }

      List<Booking> completedBookings = bookingRepository.findByCheckOutDateTimeBefore(now);
      for (Booking booking : completedBookings) {
         Room room = booking.getRoom();
         if (room != null && room.getRoomStatus() != RoomStatus.AVAILABLE) {
            room.setRoomStatus(RoomStatus.AVAILABLE);
            roomRepository.save(room);
         }
      }
   }
}