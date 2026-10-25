import { CreateUserInput } from '../types/user';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof CreateUserInput, string>>;
}

export function validateUserForm(data: Partial<CreateUserInput>): ValidationResult {
  const errors: Partial<Record<keyof CreateUserInput, string>> = {};

  // Name validation
  if (!data.name || !data.name.trim()) {
    errors.name = 'Full name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (data.name.trim().length > 50) {
    errors.name = 'Name cannot exceed 50 characters';
  }

  // Email validation
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address';
  }

  // Phone validation (optional)
  if (data.phone && data.phone.trim().length > 20) {
    errors.phone = 'Phone number cannot exceed 20 characters';
  }

  // Role validation
  if (data.role && data.role !== 'Admin' && data.role !== 'User') {
    errors.role = 'Role must be Admin or User';
  }

  // Status validation
  if (data.status && data.status !== 'Active' && data.status !== 'Inactive') {
    errors.status = 'Status must be Active or Inactive';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
