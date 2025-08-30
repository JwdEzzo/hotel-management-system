import type { UpdateBookingRequest } from "@/types/requestTypes";
import type {
  BookingResponse,
  UpdateBookingResponse,
} from "@/types/responseTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const updateBookingApi = createApi({
  reducerPath: "updateBookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/hotel",
    // Add authentication headers if needed
    prepareHeaders: (headers, { getState }) => {
      // Add authorization token if required
      const token = localStorage.getItem("token"); // or however you store your token
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["UpdateBooking"],
  endpoints(builder) {
    return {
      updateBooking2: builder.mutation<
        UpdateBookingResponse,
        { bookingReference: string } & UpdateBookingRequest
      >({
        query: ({ bookingReference, ...updateBookingData }) => ({
          url: `/update-booking/${bookingReference}`,
          method: "PUT",
          body: updateBookingData, // This excludes bookingReference from the body
        }),
      }),
      getUpdateBookingResponseByReference: builder.query<
        UpdateBookingResponse,
        { bookingReference: string }
      >({
        query: ({ bookingReference }) => ({
          url: `/bookings/response-entity/${bookingReference}`,
          method: "GET",
        }),
      }),
      getBookingEntityByReference: builder.query<
        BookingResponse,
        { bookingReference: string }
      >({
        query: ({ bookingReference }) => ({
          url: `/bookings/entity/${bookingReference}`,
          method: "GET",
        }),
      }),
    };
  },
});

export const {
  useUpdateBooking2Mutation,
  useGetUpdateBookingResponseByReferenceQuery,
  useGetBookingEntityByReferenceQuery,
} = updateBookingApi;
