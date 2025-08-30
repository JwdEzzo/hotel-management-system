// src/api/public/publicBookingsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ContactUsRequest } from "@/types/requestTypes";
import { type ContactUsResponse } from "@/types/responseTypes";

export const publicContactUsApi = createApi({
  reducerPath: "publicContactUsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/hotel",
  }),
  tagTypes: ["PublicContactUs"],
  endpoints(builder) {
    return {
      createContactUs: builder.mutation<ContactUsResponse, ContactUsRequest>({
        query: (newContactUs) => ({
          url: "/contact-us",
          method: "POST",
          body: newContactUs,
        }),
        invalidatesTags: [{ type: "PublicContactUs", id: "LIST" }],
      }),
      getAllContactUs: builder.query<ContactUsResponse[], void>({
        query: () => ({
          url: `/contact-us`,
          method: "GET",
        }),
      }),
    };
  },
});

export const { useCreateContactUsMutation, useGetAllContactUsQuery } =
  publicContactUsApi;
