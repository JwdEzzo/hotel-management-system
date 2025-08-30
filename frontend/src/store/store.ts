// src/store/store.ts - FIXED VERSION
import { bookingApi } from "@/api/bookingsApi";
import { guestApi } from "@/api/guestsApi";
import { configureStore } from "@reduxjs/toolkit";
import { roomApi } from "@/api/roomsApi";
import { employeeApi } from "@/api/employeesApi";
import { hotelServiceApi } from "@/api/hotelServingsApi";
import { authApi } from "@/auth/authApi";
import { applyBookingApi } from "@/api/applyBookingApi";
import authSlice from "@/auth/authSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { publicBookingApi } from "@/api/public/publicBookingsApi";
import { publicHotelServiceApi } from "@/api/public/publicHotelServiceApi";
import { publicRoomsApi } from "@/api/public/publicRoomsApi";
import { publicGuestApi } from "@/api/public/publicGuestsApi";
import { complaintApi } from "@/api/complaintApi";
import { updateBookingApi } from "@/api/updateBookingApi";
import guestAuthSlice from "@/auth/guestAuthSlice";
import { publicContactUsApi } from "@/api/public/publicContactUsApi";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    guestAuth: guestAuthSlice,
    [authApi.reducerPath]: authApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [guestApi.reducerPath]: guestApi.reducer,
    [roomApi.reducerPath]: roomApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [hotelServiceApi.reducerPath]: hotelServiceApi.reducer,
    [applyBookingApi.reducerPath]: applyBookingApi.reducer,
    [publicBookingApi.reducerPath]: publicBookingApi.reducer,
    [publicHotelServiceApi.reducerPath]: publicHotelServiceApi.reducer,
    [publicRoomsApi.reducerPath]: publicRoomsApi.reducer,
    [publicGuestApi.reducerPath]: publicGuestApi.reducer,
    [complaintApi.reducerPath]: complaintApi.reducer,
    [updateBookingApi.reducerPath]: updateBookingApi.reducer,
    [publicContactUsApi.reducerPath]: publicContactUsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      bookingApi.middleware,
      guestApi.middleware,
      roomApi.middleware,
      employeeApi.middleware,
      hotelServiceApi.middleware,
      authApi.middleware,
      applyBookingApi.middleware,
      publicBookingApi.middleware,
      publicHotelServiceApi.middleware,
      publicRoomsApi.middleware,
      publicGuestApi.middleware,
      complaintApi.middleware,
      updateBookingApi.middleware,
      publicContactUsApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
