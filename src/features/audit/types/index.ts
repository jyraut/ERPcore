export interface AuditLog {
  id: string;
  timestamp: string;
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN";
  module: "INVENTORY" | "HR" | "FINANCE" | "SETTINGS";
  description: string;
  metadata?: {
    previousState?: Record<string, any>;
    newState?: Record<string, any>;
  };
}