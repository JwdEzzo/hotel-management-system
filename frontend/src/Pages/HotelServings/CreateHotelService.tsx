import { useCreateHotelServiceMutation } from "@/api/hotelServingsApi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServicePricingType } from "@/types/enums";
import type { HotelServiceRequest } from "@/types/requestTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod/v3";

const hotelServiceSchema = z.object({
  name: z.string().min(3, "Hotel service name is required"),
  price: z.coerce.number().min(1, "Hotel services are not for free"),
  duration: z.string().min(1, "Hotel services must have a duration"),
  pricingType: z.nativeEnum(ServicePricingType, {
    required_error: "Please select the service's type",
  }),
});

type HotelServiceValues = z.infer<typeof hotelServiceSchema>;

function CreateHotelService() {
  //
  const navigate = useNavigate();
  const [createHotelService, { isLoading, isError, error }] =
    useCreateHotelServiceMutation();

  const form = useForm<HotelServiceValues>({
    resolver: zodResolver(hotelServiceSchema),
    defaultValues: {
      name: "",
      price: 1,
      duration: "",
      pricingType: ServicePricingType.PER_HOUR,
    },
  });

  async function handleFormSubmit(data: HotelServiceValues) {
    try {
      const hotelServiceRequest: HotelServiceRequest = {
        name: data.name,
        price: data.price,
        duration: data.duration,
        pricingType: data.pricingType,
      };
      await createHotelService(hotelServiceRequest).unwrap();
      form.reset();
      navigate("/manager/tables");
    } catch (error) {
      console.log("Error creating the room", error);
      alert("Error creating room");
    }
  }

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

  return (
    <div>
      <Card className="w-full mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Create Hotel Service</CardTitle>
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the hotel service name"
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
                name="pricingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value} // Changed from defaultValue to value
                      disabled={isLoading}
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
                          step="0.01"
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
                          disabled={isLoading}
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
                        placeholder="Enter the duration"
                        {...field}
                        disabled
                        //
                      />
                    </FormControl>
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
              <div>
                <Button type="submit" disabled={isLoading} className="w-1/2">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Hotel Service...
                    </>
                  ) : (
                    "Create Hotel Service"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateHotelService;
