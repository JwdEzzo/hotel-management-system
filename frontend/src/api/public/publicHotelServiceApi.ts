import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { GuestRequest } from "@/types/requestTypes";
import type {
  GuestResponse,
  HotelServiceResponse,
} from "@/types/responseTypes";

export const publicHotelServiceApi = createApi({
  reducerPath: "publicHotelServiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/hotel",
  }),
  tagTypes: ["HotelService"],
  endpoints(builder) {
    return {
      getPublicHotelServices: builder.query<HotelServiceResponse[], void>({
        query: () => ({
          url: "/services",
          method: "GET",
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({
                  type: "HotelService" as const,
                  id,
                })),
                { type: "HotelService", id: "LIST" },
              ]
            : [{ type: "HotelService", id: "LIST" }],
      }),
    };
  },
});

export const { useGetPublicHotelServicesQuery } = publicHotelServiceApi;
