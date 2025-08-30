import type { ComplaintRequest } from "@/types/requestTypes";
import type { ComplaintResponse } from "@/types/responseTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const complaintApi = createApi({
  reducerPath: "complaintApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/hotel",
  }),
  tagTypes: ["Complaint"],
  endpoints(builder) {
    return {
      createComplaint: builder.mutation<ComplaintResponse, ComplaintRequest>({
        query: (newComplaint) => ({
          url: "/complaints",
          method: "POST",
          body: newComplaint,
        }),
        invalidatesTags: [{ type: "Complaint", id: "LIST" }],
      }),
      getComplaints: builder.query<ComplaintResponse[], void>({
        query: () => ({
          url: "/complaints",
          method: "GET",
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({ type: "Complaint" as const, id })),
                { type: "Complaint", id: "LIST" },
              ]
            : [{ type: "Complaint", id: "LIST" }],
      }),
      getComplaintById: builder.query<ComplaintResponse, number>({
        query: (id) => `complaints/${id}`,
        providesTags: (result, error, id) => [{ type: "Complaint", id }],
      }),
      updateComplaint: builder.mutation<
        ComplaintResponse,
        { id: number; complaint: ComplaintRequest }
      >({
        query: ({ id, complaint }) => ({
          url: `/complaints/${id}`,
          method: "PUT",
          body: complaint,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Complaint", id },
          { type: "Complaint", id: "LIST" },
        ],
      }),
      deleteComplaint: builder.mutation<void, number>({
        query: (id) => ({
          url: `/complaints/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "Complaint", id: "LIST" }],
      }),
    };
  },
});

export const {
  useCreateComplaintMutation,
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
  useUpdateComplaintMutation,
  useDeleteComplaintMutation,
} = complaintApi;
