import type { ApplyBookingRequest } from "@/types/requestTypes";
import type { ApplyBookingResponse } from "@/types/responseTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const applyBookingApi = createApi({
  reducerPath: "applybookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/hotel",
  }),
  tagTypes: ["ApplyBooking"],
  endpoints(builder) {
    return {
      createApplyBooking: builder.mutation<
        ApplyBookingResponse,
        ApplyBookingRequest
      >({
        query: (newApplyBooking) => ({
          url: "/apply-booking",
          method: "POST",
          body: newApplyBooking,
        }),
      }),
    };
  },
});

export const { useCreateApplyBookingMutation } = applyBookingApi;
