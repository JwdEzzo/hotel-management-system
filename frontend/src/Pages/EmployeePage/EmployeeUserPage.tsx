import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetEmployeeByEmailQuery } from "@/api/employeesApi";
import { logout } from "@/auth/authSlice";
import { useEffect, useState } from "react";
import { Database, DollarSign, Hotel, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { ModeToggle } from "@/components/ModeToggle";

import { BookingTable } from "@/app/Tables/BookingTable";
import { EmployeeTable } from "@/app/Tables/EmployeeTable";
import { GuestTable } from "@/app/Tables/GuestTable";
import { HotelServiceTable } from "@/app/Tables/HotelServiceTable";
import { RoomTable } from "@/app/Tables/RoomTable";
import RevenueCard from "./RevenueCard";

function EmployeeUserPage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: employee,
    isLoading: isEmployeeLoading,
    isError: isEmployeeError,
    error: employeeError,
    refetch,
  } = useGetEmployeeByEmailQuery(user?.email || "", {
    skip: !user,
  });

  const [activeSection, setActiveSection] = useState("tables");

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }

  useEffect(() => {
    refetch();
  }, []);

  // Menu items for the sidebar
  const menuItems = [
    {
      title: "Tables",
      url: "#",
      icon: Database,
      onClick: () => setActiveSection("tables"),
    },
  ];

  const additionalItems = [
    {
      title: "Revenue",
      url: "#",
      icon: DollarSign,
      onClick: () => setActiveSection("revenue"),
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gray-100 flex dark:bg-black">
        {/* Sidebar */}
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-xl font-bold flex items-center gap-2">
                  <Hotel className="h-6 w-6" />
                  <span>Beirut Hotel</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    {menuItems.map((item) => (
                      <SidebarMenuButton
                        key={item.title}
                        onClick={item.onClick}
                        isActive={activeSection === item.title.toLowerCase()}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    ))}
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Additional</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {additionalItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={item.onClick}
                        isActive={activeSection === item.title.toLowerCase()}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <User className="h-4 w-4" />
                      <span>{user?.email || "Employee"}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top">
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 min-w-0 flex flex-col dark:bg-black">
          {/* Header */}
          <header className="dark:bg-black border-b px-6 py-4 shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeSection === "tables" ? "Tables" : "Revenue"}
              </h1>
              <div className="flex items-center space-x-4">
                <ModeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden md:inline">{user?.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {activeSection === "tables" && (
              <div className="w-full">
                <EmployeeTable />
                <HotelServiceTable />
                <RoomTable />
                <GuestTable />
                <BookingTable />
              </div>
            )}
            {activeSection === "revenue" && (
              <div className="p-3">
                <RevenueCard />
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default EmployeeUserPage;
