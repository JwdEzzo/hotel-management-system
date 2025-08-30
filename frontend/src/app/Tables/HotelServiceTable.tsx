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
import type { HotelServiceResponse } from "../../types/responseTypes";
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

import {
  useDeleteHotelServiceMutation,
  useGetHotelServicesQuery,
} from "@/api/hotelServingsApi";

export const columns: ColumnDef<HotelServiceResponse>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center">Total Cost</div>,
    cell: ({ row }) => {
      const priceValue = row.getValue("price");

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
          return <div className="text-center font-medium">N/A</div>;
        }

        if (isNaN(amount)) {
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
    accessorKey: "pricingType",
    header: () => <div className="text-center">Pricing Type</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">
        {(row.getValue("pricingType") as string)
          .toLowerCase()
          .replace("_", " ")}
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: () => <div className="text-center">Duration</div>,
    cell: ({ row }) => {
      const duration: string = row.getValue("duration");

      if (duration === null) {
        return <div className="text-center">N/A</div>;
      }

      return <div className="text-center font-medium ">{duration}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const hotelService = row.original;

      const navigate = useNavigate();
      const [deleteHotelService, { isLoading: isDeleting }] =
        useDeleteHotelServiceMutation();
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [hotelServiceToDelete, setHotelServiceToDelete] = useState<
        number | null
      >(null);

      async function confirmDelete() {
        if (hotelServiceToDelete) {
          try {
            await deleteHotelService(hotelServiceToDelete).unwrap();
            setDeleteDialogOpen(false);
            setHotelServiceToDelete(null);
          } catch (err) {
            console.error("Failed to delete hotel service:", err);
            // Optionally show user-friendly error message
          }
        }
      }

      const handleEdit = (hotelServiceId: number) => {
        navigate(`/hotelservices/edit/${hotelServiceId}`);
      };

      const handleDeleteClick = (hotelServiceId: number) => {
        setHotelServiceToDelete(hotelServiceId);
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
                onClick={() => handleEdit(hotelService.id)}
                className="flex justify-between items-center"
              >
                Edit Hotel Service
                <Pencil className="h-4 w-4 text-blue-500" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteClick(hotelService.id)}
                className="flex justify-between items-center"
              >
                Delete Hotel Service
                <Trash2 className="h-4 w-4 text-red-500" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add the confirmation dialog */}
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  hotel service.
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

export function HotelServiceTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const navigate = useNavigate();

  function navigateToCreate() {
    navigate("/manager/createhotelservice");
  }

  const {
    data: hotelServices = [],
    isLoading,
    error,
  } = useGetHotelServicesQuery();

  const table = useReactTable({
    data: hotelServices,
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
          <div className="text-lg">Loading hotel services...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">
            Error loading hotel services
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/2 mx-auto">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
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

        <div className="space-x-2">
          <Button
            variant="default"
            onClick={navigateToCreate}
            className="bg-blue-400 text-white hover:bg-blue-500"
            size="sm"
          >
            Create Hotel Service
          </Button>
        </div>
      </div>
    </div>
  );
}
