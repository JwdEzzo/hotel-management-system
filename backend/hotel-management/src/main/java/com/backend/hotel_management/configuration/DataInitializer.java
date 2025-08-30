package com.backend.hotel_management.configuration;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.backend.hotel_management.enums.EmployeeRole;
import com.backend.hotel_management.enums.RoomStatus;
import com.backend.hotel_management.enums.RoomType;
import com.backend.hotel_management.enums.ServicePricingType;
import com.backend.hotel_management.model.Booking;
import com.backend.hotel_management.model.Complaint;
import com.backend.hotel_management.model.Employee;
import com.backend.hotel_management.model.Guest;
import com.backend.hotel_management.model.HotelServing;
import com.backend.hotel_management.model.Room;
import com.backend.hotel_management.repository.BookingRepository;
import com.backend.hotel_management.repository.ComplaintRepository;
import com.backend.hotel_management.repository.EmployeeRepository;
import com.backend.hotel_management.repository.GuestRepository;
import com.backend.hotel_management.repository.HotelServingRepository;
import com.backend.hotel_management.repository.RoomRepository;

@Component
public class DataInitializer implements CommandLineRunner {

   @Autowired
   private EmployeeRepository employeeRepository;

   @Autowired
   private GuestRepository guestRepository;

   @Autowired
   private RoomRepository roomRepository;

   @Autowired
   private HotelServingRepository hotelServingRepository;

   @Autowired
   private BookingRepository bookingRepository;

   @Autowired
   private ComplaintRepository complaintRepository;

   @Autowired
   private BCryptPasswordEncoder passwordEncoder;

   @Override
   public void run(String... args) throws Exception {
      // Check if admin user already exists
      if (employeeRepository.findByEmail("admin@hotel.com") == null) {
         // Create default admin user
         Employee admin = new Employee();
         admin.setFullName("Admin");
         admin.setEmail("admin@hotel.com");
         admin.setPassword(passwordEncoder.encode("admin123")); // Default password
         admin.setRole(EmployeeRole.MANAGER);
         employeeRepository.save(admin);
         System.out.println("=== DEFAULT ADMIN USER CREATED ===");
         System.out.println("Email: admin@hotel.com");
         System.out.println("Password: admin123");
         System.out.println("Please change this password after first login!");
         System.out.println("==================================");
      } else {
         System.out.println("=== DEFAULT ADMIN USER ALREADY EXISTS ===");
      }

      // Populate sample data for all entities
      populateSampleData();
   }

   private void populateSampleData() {
      // Check if data already exists to avoid duplicates
      if (employeeRepository.count() > 1 || guestRepository.count() > 0) {
         System.out.println("=== SAMPLE DATA ALREADY EXISTS ===");
         return;
      }

      System.out.println("=== POPULATING SAMPLE DATA ===");

      // Create additional employees
      createEmployees();

      // Create rooms
      createRooms();

      // Create hotel services
      createHotelServices();

      // Create bookings (this will also create guests with bookings)
      createBookings();

      // Create complaints
      createComplaints();

      System.out.println("=== SAMPLE DATA POPULATION COMPLETE ===");
   }

   private Employee createEmployee(String fullName, String email, String password, EmployeeRole role) {
      Employee employee = new Employee();
      employee.setFullName(fullName);
      employee.setEmail(email);
      employee.setPassword(passwordEncoder.encode(password));
      employee.setRole(role);
      return employee;
   }

   private void createEmployees() {
      List<Employee> employees = Arrays.asList(
            createEmployee("John Doe", "john@hotel.com", "admin123", EmployeeRole.RECEPTIONIST),
            createEmployee("Jane Smith", "jane@hotel.com", "admin123", EmployeeRole.HOUSEKEEPING),
            createEmployee("Mike Johnson", "mike@hotel.com", "admin123", EmployeeRole.MAINTENANCE),
            createEmployee("Sarah Wilson", "sarah@hotel.com", "admin123", EmployeeRole.KITCHEN));

      employeeRepository.saveAll(employees);
      System.out.println("Created " + employees.size() + " employees");
   }

   private Guest createGuest(String fullName, String email, String password, String phone, String country,
         String address, String city) {
      Guest guest = new Guest();
      guest.setFullName(fullName);
      guest.setEmail(email);
      guest.setPassword(passwordEncoder.encode(password));
      guest.setPhoneNumber(phone);
      guest.setCountry(country);
      guest.setAddress(address);
      guest.setCity(city);
      return guest;
   }

   private Room createRoom(String roomNumber, RoomType roomType, RoomStatus roomStatus) {
      Room room = new Room();
      room.setRoomNumber(roomNumber);
      room.setRoomType(roomType);
      room.setRoomStatus(roomStatus);
      return room;
   }

   private void createRooms() {
      List<Room> rooms = Arrays.asList(
            createRoom("101", RoomType.SINGLE, RoomStatus.AVAILABLE),
            createRoom("102", RoomType.DOUBLE, RoomStatus.AVAILABLE),
            createRoom("201", RoomType.DELUXE, RoomStatus.AVAILABLE),
            createRoom("301", RoomType.SUITE, RoomStatus.AVAILABLE),
            createRoom("103", RoomType.SINGLE, RoomStatus.OCCUPIED));

      roomRepository.saveAll(rooms);
      System.out.println("Created " + rooms.size() + " rooms");
   }

