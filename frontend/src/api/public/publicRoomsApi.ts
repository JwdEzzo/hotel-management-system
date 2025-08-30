import type { RoomResponse } from "@/types/responseTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicRoomsApi = createApi({
  reducerPath: "publicRoomsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/hotel",
  }),
  tagTypes: ["Room"],
  endpoints(builder) {
    return {
      getPublicRooms: builder.query<RoomResponse[], void>({
        query: () => ({
          url: "/rooms",
          method: "GET",
        }),
        providesTags: ["Room"],
      }),
      getAvailableRooms: builder.query<
        RoomResponse[],
        { checkIn: string; checkOut: string }
      >({
        query: ({ checkIn, checkOut }) => ({
          url: `/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`,
          method: "GET",
        }),
        providesTags: ["Room"],
      }),
    };
  },
});

export const { useGetPublicRoomsQuery, useGetAvailableRoomsQuery } =
  publicRoomsApi;
