import { useCreateComplaintMutation } from "@/api/complaintApi";
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

import { Textarea } from "@/components/ui/textarea";
import type { ComplaintRequest } from "@/types/requestTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod/v3";

const complaintSchema = z.object({
  guestId: z.string().min(1, "Guest ID is required"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
});

type ComplaintValues = z.infer<typeof complaintSchema>;

function CreateComplaint() {
  //
  const navigate = useNavigate();
  const [createComplaint, { isLoading, isError, error }] =
    useCreateComplaintMutation();

  const form = useForm<ComplaintValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      guestId: "",
      title: "",
      message: "",
    },
  });

  async function handleFormSubmit(data: ComplaintValues) {
    try {
      const complaintRequest: ComplaintRequest = {
        guestId: Number(data.guestId),
        title: data.title,
        message: data.message,
      };
      await createComplaint(complaintRequest).unwrap();
      alert("Complaint created successfully");
      form.reset();
      navigate("/");
    } catch (error) {
      console.log("Error creating the complaint", error);
      alert("Error creating complaint");
    }
  }

  return (
    <div>
      <Card className="w-full mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Create Complaint</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="guestId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your ID"
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your complaint's title"
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
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your complaint's message"
                        {...field}
                        disabled={isLoading}
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
                        return "Failed to create complaint. Please try again.";
                      if (
                        "message" in error &&
                        typeof error.message === "string"
                      ) {
                        return error.message;
                      }
                      if ("data" in error && typeof error.data === "string") {
                        return error.data;
                      }
                      return "Failed to create complaint. Please try again.";
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
                      Creating Complaint...
                    </>
                  ) : (
                    "Create Complaint"
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

export default CreateComplaint;