   private HotelServing createService(String name, ServicePricingType pricingType, BigDecimal price, String duration) {
      HotelServing service = new HotelServing();
      service.setName(name);
      service.setPricingType(pricingType);
      service.setPrice(price);
      service.setDuration(duration);
      return service;
   }

   private void createHotelServices() {
      List<HotelServing> services = Arrays.asList(
            // PER_ORDER services (one-time charges)
            createService("Food", ServicePricingType.PER_ORDER, new BigDecimal("15.00"), null),
            createService("Spa Treatment", ServicePricingType.PER_ORDER, new BigDecimal("75.00"), "1 hour"),

            // PER_NIGHT services (daily charges)
            createService("Gym Access", ServicePricingType.PER_NIGHT, new BigDecimal("20.00"), null),
            createService("Sauna Access", ServicePricingType.PER_NIGHT, new BigDecimal("25.00"), null),

            // PER_HOUR services (hourly charges)
            createService("Gaming", ServicePricingType.PER_HOUR, new BigDecimal("10.00"), "1 hour"));

      hotelServingRepository.saveAll(services);
      System.out.println("Created " + services.size() + " hotel services");
   }

   private void createBookings() {
      // Create guests with bookings (no guests without bookings)
      Guest guest1 = createGuest("Alice Brown", "alice@email.com", "admin123", "+1234567890", "USA", "123 Main St",
            "New York");
      Guest guest2 = createGuest("Bob Green", "bob@email.com", "admin123", "+0987654321", "Canada", "456 Oak Ave",
            "Toronto");

      guestRepository.saveAll(Arrays.asList(guest1, guest2));
      System.out.println("Created 2 guests with bookings");

      // Get rooms
      Room room1 = roomRepository.findByRoomNumber("101").orElseThrow();
      Room room2 = roomRepository.findByRoomNumber("102").orElseThrow();

      // Get services
      List<HotelServing> services = hotelServingRepository.findAllById(Arrays.asList(1L, 2L));

      LocalDateTime now = LocalDateTime.now();

      // Booking 1 for Alice
      Booking booking1 = new Booking();
      booking1.setGuest(guest1);
      booking1.setRoom(room1);
      booking1.setCheckInDateTime(now.plusDays(1));
      booking1.setCheckOutDateTime(now.plusDays(3));
      booking1.setAdditionalGuests(Arrays.asList("Additional Guest 1"));
      booking1.setSelectedServices(services);

      Map<Long, Integer> serviceQuantities1 = new HashMap<>();
      serviceQuantities1.put(1L, 2); // 2 food orders
      serviceQuantities1.put(2L, 1); // 1 spa treatment
      booking1.setServiceQuantities(serviceQuantities1);

      // Calculate total price for booking 1
      long nights1 = Duration.between(booking1.getCheckInDateTime(), booking1.getCheckOutDateTime()).toDays();
      BigDecimal roomCost1 = room1.getPricePerNight().multiply(BigDecimal.valueOf(nights1));
      BigDecimal servicesCost1 = services.stream()
            .map(service -> service.getPrice().multiply(BigDecimal.valueOf(
                  serviceQuantities1.getOrDefault(service.getId(), 1))))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
      booking1.setTotalPrice(roomCost1.add(servicesCost1));

      // Booking 2 for Bob
      Booking booking2 = new Booking();
      booking2.setGuest(guest2);
      booking2.setRoom(room2);
      booking2.setCheckInDateTime(now.plusDays(5));
      booking2.setCheckOutDateTime(now.plusDays(7));
      booking2.setAdditionalGuests(Arrays.asList("Spouse", "Child"));
      booking2.setSelectedServices(services.subList(0, 1)); // Only food service

      Map<Long, Integer> serviceQuantities2 = new HashMap<>();
      serviceQuantities2.put(1L, 4); // 4 food orders
      booking2.setServiceQuantities(serviceQuantities2);

      // Calculate total price for booking 2
      long nights2 = Duration.between(booking2.getCheckInDateTime(), booking2.getCheckOutDateTime()).toDays();
      BigDecimal roomCost2 = room2.getPricePerNight().multiply(BigDecimal.valueOf(nights2));
      BigDecimal servicesCost2 = services.subList(0, 1).stream()
            .map(service -> service.getPrice().multiply(BigDecimal.valueOf(
                  serviceQuantities2.getOrDefault(service.getId(), 1))))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
      booking2.setTotalPrice(roomCost2.add(servicesCost2));

      bookingRepository.saveAll(Arrays.asList(booking1, booking2));
      System.out.println("Created 2 bookings");
   }

   private void createComplaints() {
      // Get a guest who has a booking
      Guest guest = guestRepository.findByEmail("alice@email.com").orElseThrow();

      Complaint complaint = new Complaint();
      complaint.setTitle("Room Temperature Issue");
      complaint.setMessage("The air conditioning in my room is not working properly. It's too warm.");
      complaint.setGuest(guest);
      complaint.setCreatedAt(LocalDateTime.now().minusHours(2));

      complaintRepository.save(complaint);
      System.out.println("Created 1 complaint");
   }
}