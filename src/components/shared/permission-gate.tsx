"use client";

import { useAuthStore, UserRole } from "@/store/use-auth-store";

interface PermissionGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function PermissionGate({ 
  children, 
  allowedRoles, 
  fallback = null 
}: PermissionGateProps) {
  const user = useAuthStore((state) => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}