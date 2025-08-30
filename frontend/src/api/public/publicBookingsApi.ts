// src/api/public/publicBookingsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BookingRequest } from "@/types/requestTypes";
import { type BookingResponse } from "@/types/responseTypes";

export const publicBookingApi = createApi({
  reducerPath: "publicBookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/hotel",
  }),
  tagTypes: ["PublicBooking"],
  endpoints(builder) {
    return {
      createBookingPublic: builder.mutation<BookingResponse, BookingRequest>({
        query: (newBooking) => ({
          url: "/bookings",
          method: "POST",
          body: newBooking,
        }),
        invalidatesTags: [{ type: "PublicBooking", id: "LIST" }],
      }),
      getBookingsByGuestEmail: builder.query<BookingResponse[], string>({
        query: (guestEmail) => ({
          url: `/bookings/guest/${guestEmail}`,
          method: "GET",
        }),
      }),
    };
  },
});

export const {
  useCreateBookingPublicMutation,
  useGetBookingsByGuestEmailQuery,
} = publicBookingApi;
