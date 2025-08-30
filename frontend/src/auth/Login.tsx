import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "./authSlice";
import { useLoginMutation, type LoginRequest } from "./authApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import z from "zod/v3";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email().includes("@hotel.com").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginSchema = z.infer<typeof loginSchema>;

function Login() {
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleFormSubmit(data: LoginSchema) {
    try {
      const loginRequest: LoginRequest = {
        email: data.email,
        password: data.password,
      };

      const response = await login(loginRequest).unwrap();
      dispatch(
        setCredentials({
          token: response.token,
          user: { email: response.email, role: response.role },
        })
      );

      navigate("/manager/tables");
    } catch (error) {
      console.log("Error logging in", error);
      alert("Login failed. Please check your credentials.");
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
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
                      placeholder="Enter your email"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      disabled={isLoading}
                      //
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              //
            >
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

export default Login;
