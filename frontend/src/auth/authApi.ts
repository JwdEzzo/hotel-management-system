// store/apis/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  email: string;
  role: "MANAGER" | "RECEPTIONIST" | "HOUSEKEEPING" | "MAINTENANCE" | "KITCHEN";
}

export interface GuestLoginRequest {
  email: string;
  password: string;
}

export interface GuestLoginResponse {
  token: string;
  type: string;
  email: string;
  role: "GUEST";
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/auth",
  }),
  endpoints(builder) {
    return {
      login: builder.mutation<LoginResponse, LoginRequest>({
        query: (credentials) => ({
          url: "/login",
          method: "POST",
          body: credentials,
        }),
      }),
      guestLogin: builder.mutation<GuestLoginResponse, GuestLoginRequest>({
        query: (credentials) => ({
          url: "/guestlogin",
          method: "POST",
          body: credentials,
        }),
      }),
    };
  },
});

export const { useLoginMutation, useGuestLoginMutation } = authApi;
