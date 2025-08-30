// store/apis/guestApi.ts
import { baseQueryWithReauth } from "@/auth/baseApi";
import type { GuestRequest } from "@/types/requestTypes";
import type { GuestResponse } from "@/types/responseTypes";
import { createApi } from "@reduxjs/toolkit/query/react";

export const guestApi = createApi({
  reducerPath: "guestApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Guest"],
  endpoints(builder) {
    return {
      getGuests: builder.query<GuestResponse[], void>({
        query: () => ({
          url: "guests",
          method: "GET",
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({ type: "Guest" as const, id })),
                { type: "Guest", id: "LIST" },
              ]
            : [{ type: "Guest", id: "LIST" }],
      }),

      getGuestById: builder.query<GuestResponse, number>({
        query: (id) => `guests/${id}`,
        providesTags: (result, error, id) => [{ type: "Guest", id }],
      }),

      createGuest: builder.mutation<GuestResponse, GuestRequest>({
        query: (newGuest) => ({
          url: "guests",
          method: "POST",
          body: newGuest,
        }),
        invalidatesTags: [{ type: "Guest", id: "LIST" }],
      }),

      updateGuest: builder.mutation<
        GuestResponse,
        { id: number; guest: GuestRequest }
      >({
        query: ({ id, guest }) => ({
          url: `guests/${id}`,
          method: "PUT",
          body: guest,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "Guest", id }],
      }),

      deleteGuest: builder.mutation<void, number>({
        query: (id) => ({
          url: `guests/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "Guest", id },
          { type: "Guest", id: "LIST" },
        ],
      }),
    };
  },
});

export const {
  useGetGuestsQuery,
  useGetGuestByIdQuery,
  useCreateGuestMutation,
  useUpdateGuestMutation,
  useDeleteGuestMutation,
} = guestApi;
