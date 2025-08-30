import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export const useAuth = () => {
  const { token, user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const isManager = () => hasRole("MANAGER");
  const isReceptionist = () => hasRole(["MANAGER", "RECEPTIONIST"]);
  const isHousekeeping = () =>
    hasRole(["MANAGER", "RECEPTIONIST", "HOUSEKEEPING"]);

  return {
    token,
    user,
    isAuthenticated,
    hasRole,
    isManager,
    isReceptionist,
    isHousekeeping,
  };
};
