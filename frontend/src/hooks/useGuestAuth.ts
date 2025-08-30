// src/hooks/useGuestAuth.ts
import type { GuestUser } from "@/auth/guestAuthSlice";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export const useGuestAuth = () => {
  const { token, user, isAuthenticated } = useSelector(
    (state: RootState) => state.guestAuth
  );

  // Simpler role check for guests, or omit if always "GUEST"
  const isGuest = () => isAuthenticated && user?.role === "GUEST";

  return {
    token,
    user: user as GuestUser | null, // Explicitly type as Guest User or null
    isAuthenticated,
    isGuest, // Simple check
    // hasRole could be simplified or omitted for guests
    // hasRole: (roles: string | string[]) => isGuest() && (Array.isArray(roles) ? roles.includes("GUEST") : roles === "GUEST")
  };
};
