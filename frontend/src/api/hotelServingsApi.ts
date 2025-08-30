// store/apis/hotelServiceApi.ts
import { baseQueryWithReauth } from "@/auth/baseApi";
import type { HotelServiceRequest } from "@/types/requestTypes";
import type { HotelServiceResponse } from "@/types/responseTypes";
import { createApi } from "@reduxjs/toolkit/query/react";

export const hotelServiceApi = createApi({
  reducerPath: "hotelServiceApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["HotelService"],
  endpoints(builder) {
    return {
      getHotelServices: builder.query<HotelServiceResponse[], void>({
        query: () => ({
          url: "services",
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

      getHotelServiceById: builder.query<HotelServiceResponse, number>({
        query: (id) => `services/${id}`,
        providesTags: (result, error, id) => [{ type: "HotelService", id }],
      }),

      createHotelService: builder.mutation<
        HotelServiceResponse,
        HotelServiceRequest
      >({
        query: (newService) => ({
          url: "services",
          method: "POST",
          body: newService,
        }),
        invalidatesTags: [{ type: "HotelService", id: "LIST" }],
      }),

      updateHotelService: builder.mutation<
        HotelServiceResponse,
        { id: number; service: HotelServiceRequest }
      >({
        query: ({ id, service }) => ({
          url: `services/${id}`,
          method: "PUT",
          body: service,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "HotelService", id },
        ],
      }),

      deleteHotelService: builder.mutation<void, number>({
        query: (id) => ({
          url: `services/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "HotelService", id },
          { type: "HotelService", id: "LIST" },
        ],
      }),
    };
  },
});

export const {
  useGetHotelServicesQuery,
  useGetHotelServiceByIdQuery,
  useCreateHotelServiceMutation,
  useUpdateHotelServiceMutation,
  useDeleteHotelServiceMutation,
} = hotelServiceApi;
