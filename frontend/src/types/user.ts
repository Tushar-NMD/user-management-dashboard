export type UserRole = 'Admin' | 'User';
export type UserStatus = 'Active' | 'Inactive';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
}

export type UpdateUserInput = Partial<CreateUserInput>;

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersAddedThisWeek: number;
}
