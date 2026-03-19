export type EmployeeStatus = "Active" | "On Leave" | "Terminated";

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: EmployeeStatus;
  avatarUrl?: string;
  joinDate: string;
}