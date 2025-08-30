import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateRoomMutation } from "@/api/roomsApi";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod/v3";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RoomRequest } from "../../types/requestTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RoomStatus, RoomType } from "@/types/enums";
import { useEffect } from "react";

const roomSchema = z
  .object({
    roomNumber: z.string().min(1, "Room number is required"),
    roomType: z.nativeEnum(RoomType, {
      required_error: "Please select a room type",
    }),
    maxOccupancy: z.number().min(1, "Max occupancy is required"),
    roomStatus: z.nativeEnum(RoomStatus, {
      required_error: "Please select a room status",
    }),
  })
  .refine(
    (data) => {
      switch (data.roomType) {
        case RoomType.SINGLE:
          return data.maxOccupancy === 1;
        case RoomType.DOUBLE:
          return data.maxOccupancy === 2;
        case RoomType.DELUXE:
          return data.maxOccupancy === 3;
        case RoomType.SUITE:
          return data.maxOccupancy === 4;
        default:
          return false;
      }
    },
    {
      message: "Max occupancy must match the room type",
      path: ["maxOccupancy"],
    }
  );

type RoomFormValues = z.infer<typeof roomSchema>;

function CreateRoom() {
  const [createRoom, { isLoading, isError, error }] = useCreateRoomMutation();
  const navigate = useNavigate();

  const form = useForm<RoomFormValues>({
    // The zodResolver is a function that integrates Zod with react-hook-form. It is passed to the resolver option of the useForm hook, which tells react-hook-form to use the Zod schema for validation. When the form is submitted, react-hook-form will automatically validate the form data against the roomSchema using the zodResolver
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: "",
      roomType: RoomType.SINGLE,
      roomStatus: RoomStatus.AVAILABLE,
      maxOccupancy: 1,
    },
  });

  async function handleFormSubmit(data: RoomFormValues) {
    try {
      const roomRequest: RoomRequest = {
        roomNumber: data.roomNumber,
        roomStatus: data.roomStatus,
        roomType: data.roomType,
        maxOccupancy: data.maxOccupancy,
      };
      // The unwrap method is called on the result of the mutation, which returns a promise that resolves with the data from the server if the mutation is successful, or rejects with an error if the mutation fails. The use of the unwrap method is a common pattern when working with RTK Query, as it simplifies the handling of the mutation's result. By awaiting the result of the unwrap method, the onSubmit function can handle both the success and error cases of the mutation in a clean and concise way.
      await createRoom(roomRequest).unwrap();
      form.reset();
      navigate("/manager/tables");
    } catch (error) {
      console.log("Error creating the room", error);
      alert("Error creating room");
    }
  }

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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Room</CardTitle>
      </CardHeader>
      <CardContent>
        {/* <Form
            control={form.control}
            handleSubmit={form.handleSubmit}
            watch={form.watch}
            reset={form.reset}
          ></Form> */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="roomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter room number (e.g.,101)"
                      {...field}
                      disabled={isLoading}
                      //
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
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
            <FormField
              control={form.control}
              name="roomStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
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

            {/* Error Alert */}
            {isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {(() => {
                    if (!error)
                      return "Failed to create room. Please try again.";
                    if (
                      "message" in error &&
                      typeof error.message === "string"
                    ) {
                      return error.message;
                    }
                    if ("data" in error && typeof error.data === "string") {
                      return error.data;
                    }
                    return "Failed to create room. Please try again.";
                  })()}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Room...
                </>
              ) : (
                "Create Room"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default CreateRoom;

// What's in the field object:
//
// field = {
//   name: "roomNumber",        // field name
//   value: "",                 // current field value
//   onChange: Function,        // function to update value
//   onBlur: Function,          // function to handle blur
//   ref: RefObject            // reference for focus management
// }

// // This is roughly what FormField does internally:
// const fieldProps = {
//   name: "roomNumber",
//   value: formValues.roomNumber,
//   onChange: (e) => updateFormValue("roomNumber", e.target.value),
//   onBlur: () => markFieldAsTouched("roomNumber"),
//   ref: someRef
// };

// // Then it calls your render function:
// render({ field: fieldProps, formState: formState, etc... })

{
  /* <Input {...field} />
  <==>
    <Input 
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      ref={field.ref}
/> */
}

// FormMessage component is used to display any validation errors for the field. If the user tries to submit the form without entering a room number, the FormMessage component will display the error message "Room number is required", as defined in the roomSchema
