// store/apis/baseApi.ts - Base query with auth
import type { RootState } from "@/store/store";
import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080/api/hotel",
  credentials: "include", // Send back our httpOnly cookies with every request
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token; // Get the auth token from the store
    console.log("Token from store:", token);
    if (token) {
      headers.set("authorization", `Bearer ${token}`); // Set the authorization header, if the token exists
      console.log("Authorization header set:", `Bearer ${token}`);
    }
    return headers; // We are attaching the access token to the headers with every request, likewise with the cookie, we are attaching the credentials in the cookie everytime
  },
});

// Wrap the baseQuery with reauth logic, because if the token is expired or invalid, we can reattempt after sending the refresh token and getting a new access token
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Token expired or invalid, logout user
    api.dispatch(logout());
  }

  return result;
};
export { baseQueryWithReauth };

//admin@hotel.com
