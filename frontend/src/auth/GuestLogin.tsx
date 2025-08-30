import z from "zod/v3";
import { useGuestLoginMutation, type GuestLoginRequest } from "./authApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import { FormLabel } from "@/components/ui/form";
import { FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { setGuestCredentials } from "./guestAuthSlice";

const guestLoginSchema = z.object({
  email: z
    .string()
    .email()
    .regex(
      /@(hotmail\.com|outlook\.com|gmail\.com)$/,
      "Email must be from hotmail.com, outlook.com, or gmail.com"
    )
    .min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type GuestLoginSchema = z.infer<typeof guestLoginSchema>;

function GuestLogin() {
  const [GuestLogin, { isLoading, isError, error }] = useGuestLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm<GuestLoginSchema>({
    resolver: zodResolver(guestLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleFormSubmit(data: GuestLoginSchema) {
    try {
      const loginRequest: GuestLoginRequest = {
        email: data.email,
        password: data.password,
      };

      const response = await GuestLogin(loginRequest).unwrap();
      dispatch(
        setGuestCredentials({
          token: response.token,
          user: { email: response.email, role: "GUEST" },
        })
      );
      navigate(`/guest/${response.email}`);
      console.log(response.role);
    } catch (error) {
      console.log("Error logging in", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Guest Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display error message if there's an error */}
            {isError && (
              <div className="text-red-500 text-sm">
                Login failed. Please check your credentials.
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default GuestLogin;
