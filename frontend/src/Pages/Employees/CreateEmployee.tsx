import { useCreateEmployeeMutation } from "@/api/employeesApi";
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
import { EmployeeRole2 } from "@/types/enums";
import type { EmployeeRequest } from "@/types/requestTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod/v3";

const employeeSchema = z.object({
  fullName: z.string().min(3, "Employee name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(EmployeeRole2, {
    required_error: "Role is required",
  }),
});

type EmployeeValues = z.infer<typeof employeeSchema>;

function CreateEmployee() {
  //
  const navigate = useNavigate();
  const [createEmployee, { isLoading, isError, error }] =
    useCreateEmployeeMutation();

  const form = useForm<EmployeeValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  async function handleFormSubmit(data: EmployeeValues) {
    try {
      const employeeRequest: EmployeeRequest = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
      };
      await createEmployee(employeeRequest).unwrap();
      form.reset();
      navigate("/manager/tables");
    } catch (error) {
      console.log("Error creating the employee", error);
      alert("Error creating employee");
    }
  }

  return (
    <div>
      <Card className="w-full mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Create Employee</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the employee's name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the employee's email"
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
                        type="password"
                        placeholder="Enter the employee's password"
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select manager role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={EmployeeRole2.HOUSEKEEPING}>
                          Housekeeping
                        </SelectItem>
                        <SelectItem value={EmployeeRole2.RECEPTIONIST}>
                          Receptionist
                        </SelectItem>
                        <SelectItem value={EmployeeRole2.KITCHEN}>
                          Kitchen
                        </SelectItem>
                        <SelectItem value={EmployeeRole2.MAINTENANCE}>
                          Maintenance
                        </SelectItem>
                        <SelectItem value={EmployeeRole2.MANAGER}>
                          Manager
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
                        return "Failed to create employee. Please try again.";
                      if (
                        "message" in error &&
                        typeof error.message === "string"
                      ) {
                        return error.message;
                      }
                      if ("data" in error && typeof error.data === "string") {
                        return error.data;
                      }
                      return "Failed to create employee. Please try again.";
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
                      Creating Employee...
                    </>
                  ) : (
                    "Create Employee"
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

export default CreateEmployee;
