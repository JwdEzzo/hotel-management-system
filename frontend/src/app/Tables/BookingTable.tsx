"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { BookingResponse } from "@/types/responseTypes";
import {
  useDeleteBookingMutation,
  useGetBookingsQuery,
} from "@/api/bookingsApi";

export const columns: ColumnDef<BookingResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => {
      return (
        <div className="text-center">
          <div className="text-center font-serif">Booking ID</div>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("id")}</div>
    ),
  },
  {
    id: "guestId",
    accessorFn: (row) => row.guest.id,
    header: () => <div className="text-center">Guest ID</div>,
    cell: ({ row }) => {
      const booking = row.original;
      return <div className="capitalize text-center">{booking.guest.id}</div>;
    },
  },
  {
    accessorKey: "checkInDateTime",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Check-In Date
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const dateTimeString = row.getValue("checkInDateTime") as string;

      if (!dateTimeString) {
        return <div>N/A</div>;
      }

      try {
        // Spring Boot LocalDateTime format: "2024-02-01T14:00:00"
        const date = new Date(dateTimeString);

        if (isNaN(date.getTime())) {
          return <div>Invalid Date</div>;
        }

        return (
          <div className="text-center">
            <div>{date.toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      } catch (error) {
        console.error("Date parsing error:", error, dateTimeString);
        return <div>Invalid Date</div>;
      }
    },
  },
  {
    accessorKey: "checkOutDateTime",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Check-Out Date
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const dateTimeString = row.getValue("checkOutDateTime") as string;

      if (!dateTimeString) {
        return <div>N/A</div>;
      }

      try {
        // Spring Boot LocalDateTime format: "2024-02-01T14:00:00"
        const date = new Date(dateTimeString);

        if (isNaN(date.getTime())) {
          return <div>Invalid Date</div>;
        }

        return (
          <div className="text-center">
            <div>{date.toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      } catch (error) {
        console.error("Date parsing error:", error, dateTimeString);
        return <div>Invalid Date</div>;
      }
    },
  },
  {
    accessorKey: "totalPrice",
    header: () => <div className="text-center">Total Cost</div>,
    cell: ({ row }) => {
      const priceValue = row.getValue("totalPrice");

      if (!priceValue && priceValue !== 0) {
        return <div className="text-center font-medium">N/A</div>;
      }

      let amount: number;

      try {
        // Handle BigDecimal coming as string or number
        if (typeof priceValue === "string") {
          amount = parseFloat(priceValue);
        } else if (typeof priceValue === "number") {
          amount = priceValue;
        } else {
          console.error(
            "Unexpected price type:",
            typeof priceValue,
            priceValue
          );
          return <div className="text-center font-medium">N/A</div>;
        }

        if (isNaN(amount)) {
          console.error("Price is NaN:", priceValue);
          return <div className="text-center font-medium">N/A</div>;
        }

        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="text-center font-medium">{formatted}</div>;
      } catch (error) {
        console.error("Price formatting error:", error, priceValue);
        return <div className="text-center font-medium">N/A</div>;
      }
    },
  },

  {
    id: "guestEmail",
    accessorFn: (row) => row.guest.email,
    header: () => <div className="text-center">Guest Email</div>,
    cell: ({ row }) => {
      const booking = row.original;
      return <div className="lowercase text-center">{booking.guest.email}</div>;
    },
  },
  {
    id: "roomNumber",
    accessorFn: (row) => row.room.roomNumber,
    header: () => <div className="text-center">Room Number</div>,
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="text-center font-medium">{booking.room.roomNumber}</div>
      );
    },
  },
  {
    id: "roomType",
    accessorFn: (row) => row.room.roomType,
    header: () => <div className="text-center">Room Type</div>,
    cell: ({ row }) => {
      const booking = row.original;
      if (booking.room.roomType === "SINGLE") {
        return (
          <div className="text-center">
            <div className="capitalize text-center border-4 inline-block rounded-full p-1 bg-blue-500 border-blue-500 text-white">
              Single
            </div>
          </div>
        );
      } else if (booking.room.roomType === "DOUBLE") {
        return (
          <div className="text-center">
            <div className="capitalize text-center border-4 inline-block rounded-full p-1 bg-purple-600 border-purple-600 text-white">
              Double
            </div>
          </div>
        );
      } else if (booking.room.roomType === "DELUXE") {
        return (
          <div className="text-center">
            <div className="capitalize text-center border-4 inline-block rounded-full p-1 bg-orange-500 border-orange-500 text-white">
              Deluxe
            </div>
          </div>
        );
      } else if (booking.room.roomType === "SUITE") {
        return (
          <div className="text-center">
            <div className="capitalize text-center border-4 inline-block rounded-full p-1 bg-yellow-600 border-yellow-600 text-white">
              Suite
            </div>
          </div>
        );
      }
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const booking = row.original;

      const navigate = useNavigate();
      const [deleteBooking, { isLoading: isDeleting }] =
        useDeleteBookingMutation(); // You'll need this mutation
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [bookingToDelete, setBookingToDelete] = useState<number | null>(
        null
      );

      async function confirmDelete() {
        if (bookingToDelete) {
          try {
            await deleteBooking(bookingToDelete).unwrap();
            setDeleteDialogOpen(false);
            setBookingToDelete(null);
          } catch (err) {
            console.error("Failed to delete booking:", err);
          }
        }
      }

      const handleEdit = (bookingId: number) => {
        navigate(`/bookings/edit/${bookingId}`);
      };

      const handleDeleteClick = (bookingId: number) => {
        setBookingToDelete(bookingId);
        setDeleteDialogOpen(true);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => handleEdit(booking.id)}
                className="flex justify-between items-center"
              >
                Edit Booking
                <Pencil className="h-4 w-4 text-blue-500" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteClick(booking.id)}
                className="flex justify-between items-center"
              >
                Delete Booking
                <Trash2 className="h-4 w-4 text-red-500" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  booking for {booking.guest.fullName}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
];
export function BookingTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data: bookings = [], isLoading, error } = useGetBookingsQuery();
  // const navigate = useNavigate();

  // const navigateToCreate = () => {
  //   navigate("/manager/createbooking");
  // };

  const table = useReactTable({
    data: bookings,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading guests...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error loading guests</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={
            (table.getColumn("roomNumber")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("roomNumber")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
