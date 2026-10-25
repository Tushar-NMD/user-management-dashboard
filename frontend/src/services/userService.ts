import { apiRequest } from './apiClient';
import { CreateUserInput, UpdateUserInput, User, UserStats } from '../types/user';

export const userService = {
  /**
   * Fetch all users
   */
  async getUsers(): Promise<User[]> {
    return apiRequest<User[]>('/users');
  },

  /**
   * Fetch dashboard statistics
   */
  async getUserStats(): Promise<UserStats> {
    return apiRequest<UserStats>('/users/stats');
  },

  /**
   * Fetch a single user by ID
   */
  async getUserById(id: string): Promise<User> {
    return apiRequest<User>(`/users/${id}`);
  },

  /**
   * Create a new user
   */
  async createUser(payload: CreateUserInput): Promise<User> {
    return apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing user
   */
  async updateUser(id: string, payload: UpdateUserInput): Promise<User> {
    return apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a user by ID
   */
  async deleteUser(id: string): Promise<void> {
    await apiRequest<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};
