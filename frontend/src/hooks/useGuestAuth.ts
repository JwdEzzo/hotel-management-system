// src/hooks/useGuestAuth.ts
import type { GuestUser } from "@/auth/guestAuthSlice";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export const useGuestAuth = () => {
  const { token, user, isAuthenticated } = useSelector(
    (state: RootState) => state.guestAuth
  );

  const isGuest = () => isAuthenticated && user?.role === "GUEST";

  return {
    token,
    user: user as GuestUser | null,
    isAuthenticated,
    isGuest,
  };
};
