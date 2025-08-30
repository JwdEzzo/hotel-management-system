// src/api/public/publicGuestsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { GuestRequest } from "@/types/requestTypes";
import type { GuestResponse } from "@/types/responseTypes";

export const publicGuestApi = createApi({
  reducerPath: "publicGuestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/hotel",
  }),
  tagTypes: [],
  endpoints(builder) {
    return {
      createGuestPublic: builder.mutation<GuestResponse, GuestRequest>({
        query: (newGuest) => ({
          url: "/guests",
          method: "POST",
          body: newGuest,
        }),
      }),

      // Get guests
      getGuestsPublic: builder.query<GuestResponse[], void>({
        query: () => ({
          url: "/guests",
          method: "GET",
        }),
      }),
    };
  },
});

export const { useCreateGuestPublicMutation, useGetGuestsPublicQuery } =
  publicGuestApi;
