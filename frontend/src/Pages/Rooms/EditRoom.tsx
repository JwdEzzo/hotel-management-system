// src/pages/EditRoom.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RoomRequest } from "../../types/requestTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import z from "zod/v3";
import { useGetRoomByIdQuery, useUpdateRoomMutation } from "@/api/roomsApi";
import { use, useEffect, useState } from "react";
import { RoomStatus, RoomType } from "@/types/enums";

// Define Zod schema for validation (same as CreateRoom or adjusted if needed)
const roomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  maxOccupancy: z.number().min(1, "Max occupancy is required"),
  roomType: z.nativeEnum(RoomType, {
    required_error: "Please select a room type",
  }),

  roomStatus: z.nativeEnum(RoomStatus, {
    required_error: "Please select a room status",
  }),
});

type RoomFormValues = z.infer<typeof roomSchema>;

function EditRoom() {
  const { roomId } = useParams<{ roomId: string }>(); // Get roomId from URL params
  const navigate = useNavigate();
  const [selectKey, setSelectKey] = useState(0);

  // Fetch existing room data
  const {
    data: room,
    isLoading: isRoomLoading,
    isError: isRoomError,
    error: roomError,
  } = useGetRoomByIdQuery(Number(roomId), {
    skip: !roomId, // Skip query if roomId is not available
  });

  // Initialize update mutation
  const [updateRoom, { isLoading: isUpdating, isError, error }] =
    useUpdateRoomMutation();

  // Initialize form with react-hook-form and Zod resolver
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: room?.roomNumber,
      maxOccupancy: room?.maxOccupancy,
      roomType: room?.roomType,
      roomStatus: room?.roomStatus,
    },
  });

  useEffect(() => {
    if (room) {
      console.log("First Call Room data:", room);
      form.reset({
        roomNumber: room.roomNumber,
        maxOccupancy: room.maxOccupancy,
        roomType: room.roomType,
        roomStatus: room.roomStatus,
      });
      console.log("Second Call Room data", room);
      //Force a rerender of select
      setSelectKey((prev) => prev + 1);
    }
  }, [room, form]);

  useEffect(() => {
    const roomType = form.watch("roomType");
    if (roomType) {
      const suggestedOccupancy = {
        [RoomType.SINGLE]: 1,
        [RoomType.DOUBLE]: 2,
        [RoomType.DELUXE]: 3,
        [RoomType.SUITE]: 4,
      }[roomType];

      form.setValue("maxOccupancy", suggestedOccupancy);
    }
  }, [form.watch("roomType")]); // Watch for roomType changes

  // Handle form submission
  async function handleFormSubmit(data: RoomFormValues) {
    if (!roomId) return; // Safety check

    try {
      const roomRequest: RoomRequest = {
        roomNumber: data.roomNumber,
        roomStatus: data.roomStatus,
        roomType: data.roomType,
        maxOccupancy: data.maxOccupancy,
      };

      await updateRoom({ id: Number(roomId), room: roomRequest }).unwrap();
      navigate("/manager/tables");
    } catch (error) {
      console.error("Error updating the room:", error);
      // Error alert will be shown via isError and error state
    }
  }

  // Handle loading state
  if (isRoomLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading room details...</span>
      </div>
    );
  }

  // Handle error state for fetching room
  if (isRoomError || !room) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-4">
        <AlertDescription>
          {roomError &&
          "data" in roomError &&
          typeof roomError.data === "string"
            ? roomError.data
            : "Failed to load room details. Please try again."}
        </AlertDescription>
        <div className="mt-2">
          <Button
            variant="outline"
            onClick={() => navigate("/manager/roomstable")}
          >
            Back to Rooms
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Room</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {/* Room Number Field */}
            <FormField
              control={form.control}
              name="roomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter room number (e.g., 101)"
                      {...field}
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Room Type Field */}
            <FormField
              control={form.control}
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select
                    key={selectKey}
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isUpdating}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={RoomType.SINGLE}>Single</SelectItem>
                      <SelectItem value={RoomType.DOUBLE}>Double</SelectItem>
                      <SelectItem value={RoomType.DELUXE}>Deluxe</SelectItem>
                      <SelectItem value={RoomType.SUITE}>Suite</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxOccupancy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Occupancy</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select max occupancy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Room Status Field */}
            <FormField
              control={form.control}
              name="roomStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isUpdating}
                    key={selectKey}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={RoomStatus.AVAILABLE}>
                        Available
                      </SelectItem>
                      <SelectItem value={RoomStatus.OCCUPIED}>
                        Occupied
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Alert for Update */}
            {isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error && "data" in error && typeof error.data === "string"
                    ? error.data
                    : "Failed to update room. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/manager/tables")}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Room...
                  </>
                ) : (
                  "Update Room"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default EditRoom;
