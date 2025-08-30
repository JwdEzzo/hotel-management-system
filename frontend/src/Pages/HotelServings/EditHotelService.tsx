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
import type { HotelServiceRequest } from "../../types/requestTypes";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import z from "zod/v3";
import { useEffect, useState } from "react";
import {
  useGetHotelServiceByIdQuery,
  useUpdateHotelServiceMutation,
} from "@/api/hotelServingsApi";
import { ServicePricingType } from "@/types/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const hotelServiceSchema = z.object({
  name: z.string().min(3, "Hotel service name is required"),
  price: z.number().min(0.01, "Price must be at least $0.01"),
  duration: z.string().min(1, "Hotel services must have a duration"),
  pricingType: z.nativeEnum(ServicePricingType, {
    required_error: "Please select the service's type",
  }),
});

type HotelServiceFormValues = z.infer<typeof hotelServiceSchema>;

function EditHotelService() {
  const { hotelServiceId } = useParams<{ hotelServiceId: string }>();
  const navigate = useNavigate();
  const [selectKey, setSelectKey] = useState(0);

  // Fetch existing hotelservice data
  const {
    data: hotelService,
    isLoading: isServiceLoading,
    isError: isServiceError,
    error: hotelServiceError,
  } = useGetHotelServiceByIdQuery(Number(hotelServiceId), {
    skip: !hotelServiceId, // Skip query if hotelserviceId is not available
  });

  // Initialize update mutation
  const [updateHotelService, { isLoading: isUpdating, isError, error }] =
    useUpdateHotelServiceMutation();

  // Initialize form with react-hook-form and Zod resolver
  const form = useForm<HotelServiceFormValues>({
    resolver: zodResolver(hotelServiceSchema),
    defaultValues: {
      name: hotelService?.name,
      price: hotelService?.price,
      duration: hotelService?.duration,
      pricingType: hotelService?.pricingType,
    },
  });

  // Set form values once hotelservice data is fetched
  useEffect(() => {
    if (hotelService) {
      console.log("The first call:", hotelService.pricingType);
      form.reset({
        name: hotelService.name,
        price: hotelService.price,
        duration: hotelService.duration,
        pricingType: hotelService.pricingType,
      });
      console.log("The second call:", hotelService.pricingType);

      // Force Select to re-render
      setSelectKey((prev) => prev + 1);
    }
  }, [hotelService, form]);

  useEffect(() => {
    const pricingType = form.watch("pricingType");
    if (pricingType) {
      const suggestedDuration = {
        [ServicePricingType.PER_HOUR]: "1 Hour",
        [ServicePricingType.PER_NIGHT]: "N/A",
        [ServicePricingType.PER_ORDER]: "N/A",
      }[pricingType];

      form.setValue("duration", suggestedDuration);
    }
  }, [form.watch("pricingType")]);

  // Handle form submission
  async function handleFormSubmit(data: HotelServiceFormValues) {
    if (!hotelServiceId) return; // Safety check

    try {
      const hotelServiceRequest: HotelServiceRequest = {
        name: data.name,
        price: data.price,
        duration: data.duration,
        pricingType: data.pricingType,
      };

      await updateHotelService({
        id: Number(hotelServiceId),
        service: hotelServiceRequest,
      }).unwrap(); // Perform update
      navigate("/manager/tables");
    } catch (error) {
      console.error("Error updating the hotel service:", error);
    }
  }

  // Handle loading state
  if (isServiceLoading || !hotelService) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading service details...</span>
      </div>
    );
  }

  // Handle error state for fetching hotel service
  if (isServiceError || !hotelService) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-4">
        <AlertDescription>
          {hotelServiceError &&
          "data" in hotelServiceError &&
          typeof hotelServiceError.data === "string"
            ? hotelServiceError.data
            : "Failed to load hotel service details. Please try again."}
        </AlertDescription>
        <div className="mt-2">
          <Button
            variant="outline"
            onClick={() => navigate("/manager/hotelservicestable")}
          >
            Back to Hotel Services
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Hotel Service</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Service Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter hotel service name"
                      {...field}
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pricingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Type</FormLabel>
                  <Select
                    key={selectKey} // Add this key to force re-render
                    onValueChange={field.onChange}
                    value={field.value?.toString() || ""}
                    disabled={isServiceLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ServicePricingType.PER_HOUR}>
                        Per Hour
                      </SelectItem>
                      <SelectItem value={ServicePricingType.PER_NIGHT}>
                        Per Night
                      </SelectItem>
                      <SelectItem value={ServicePricingType.PER_ORDER}>
                        Per Order
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <Input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="0.00"
                        className="pl-8"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                        disabled={isUpdating}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter hotel service duration"
                      {...field}
                      disabled
                    />
                  </FormControl>
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
                    : "Failed to update service. Please try again."}
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
                    Updating service...
                  </>
                ) : (
                  "Update Hotel Service"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default EditHotelService;
