// store/apis/employeeApi.ts
import { baseQueryWithReauth } from "@/auth/baseApi";
import type { EmployeeRequest } from "@/types/requestTypes";
import type { EmployeeResponse } from "@/types/responseTypes";
import { createApi } from "@reduxjs/toolkit/query/react";

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Employee"],
  endpoints(builder) {
    return {
      getEmployees: builder.query<EmployeeResponse[], void>({
        query: () => ({
          url: "/employees",
          method: "GET",
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({ type: "Employee" as const, id })),
                { type: "Employee", id: "LIST" },
              ]
            : [{ type: "Employee", id: "LIST" }],
      }),

      getEmployeeById: builder.query<EmployeeResponse, number>({
        query: (id) => `/employees/${id}`,
        providesTags: (result, error, id) => [{ type: "Employee", id }],
      }),
      // Get employee by email
      getEmployeeByEmail: builder.query<EmployeeResponse, string>({
        query: (email) => `/employees/email/${email}`,
        providesTags: (result, error, email) => [{ type: "Employee", email }],
      }),

      createEmployee: builder.mutation<EmployeeResponse, EmployeeRequest>({
        query: (newEmployee) => ({
          url: "/employees",
          method: "POST",
          body: newEmployee,
        }),
        invalidatesTags: [{ type: "Employee", id: "LIST" }],
      }),

      updateEmployee: builder.mutation<
        EmployeeResponse,
        { id: number; employee: EmployeeRequest }
      >({
        query: ({ id, employee }) => ({
          url: `/employees/${id}`,
          method: "PUT",
          body: employee,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "Employee", id }],
      }),

      deleteEmployee: builder.mutation<void, number>({
        query: (id) => ({
          url: `/employees/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "Employee", id },
          { type: "Employee", id: "LIST" },
        ],
      }),
    };
  },
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeeByEmailQuery,
} = employeeApi;
