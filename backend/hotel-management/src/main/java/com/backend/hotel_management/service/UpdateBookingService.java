package com.backend.hotel_management.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.hotel_management.dto.request.UpdateBookingRequestDto;
import com.backend.hotel_management.dto.response.HotelServingResponseDto;
import com.backend.hotel_management.dto.response.UpdateBookingResponseDto;
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
public class UpdateBookingService {

      @Autowired
      private BookingRepository bookingRepository;

      @Autowired
      private GuestRepository guestRepository;

      @Autowired
      private RoomRepository roomRepository;

      @Autowired
      private HotelServingRepository hotelServingRepository;

      private static final Logger log = LoggerFactory.getLogger(UpdateBookingService.class);

      // Convert to Response DTO - following the same pattern as ApplyBookingService
      private UpdateBookingResponseDto convertToResponseDto(Booking booking, List<HotelServing> services) {
            UpdateBookingResponseDto response = new UpdateBookingResponseDto();

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

      // Calculate total price - same logic as ApplyBookingService
      private BigDecimal calculateTotalPrice(Room room, List<HotelServing> services, UpdateBookingRequestDto request) {
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

                                    System.out.println("PER_NIGHT service: " + service.getName() + " - "
                                                + service.getPrice() + " x "
                                                + quantity + " x " + nights + " = " + serviceCost);
                              } else if (service.getPricingType() == ServicePricingType.PER_HOUR) {
                                    serviceCost = service.getPrice().multiply(BigDecimal.valueOf(quantity));
                                    System.out.println("PER_HOUR service: " + service.getName() + " - "
                                                + service.getPrice() + " x "
                                                + quantity + " = " + serviceCost);
                              } else {
                                    serviceCost = service.getPrice().multiply(BigDecimal.valueOf(quantity));
                                    System.out.println("PER_ORDER service: " + service.getName() + " - "
                                                + service.getPrice() + " x "
                                                + quantity + " = " + serviceCost);
                              }
                              return serviceCost;
                        })
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

            System.out.println("Services total: " + servicesTotal);
            System.out.println("Grand total: " + roomTotal.add(servicesTotal));

            return roomTotal.add(servicesTotal);
      }

      // Check if room has booking conflicts (excluding current booking)
      private boolean hasBookingConflict(Long roomId, LocalDateTime checkIn, LocalDateTime checkOut,
                  Long excludeBookingId) {
            List<Booking> existingBookings = bookingRepository.findByRoom_IdAndDateRangeOverlap(roomId, checkIn,
                        checkOut);
            // Filter out the current booking being updated
            existingBookings = existingBookings.stream()
                        .filter(booking -> !booking.getId().equals(excludeBookingId))
                        .collect(Collectors.toList());
            return !existingBookings.isEmpty();
      }

      // Get selected services - same as ApplyBookingService
      private List<HotelServing> getSelectedServices(List<Long> serviceIds) {
            if (serviceIds == null || serviceIds.isEmpty()) {
                  return List.of();
            }
            return hotelServingRepository.findAllById(serviceIds);
      }

      /**
       * Updates an existing booking using booking reference.
       */
      public UpdateBookingResponseDto updateBookingByReference(String bookingReference,
                  UpdateBookingRequestDto requestDto,
                  Long authenticatedGuestId) {

            // 1. Find the existing booking by booking reference
            Booking existingBooking = bookingRepository.findByBookingReference(bookingReference)
                        .orElseThrow(() -> new RuntimeException(
                                    "Booking not found with reference: " + bookingReference));

            // 2. Security Check: Ensure the booking belongs to the authenticated guest
            if (!existingBooking.getGuest().getId().equals(authenticatedGuestId)) {
                  throw new RuntimeException("You are not authorized to update this booking.");
            }

            return updateBookingLogic(existingBooking, requestDto);
      }

      private UpdateBookingResponseDto updateBookingLogic(Booking existingBooking, UpdateBookingRequestDto requestDto) {
            // Basic validation - same as ApplyBookingService
            if (requestDto.getCheckInDateTime().isAfter(requestDto.getCheckOutDateTime())) {
                  throw new RuntimeException("Check-in date cannot be after check-out date");
            }

            // Get new room
            Room newRoom = roomRepository.findById(requestDto.getRoomId())
                        .orElseThrow(() -> new RuntimeException("Room not found"));

            // Check occupancy - same validation as ApplyBookingService
            int totalGuests = 1
                        + (requestDto.getAdditionalGuestNames() != null ? requestDto.getAdditionalGuestNames().size()
                                    : 0);

            if (totalGuests > newRoom.getMaxOccupancy()) {
                  throw new RuntimeException("Room can only accommodate " + newRoom.getMaxOccupancy() + " guests");
            }

            // Check if new room has any booking conflicts (excluding current booking)
            if (hasBookingConflict(requestDto.getRoomId(), requestDto.getCheckInDateTime(),
                        requestDto.getCheckOutDateTime(), existingBooking.getId())) {
                  throw new RuntimeException("Room is not available for the selected dates");
            }

            // Update guest information
            Guest existingGuest = existingBooking.getGuest();
            existingGuest.setFullName(requestDto.getFullName());
            existingGuest.setEmail(requestDto.getEmail());
            existingGuest.setPhoneNumber(requestDto.getPhoneNumber());
            existingGuest.setCountry(requestDto.getCountry());
            existingGuest.setAddress(requestDto.getAddress());
            existingGuest.setCity(requestDto.getCity());
            guestRepository.save(existingGuest);

            // Get selected services
            List<HotelServing> selectedServices = getSelectedServices(requestDto.getHotelServiceIds());

            // Calculate new total price
            BigDecimal totalPrice = calculateTotalPrice(newRoom, selectedServices, requestDto);

            // Update booking fields
            Room oldRoom = existingBooking.getRoom();
            existingBooking.setCheckInDateTime(requestDto.getCheckInDateTime());
            existingBooking.setCheckOutDateTime(requestDto.getCheckOutDateTime());
            existingBooking.setRoom(newRoom);
            existingBooking.getSelectedServices().clear();
            existingBooking.getSelectedServices().addAll(selectedServices);
            existingBooking.setServiceQuantities(requestDto.getServiceQuantities());
            existingBooking.setAdditionalGuests(requestDto.getAdditionalGuestNames());
            existingBooking.setTotalPrice(totalPrice);

            // Save updated booking
            Booking updatedBooking = bookingRepository.save(existingBooking);

            // Update room statuses - following the same pattern as ApplyBookingService
            LocalDateTime now = LocalDateTime.now();

            // Handle old room status (if room changed)
            if (oldRoom != null && !oldRoom.getId().equals(newRoom.getId())) {
                  // Check if old room has other active bookings
                  List<Booking> oldRoomActiveBookings = bookingRepository.findByRoom_IdAndDateRangeOverlap(
                              oldRoom.getId(), now, now.plusDays(1));
                  oldRoomActiveBookings = oldRoomActiveBookings.stream()
                              .filter(booking -> !booking.getId().equals(existingBooking.getId()))
                              .collect(Collectors.toList());

                  if (oldRoomActiveBookings.isEmpty()) {
                        oldRoom.setRoomStatus(RoomStatus.AVAILABLE);
                        roomRepository.save(oldRoom);
                        log.info("Old room {} marked as AVAILABLE", oldRoom.getId());
                  }
            }

            // Handle new room status
            if (requestDto.getCheckInDateTime().isBefore(now) || requestDto.getCheckInDateTime().isEqual(now)) {
                  newRoom.setRoomStatus(RoomStatus.OCCUPIED);
                  log.info("New room {} marked as OCCUPIED immediately (check-in time has passed)", newRoom.getId());
            } else {
                  // Only set to AVAILABLE if not currently occupied by another booking
                  if (newRoom.getRoomStatus() != RoomStatus.OCCUPIED) {
                        newRoom.setRoomStatus(RoomStatus.AVAILABLE);
                        log.info("New room {} kept as AVAILABLE (future booking)", newRoom.getId());
                  }
            }

            roomRepository.save(newRoom);

            return convertToResponseDto(updatedBooking, selectedServices);
      }
}