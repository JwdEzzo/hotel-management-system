import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import z from "zod/v3";
import { useEffect, useState } from "react";
import {
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
} from "@/api/employeesApi";
import type { EmployeeRequest } from "@/types/requestTypes";
import { EmployeeRole2 } from "@/types/enums";

const employeeSchema = z.object({
  fullName: z.string().min(3, "Employee name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(EmployeeRole2, {
    required_error: "Role is required",
  }),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

function EditEmployee() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [selectKey, setSelectKey] = useState(0);

  // Fetch existing employee data
  const {
    data: employee,
    isLoading: isEmployeeLoading,
    isError: isEmployeeError,
    error: employeeError,
  } = useGetEmployeeByIdQuery(Number(employeeId), {
    skip: !employeeId, // Skip query if employeeId is not available
  });

  // Initialize update mutation
  const [updateEmployee, { isLoading: isUpdating, isError, error }] =
    useUpdateEmployeeMutation();

  // Initialize form with react-hook-form and Zod resolver
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      fullName: employee?.fullName,
      email: employee?.email,
      password: employee?.password, // Don't populate password for security
      role: employee?.role as EmployeeRole2,
    },
  });

  // Set form values once employee dat v a is fetched
  useEffect(() => {
    if (employee) {
      form.reset({
        fullName: employee.fullName,
        email: employee.email,
        password: "", // Don't populate password for security
        role: employee.role,
      });
      setSelectKey((prev) => prev + 1);
    }
  }, [employee, form]);

  // Handle form submission
  async function handleFormSubmit(data: EmployeeFormValues) {
    if (!employeeId) return; // Safety check

    try {
      const employeeRequest: EmployeeRequest = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      await updateEmployee({
        id: Number(employeeId),
        employee: employeeRequest,
      }).unwrap(); // Perform update
      navigate("/manager/tables"); // Navigate back to employees list on success
    } catch (error) {
      console.error("Error updating the employee:", error);
      // Error alert will be shown via isError and error state
    }
  }

  // Handle loading state
  if (isEmployeeLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading employee details...</span>
      </div>
    );
  }

  // Handle error state for fetching employee
  if (isEmployeeError || !employee) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-4">
        <AlertDescription>
          {employeeError &&
          "data" in employeeError &&
          typeof employeeError.data === "string"
            ? employeeError.data
            : "Failed to load employee details. Please try again."}
        </AlertDescription>
        <div className="mt-2">
          <Button
            variant="outline"
            onClick={() => navigate("/manager/employeestable")}
          >
            Back to Employees
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Employee</CardTitle>
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
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter full name"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    key={selectKey}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isUpdating}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={EmployeeRole2.MANAGER}>
                        Manager
                      </SelectItem>
                      <SelectItem value={EmployeeRole2.RECEPTIONIST}>
                        Receptionist
                      </SelectItem>
                      <SelectItem value={EmployeeRole2.HOUSEKEEPING}>
                        Housekeeping
                      </SelectItem>
                      <SelectItem value={EmployeeRole2.MAINTENANCE}>
                        Maintenance
                      </SelectItem>
                      <SelectItem value={EmployeeRole2.KITCHEN}>
                        Kitchen
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
                    : "Failed to update employee. Please try again."}
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
                    Updating employee...
                  </>
                ) : (
                  "Update Employee"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default EditEmployee;
