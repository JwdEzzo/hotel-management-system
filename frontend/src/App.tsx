import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import CreateRoom from "./Pages/Rooms/CreateRoom";
import EditRoom from "./Pages/Rooms/EditRoom";
import { ThemeProvider } from "./components/ThemeProvider";
import { RoomTable } from "./app/Tables/RoomTable";
import { GuestTable } from "./app/Tables/GuestTable";
import { HotelServiceTable } from "./app/Tables/HotelServiceTable";
import { BookingTable } from "./app/Tables/BookingTable";
import { EmployeeTable } from "./app/Tables/EmployeeTable";
import CreateHotelService from "./Pages/HotelServings/CreateHotelService";
import CreateEmployee from "./Pages/Employees/CreateEmployee";
import EditHotelService from "./Pages/HotelServings/EditHotelService";
import EditEmployee from "./Pages/Employees/EditEmployee";
import EditBooking from "./Pages/Bookings/EdtiBooking";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./auth/Login";
import { ComplaintTable } from "./app/Tables/ComplaintTable";
import CreateComplaint from "./Pages/Complaints/CreateComplaint";
import ApplyBooking from "./components/ApplyBooking";
import GuestLogin from "./auth/GuestLogin";
import GuestDashboard from "./components/GuestDashboard";
import UpdateBooking from "./components/UpdateBooking";
import { PublicHotelPage2 } from "./Pages/PublicHotelPage2";
import ContactUs from "./Pages/ContactUs";

function App() {
  return (
    <div>
      <ThemeProvider>
        <Routes>
          {/* Unprotected Routes */}
          <Route path="/applybooking" element={<ApplyBooking />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PublicHotelPage2
                tagline={"Hotel Management System"}
                heading={"Welcome to our Hotel"}
                description={
                  "Our 5 star hotel offers a wide range of rooms and services. You may book a room and choose services you want. We have Single , Double , Suite , and Deluxe rooms. You also can bring over your friends or family and enjoy our rooms and services."
                }
                buttonText={"Apply for a Booking NOW!"}
                buttonUrl={"http://localhost:5173/applybooking"}
                //
              />
            }
          />
          <Route path="/createcomplaint" element={<CreateComplaint />} />
          <Route path="/guestlogin" element={<GuestLogin />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* Create Entities Routes - Role-based protection */}
          <Route
            path="/guest/:email"
            element={
              <ProtectedRoute requiredRoles={["GUEST"]}>
                <GuestDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guest/bookings/:bookingReference/update"
            element={
              <ProtectedRoute requiredRoles={["GUEST"]}>
                <UpdateBooking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/createroom"
            element={
              <ProtectedRoute requiredRoles={["MANAGER"]}>
                <CreateRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/createhotelservice"
            element={
              <ProtectedRoute requiredRoles={["MANAGER"]}>
                <CreateHotelService />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/createemployee"
            element={
              <ProtectedRoute requiredRoles={["MANAGER"]}>
                <CreateEmployee />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/tables"
            element={
              <div>
                <ProtectedRoute requiredRoles={["MANAGER"]}>
                  <RoomTable />
                  <EmployeeTable />
                  <GuestTable />
                  <HotelServiceTable />
                  <BookingTable />
                  <ComplaintTable />
                </ProtectedRoute>
              </div>
            }
          />

          {/* Edit Routes - Role-based protection */}
          <Route
            path="/rooms/edit/:roomId"
            element={
              <ProtectedRoute requiredRoles={["MANAGER"]}>
                <EditRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotelservices/edit/:hotelServiceId"
            element={
              <ProtectedRoute requiredRoles={["MANAGER"]}>
                <EditHotelService />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/edit/:employeeId"
            element={
              <ProtectedRoute requiredRoles={["MANAGER"]}>
                <EditEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/edit/:bookingId"
            element={
              <ProtectedRoute requiredRoles={["MANAGER"]}>
                <EditBooking />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
