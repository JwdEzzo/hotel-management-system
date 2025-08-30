import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface GuestUser {
  email: string;
  role: "GUEST";
}

interface AuthState {
  token: string | null;
  user: GuestUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const guestAuthSlice = createSlice({
  name: "guestAuth",
  initialState,
  reducers: {
    setGuestCredentials: (
      state,
      action: PayloadAction<{ token: string; user: GuestUser }>
    ) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export default guestAuthSlice.reducer;
export const { setGuestCredentials, logout } = guestAuthSlice.actions;
