import { baseQueryWithReauth } from "@/auth/baseApi";
import type { BookingRequest } from "@/types/requestTypes";
import { type BookingResponse } from "@/types/responseTypes";
import { createApi } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Booking"],
  endpoints(builder) {
    return {
      getBookings: builder.query<BookingResponse[], void>({
        query: () => ({
          url: "/bookings",
          method: "GET",
        }),
        providesTags: (result) =>
          result
            ? [
                // When the query succeeds (result exists):
                // 1) Individual item tags: ...result.map(({ id }) => ({ type: "Booking" as const, id }))
                // for each booking returned, this creates a tag of { type: "Booking", id } , where id is the id of the booking
                ...result.map(({ id }) => ({ type: "Booking" as const, id })),
                // If you get bookings with IDs [1, 2, 3], this creates:
                // { type: "Booking", id: 1 }
                // { type: "Booking", id: 2 }
                // { type: "Booking", id: 3 }
                //
                //
                // 2) List tag: { type: "Booking", id: "LIST" }
                // Creates a special tag representing the entire list
                // Used when you want to invalidate the whole list (like after adding a new booking)
                { type: "Booking", id: "LIST" },
              ]
            : // When the query fails (result is undefined/null):
              // Only provides the LIST tag: [{ type: "Booking", id: "LIST" }]
              [{ type: "Booking", id: "LIST" }],
      }),

      getBookingById: builder.query<BookingResponse, number>({
        query: (id) => ({
          url: `bookings/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "Booking", id }],
      }),

      createBooking: builder.mutation<BookingResponse, BookingRequest>({
        query: (newBooking) => ({
          url: "bookings",
          method: "POST",
          body: newBooking,
        }),
        // This would refetch your getBookings query since it provides the LIST tag, ensuring new bookings appear in your list automatically.
        invalidatesTags: [{ type: "Booking", id: "LIST" }],
      }),

      updateBooking: builder.mutation<
        BookingResponse,
        { id: number; booking: BookingRequest }
      >({
        query: ({ id, booking }) => ({
          url: `bookings/${id}`,
          method: "PUT",
          body: booking, // Body of the request, not the response
        }),
        // When you update booking ID 2, RTK Query will:
        // Look for all queries that provided the tag { type: "Booking", id: 2 }
        // Automatically refetch those queries
        // Update your UI with fresh data
        invalidatesTags: (result, error, { id }) => {
          // Only invalidate on success
          // If error , don't invalidate any tags, if success, invalidate the tag of [{ type: "Booking", id }]
          return error ? [] : [{ type: "Booking", id }];
        },
      }),

      deleteBooking: builder.mutation<void, number>({
        query: (id) => ({
          url: `bookings/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [{ type: "Booking", id }],
      }),
    };
  },
});

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingApi;

// createBooking: builder.mutation<BookingResponse, BookingRequest>({
//   query: function(newBooking) {
//     return {
//       url: '',
//       method: 'POST',
//       body: newBooking
//     }
//   }
// }),
