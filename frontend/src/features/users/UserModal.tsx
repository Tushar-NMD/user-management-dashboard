import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { CreateUserInput, User } from '../../types/user';
import { validateUserForm } from '../../utils/validators';
import { ApiError } from '../../types/api';
import { AlertCircle } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserInput) => Promise<void>;
  userToEdit?: User | null;
}

interface UserFormProps {
  userToEdit?: User | null;
  onClose: () => void;
  onSubmit: (data: CreateUserInput) => Promise<void>;
}

const UserForm: React.FC<UserFormProps> = ({ userToEdit, onClose, onSubmit }) => {
  const isEditing = Boolean(userToEdit);

  const [formData, setFormData] = useState<CreateUserInput>(() => ({
    name: userToEdit?.name || '',
    email: userToEdit?.email || '',
    phone: userToEdit?.phone || '',
    role: userToEdit?.role || 'User',
    status: userToEdit?.status || 'Active',
  }));

  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserInput, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof CreateUserInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const validation = validateUserForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      await onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone?.trim() || '',
        role: formData.role,
        status: formData.status,
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setErrors(err.errors as Partial<Record<keyof CreateUserInput, string>>);
        }
        setServerError(err.message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('An unexpected error occurred during submission.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{serverError}</div>
        </div>
      )}

      <Input
        label="Full Name"
        placeholder="e.g. Maya Chen"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        required
        disabled={submitting}
        autoFocus
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="maya@company.com"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        required
        disabled={submitting}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 000-0000"
        value={formData.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        error={errors.phone}
        helperText="Optional phone or mobile number (up to 20 characters)"
        disabled={submitting}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Role"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value as CreateUserInput['role'])}
          error={errors.role}
          disabled={submitting}
          options={[
            { value: 'User', label: 'User — Standard Access' },
            { value: 'Admin', label: 'Admin — Full Workspace Access' },
          ]}
        />

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value as CreateUserInput['status'])}
          error={errors.status}
          disabled={submitting}
          options={[
            { value: 'Active', label: 'Active — Can Log In' },
            { value: 'Inactive', label: 'Inactive — Suspended' },
          ]}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={submitting}
        >
          {isEditing ? 'Save Changes' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userToEdit,
}) => {
  const isEditing = Boolean(userToEdit);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit User Details' : 'Add New User'}
      description={
        isEditing
          ? 'Update profile information, role designation, and status.'
          : 'Create a new team member account with access credentials.'
      }
      maxWidth="md"
    >
      {isOpen && (
        <UserForm
          key={userToEdit ? userToEdit._id : 'new-user'}
          userToEdit={userToEdit}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Modal>
  );
};
