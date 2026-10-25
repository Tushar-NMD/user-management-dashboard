import React, { useState, useMemo } from 'react';
import { User, CreateUserInput } from '../../types/user';
import { UserFilterBar } from './UserFilterBar';
import { UserTable } from './UserTable';
import { UserModal } from './UserModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Toast, ToastType } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import { userService } from '../../services/userService';

interface UsersPageProps {
  users: User[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onOpenAddModal: () => void;
}

export const UsersPage: React.FC<UsersPageProps> = ({
  users,
  loading,
  onRefresh,
  onOpenAddModal,
}) => {
  // Filtering states
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Edit and Delete dialog states
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Local Toast notifications for edit/delete
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleUpdateUser = async (data: CreateUserInput) => {
    if (!userToEdit) return;
    await userService.updateUser(userToEdit._id, data);
    await onRefresh();
    showToast('success', `User ${data.name} updated successfully.`);
    setUserToEdit(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await userService.deleteUser(userToDelete._id);
      await onRefresh();
      showToast('success', `User ${userToDelete.name} was deleted successfully.`);
      setUserToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete user';
      showToast('error', msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await userService.updateUser(user._id, { status: newStatus });
      await onRefresh();
      showToast('info', `User ${user.name} marked as ${newStatus}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update user status';
      showToast('error', msg);
    }
  };

  const isFiltered = Boolean(search.trim() || roleFilter !== 'ALL' || statusFilter !== 'ALL');

  return (
    <div className="space-y-5">
      {/* Toast Banner */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Team Members</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage user accounts, permissions, and status across your workspace.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onOpenAddModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Add New User
        </Button>
      </div>

      {/* Filter Bar */}
      <UserFilterBar
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onResetFilters={() => {
          setSearch('');
          setRoleFilter('ALL');
          setStatusFilter('ALL');
        }}
        totalCount={users.length}
        filteredCount={filteredUsers.length}
      />

      {/* Users Table */}
      <UserTable
        users={filteredUsers}
        loading={loading}
        onEdit={(user) => setUserToEdit(user)}
        onDelete={(user) => setUserToDelete(user)}
        onToggleStatus={handleToggleStatus}
        onAddUser={onOpenAddModal}
        onClearFilters={() => {
          setSearch('');
          setRoleFilter('ALL');
          setStatusFilter('ALL');
        }}
        isFiltered={isFiltered}
      />

      {/* Edit User Modal */}
      <UserModal
        isOpen={Boolean(userToEdit)}
        onClose={() => setUserToEdit(null)}
        onSubmit={handleUpdateUser}
        userToEdit={userToEdit}
      />

      {/* Explicit Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        title="Delete User Account"
        message={
          userToDelete
            ? `Are you sure you want to delete ${userToDelete.name} (${userToDelete.email})? This action cannot be undone and will permanently remove this user from the database.`
            : ''
        }
        confirmLabel="Delete User"
        isDestructive
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleting) setUserToDelete(null);
        }}
      />
    </div>
  );
};
