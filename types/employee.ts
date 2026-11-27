export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth?: number | string;
  avatar?: string;
  departmentId?: string;
  department?: string;
  designation: string;
  employmentType: string;
  status: "active" | "inactive" | "on_leave" | "terminated";
  dateOfJoining: number | string;
  managerName?: string;
  workLocation?: string;
  ctc?: number;
  basicSalary?: number;
  salary?: number;
  companyId?: string;
  companyName?: string;
  branchName?: string;
  createdAt?: number;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  headName: string;
  headEmail: string;
  headAvatar?: string;
  annualBudget?: number;
  color?: string;
  companyId?: string;
  companyName?: string;
  employeeCount?: number;
}
