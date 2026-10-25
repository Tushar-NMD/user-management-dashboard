import React, { useState, useMemo } from 'react';
import {
  Edit2,
  Trash2,
  Power,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  UserPlus,
} from 'lucide-react';
import { User } from '../../types/user';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import { formatDate, getAvatarColor, getUserInitials } from '../../utils/formatters';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onAddUser: () => void;
  onClearFilters?: () => void;
  isFiltered?: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
  onAddUser,
  onClearFilters,
  isFiltered = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default to 5 so pagination is active with 5+ users

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const effectivePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (effectivePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, users.length);

  const paginatedUsers = useMemo(
    () => users.slice(startIndex, endIndex),
    [users, startIndex, endIndex]
  );

  // Generate page numbers array (e.g. [1, 2, 3])
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, effectivePage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [effectivePage, totalPages]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-12 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-xs font-medium text-slate-500">Loading user directory...</p>
      </div>
    );
  }

  if (users.length === 0) {
    if (isFiltered) {
      return (
        <EmptyState
          title="No users matched your filter criteria"
          description="Try adjusting your search query, status, or role filter to view results."
          actionLabel="Clear Filters"
          onAction={onClearFilters}
        />
      );
    }

    return (
      <EmptyState
        icon={<UserPlus className="w-6 h-6 text-indigo-500" />}
        title="No users in database yet"
        description="Your user directory is currently empty. Create your first team member to get started."
        actionLabel="Create First User"
        onAction={onAddUser}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="px-6 py-3.5">
                Name
              </th>
              <th scope="col" className="px-4 py-3.5">
                Email
              </th>
              <th scope="col" className="px-4 py-3.5">
                Role
              </th>
              <th scope="col" className="px-4 py-3.5">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5">
                Phone
              </th>
              <th scope="col" className="px-4 py-3.5">
                Created Date
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedUsers.map((user) => {
              const avatarColor = getAvatarColor(user.name);
              return (
                <tr
                  key={user._id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Name with Avatar (without email) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border select-none"
                        style={{
                          backgroundColor: avatarColor.bg,
                          color: avatarColor.text,
                          borderColor: avatarColor.border,
                        }}
                      >
                        {getUserInitials(user.name)}
                      </div>
                      <div className="font-semibold text-slate-900 text-sm truncate">
                        {user.name}
                      </div>
                    </div>
                  </td>

                  {/* Separate Dedicated Email Column */}
                  <td className="px-4 py-4 text-slate-600 font-mono text-xs">
                    <span className="truncate max-w-[200px] inline-block" title={user.email}>
                      {user.email}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-4">
                    <Badge role={user.role} />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <Badge status={user.status} />
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-4 text-slate-600 font-mono text-[11px]">
                    {user.phone || '—'}
                  </td>

                  {/* Created Date */}
                  <td className="px-4 py-4 text-slate-500">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Row Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Toggle Status */}
                      <button
                        type="button"
                        onClick={() => onToggleStatus(user)}
                        title={user.status === 'Active' ? 'Deactivate user' : 'Activate user'}
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        aria-label={`Toggle status for ${user.name}`}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit User */}
                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        title="Edit user"
                        className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        aria-label={`Edit ${user.name}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete User */}
                      <button
                        type="button"
                        onClick={() => onDelete(user)}
                        title="Delete user"
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label={`Delete ${user.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination Controls Bar */}
      <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        {/* Left Side: Summary & Page Size Selector */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div>
            Showing{' '}
            <span className="font-semibold text-slate-700">
              {startIndex + 1}–{endIndex}
            </span>{' '}
            of <span className="font-semibold text-slate-700">{users.length}</span> users
          </div>

          <div className="flex items-center gap-1.5">
            <label htmlFor="user-page-size" className="text-slate-400 text-[11px] whitespace-nowrap">
              Rows:
            </label>
            <select
              id="user-page-size"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Right Side: Interactive Pagination Buttons */}
        <div className="flex items-center gap-1 select-none">
          {/* First Page */}
          <Button
            variant="outline"
            size="sm"
            disabled={effectivePage <= 1}
            onClick={() => setCurrentPage(1)}
            icon={<ChevronsLeft className="w-3.5 h-3.5" />}
            className="h-8 w-8 p-0"
            title="First page"
            aria-label="First page"
          />

          {/* Previous Page */}
          <Button
            variant="outline"
            size="sm"
            disabled={effectivePage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            icon={<ChevronLeft className="w-3.5 h-3.5" />}
            className="h-8 px-2.5"
            aria-label="Previous page"
          >
            Prev
          </Button>

          {/* Numbered Page Buttons */}
          <div className="flex items-center gap-1 px-1">
            {pageNumbers.map((num) => {
              const isActive = num === effectivePage;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPage(num)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'theme-btn-primary shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Next Page */}
          <Button
            variant="outline"
            size="sm"
            disabled={effectivePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            icon={<ChevronRight className="w-3.5 h-3.5" />}
            iconPosition="right"
            className="h-8 px-2.5"
            aria-label="Next page"
          >
            Next
          </Button>

          {/* Last Page */}
          <Button
            variant="outline"
            size="sm"
            disabled={effectivePage >= totalPages}
            onClick={() => setCurrentPage(totalPages)}
            icon={<ChevronsRight className="w-3.5 h-3.5" />}
            className="h-8 w-8 p-0"
            title="Last page"
            aria-label="Last page"
          />
        </div>
      </div>
    </div>
  );
};
