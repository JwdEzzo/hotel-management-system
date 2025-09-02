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
import type { RoomResponse } from "../../types/responseTypes";
import { useDeleteRoomMutation, useGetRoomsQuery } from "@/api/roomsApi";
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

export const columns: ColumnDef<RoomResponse>[] = [
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
          <div className="text-center font-serif text-[17px]">Room ID</div>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "roomNumber",
    header: () => {
      return (
        <div className="text-center">
          <div className="text-center font-serif text-[17px]">Room Number</div>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("roomNumber")}</div>
    ),
  },
  {
    accessorKey: "roomStatus",
    header: ({ column }) => (
      <div className="text-center font-serif text-[17px]">
        <Button
          variant="ghost"
          className="text-right"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Room Status
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      if (row.getValue("roomStatus") === "AVAILABLE") {
        return (
          <div className="text-center">
            <div className="capitalize text-center border-4 inline-block rounded-full p-1 bg-green-600 border-green-600  ">
              Available
            </div>
          </div>
        );
      } else {
        return (
          <div className="text-center">
            <div className="capitalize text-center border-4 inline-block rounded-full p-1 bg-red-600 border-red-600 ">
              Occupied
            </div>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "roomType",
    header: ({ column }) => (
      <div className="text-center font-serif text-[17px] ">
        <Button
          variant="ghost"
          className="text-right"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Room Type
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const roomType = row.getValue("roomType") as string;

      if (roomType === "SINGLE") {
        return (
          <div className="text-center">
            <div className="capitalize text-center border-4 inline-block rounded-full p-1 bg-blue-500 border-blue-500 text-white">
              Single
            </div>
          </div>
        );
      } else if (roomType === "DOUBLE") {
        return (
          <div className="text-center">
            <div className="capitalize text-center border-4 inline-block rounded-full p-1 bg-purple-600 border-purple-600 text-white">
              Double
            </div>
          </div>
        );
      } else if (roomType === "DELUXE") {
        return (
          <div className="text-center">
            <div className="capitalize text-center border-4 inline-block rounded-full p-1 bg-orange-500 border-orange-500 text-white">
              Deluxe
            </div>
          </div>
        );
      } else if (roomType === "SUITE") {
        return (
          <div className="text-center">
            <div className="capitalize text-center border-4 inline-block rounded-full p-1 bg-yellow-600 border-yellow-600 text-white">
              Suite
            </div>
          </div>
        );
      }

      return (
        <div className="text-center">
          <div className="capitalize text-center border-4 inline-block rounded-full p-1 bg-gray-500 border-gray-500 text-white">
            {roomType}
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "pricePerNight",
    header: () => {
      return (
        <div className="text-center">
          <div className="text-center font-serif text-[17px]">Price/Night</div>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">
        {row.getValue("pricePerNight")} $
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const room = row.original;

      const navigate = useNavigate();
      const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [roomToDelete, setRoomToDelete] = useState<number | null>(null);

      async function confirmDelete() {
        if (roomToDelete) {
          try {
            await deleteRoom(roomToDelete).unwrap();
            setDeleteDialogOpen(false);
            setRoomToDelete(null);
          } catch (err) {
            console.error("Failed to delete room:", err);
            // Optionally show user-friendly error message
          }
        }
      }

      const handleEdit = (roomsId: number) => {
        navigate(`/rooms/edit/${roomsId}`);
      };

      const handleDeleteClick = (roomsId: number) => {
        setRoomToDelete(roomsId);
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
                onClick={() => handleEdit(room.id)}
                className="flex justify-between items-center"
              >
                Edit Room
                <Pencil className="h-4 w-4 text-blue-500" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteClick(room.id)}
                className="flex justify-between items-center"
              >
                Delete Room
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
                  employee.
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

export function RoomTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const navigate = useNavigate();

  function navigateToCreate() {
    navigate("/manager/createroom");
  }

  const { data: rooms = [], isLoading, error } = useGetRoomsQuery();

  const table = useReactTable({
    data: rooms,
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
          <div className="text-lg">Loading rooms...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error loading rooms</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto  px-4 lg:px-6">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by room number..."
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
        <div className="space-x-2">
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
          <Button
            variant="default"
            onClick={navigateToCreate}
            className="bg-blue-400 text-white hover:bg-blue-500"
            size="sm"
          >
            Create Room
          </Button>
        </div>
      </div>
    </div>
  );
}
